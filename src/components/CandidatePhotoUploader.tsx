import React, { useRef, useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, UploadCloud, Trash2, CheckCircle2, AlertCircle, RefreshCw, X, Video } from 'lucide-react';

interface CandidatePhotoUploaderProps {
  photoUrl: string;
  onPhotoChange: (base64Url: string) => void;
  onPhotoRemove?: () => void;
  required?: boolean;
  label?: string;
  subLabel?: string;
  compact?: boolean;
  className?: string;
}

export const CandidatePhotoUploader: React.FC<CandidatePhotoUploaderProps> = ({
  photoUrl,
  onPhotoChange,
  onPhotoRemove,
  required = true,
  label = 'उम्मीदवार / लाभार्थी का पासपोर्ट फोटो (Candidate Photo)',
  subLabel = 'प्रमाण पत्र एवं पहचान पत्र पर आधिकारिक मुद्रण हेतु अनिवार्य',
  compact = false,
  className = ''
}) => {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Stop camera stream on unmount or close
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Compress and convert image file to Base64 data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('कृपया केवल इमेज फाइल (JPG, PNG, JPEG) चुनें।');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          onPhotoChange(compressedDataUrl);
        } else {
          onPhotoChange(e.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setIsProcessing(false);
        onPhotoChange(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // reset input so selecting the same file triggers change
    e.target.value = '';
  };

  const handleNativeCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  // Launch live webcam capture if supported, else fallback to native camera input
  const startLiveCamera = async (facing: 'user' | 'environment' = 'user') => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Fallback to mobile native capture input
      cameraInputRef.current?.click();
      return;
    }

    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      setIsLiveCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Live camera error or permission denied, using input fallback:', err);
      setIsLiveCameraOpen(false);
      // Fallback to native capture input
      cameraInputRef.current?.click();
    }
  };

  const switchCameraFacing = () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    startLiveCamera(nextFacing);
  };

  const captureLivePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // If front camera, mirror horizontally for natural feel
      if (cameraFacing === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onPhotoChange(dataUrl);
      closeLiveCamera();
    }
  };

  const closeLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsLiveCameraOpen(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      id="candidate-photo-uploader-container"
      className={`bg-amber-50/80 border-2 ${
        photoUrl ? 'border-emerald-300 bg-emerald-50/30' : 'border-amber-300'
      } rounded-2xl p-3.5 sm:p-4 shadow-xs transition-all ${className}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Hidden File Inputs */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleGalleryChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleNativeCameraChange}
      />

      {/* Main Layout Header & Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Thumbnail & Labels */}
        <div className="flex items-center gap-3">
          {/* Photo Thumbnail / Placeholder */}
          <div className="relative shrink-0">
            {photoUrl ? (
              <div className="relative w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-md bg-white">
                <img
                  src={photoUrl}
                  alt="Candidate"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ) : (
              <div
                onClick={() => galleryInputRef.current?.click()}
                className={`w-14 h-16 sm:w-16 sm:h-20 rounded-xl border-2 border-dashed ${
                  isDragOver ? 'border-amber-600 bg-amber-100' : 'border-amber-400 bg-white/80'
                } flex flex-col items-center justify-center text-amber-700 cursor-pointer hover:bg-amber-100/50 transition-colors shadow-xs`}
                title="फोटो चुनें"
              >
                <UploadCloud className="w-5 h-5 mb-0.5 text-amber-600" />
                <span className="text-[9px] font-black uppercase tracking-tight text-center px-1">
                  फोटो *
                </span>
              </div>
            )}
          </div>

          {/* Text Labels */}
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-gray-900 leading-tight">
                {label}
              </span>
              {required && (
                <span className="bg-red-100 text-red-700 border border-red-200 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md">
                  अनिवार्य (Mandatory)
                </span>
              )}
              {photoUrl && (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  फोटो सत्यापित
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
              {subLabel}
            </p>
          </div>
        </div>

        {/* Right: Dual Actions (Gallery vs Live Camera) */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          {/* Button 1: Gallery / File Upload */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-amber-50 text-amber-950 rounded-xl text-xs font-black border border-amber-300 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span>{photoUrl ? 'गैलरी से बदलें' : '📁 गैलरी से चुनें'}</span>
          </button>

          {/* Button 2: Direct Live Camera Capture */}
          <button
            type="button"
            onClick={() => startLiveCamera('user')}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>📸 कैमरा से खींचें</span>
          </button>

          {/* Remove Button if photo is loaded */}
          {photoUrl && onPhotoRemove && (
            <button
              type="button"
              onClick={onPhotoRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors cursor-pointer"
              title="फोटो हटाएं"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Camera Modal */}
      {isLiveCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl relative flex flex-col items-center">
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-black text-amber-300">
                  लाइव कैमरा से फोटो कैप्चर करें
                </h4>
              </div>
              <button
                type="button"
                onClick={closeLiveCamera}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport */}
            <div className="relative w-full aspect-4/3 sm:aspect-square bg-black rounded-2xl overflow-hidden my-4 border-2 border-amber-400/50 shadow-inner flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Passport Photo Frame Overlay */}
              <div className="absolute inset-4 sm:inset-8 border-2 border-dashed border-amber-300/70 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-bold text-white/70 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  चेहरा इस फ्रेम के अंदर रखें
                </span>
              </div>
            </div>

            {/* Camera Controls Bar */}
            <div className="w-full flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={switchCameraFacing}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                title="कैमरा बदलें (Front/Back)"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">कैमरा बदलें</span>
              </button>

              <button
                type="button"
                onClick={captureLivePhoto}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <Camera className="w-5 h-5 fill-current" />
                <span>📸 फोटो कैप्चर करें</span>
              </button>

              <button
                type="button"
                onClick={closeLiveCamera}
                className="py-3 px-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold transition-colors cursor-pointer border border-slate-700"
              >
                रद्द करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
