// ============================================================================
// JEEVAN JYOTI FOUNDATION - ADMIN & FIRESTORE SERVICE
// जीवन ज्योति फाउंडेशन - एडमिन, यूज़र मैनेजमेंट और होम पेज कंटेंट सर्विस
// ============================================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  DocumentSnapshot,
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import { db, storage, isMockFirebase } from '../lib/firebase';
import { AdminUser, AppHomeContent, NoticeItem, AdminActivityLog, DonationPaymentSettings, SliderPhotoItem } from '../types';

// डिफ़ॉल्ट दान एवं बैंक/UPI भुगतान सेटिंग्स (Default Donation Payment & Bank Settings)
export const DEFAULT_DONATION_PAYMENT_SETTINGS: DonationPaymentSettings = {
  upiId: 'jeevanjyoti.gzp@sbi',
  upiPayeeName: 'JEEVAN JYOTI FOUNDATION',
  qrCodeMode: 'auto_generated',
  customQrImageUrl: '',
  bankAccountName: 'JEEVAN JYOTI FOUNDATION',
  bankAccountNumber: '718720110000323',
  bankIfsc: 'BKID0007187',
  bankName: 'BANK OF INDIA',
  bankBranch: 'Daudpur, Mohammadabad, Ghazipur, Uttar Pradesh, India - 233303 (DIGIPIN 2J6T226CL2)',
  panNumber: 'AAEAJ3141Q',
  urn80G: '',
  urn10A: 'AAEAJ3141QE20231',
  nitiAayogUid: 'UP/2018/0207700',
  contactPhone: '+91-8052361666',
  contactEmail: 'jeevanjyotifoundationgzp@gmail.com',
  donationNoteHindi: 'भुगतान के उपरांत UTR / लेन-देन संदर्भ संख्या दर्ज कर तुरंत आधिकारिक डिजिटल रसीद प्राप्त करें।',
  updatedBy: 'सिस्टम एडमिन',
  updatedAt: new Date().toISOString()
};

function sanitizePaymentSettings(raw: any): DonationPaymentSettings {
  return {
    ...DEFAULT_DONATION_PAYMENT_SETTINGS,
    ...(raw || {})
  };
}

// डिफ़ॉल्ट स्लाइडर फ़ोटो (Default Authentic Ghazipur Seva Action Photos)
export const DEFAULT_SLIDER_PHOTOS: SliderPhotoItem[] = [
  {
    id: 'slide-1',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=85',
    title: 'निःशुल्क सांध्यकालीन शिक्षा सेवा',
    description: 'ग़ाज़ीपुर के ग्रामीण व वंचित बच्चों को समर्पित आधुनिक व संस्कारयुक्त शिक्षा अभियान'
  },
  {
    id: 'slide-2',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=85',
    title: 'अन्नपूर्णा भोजन सेवा एवं पोषण किट वितरण',
    description: 'निराश्रितों, दैनिक मजदूरों एवं जरूरतमंद परिवारों को ताजा पौष्टिक भोजन व सूखा राशन'
  },
  {
    id: 'slide-3',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=85',
    title: 'निःशुल्क ग्रामीण स्वास्थ्य एवं नेत्र शिविर',
    description: 'वरिष्ठ डॉक्टरों द्वारा विशेषज्ञ चिकित्सीय परामर्श, चश्मा व जीवनरक्षक दवा वितरण'
  },
  {
    id: 'slide-4',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=85',
    title: 'पर्यावरण संरक्षण एवं वृहद पौधरोपण महाभियान',
    description: 'हरित ग़ाज़ीपुर संकल्प: 1000+ फलदार व औषधीय पौधों का रोपण व संरक्षण'
  }
];

// डिफ़ॉल्ट होम पेज कंटेंट (Default fallback content)
export const DEFAULT_HOME_CONTENT: AppHomeContent = {
  heroTitle: 'रोशनी बनो किसी के अंधेरे जीवन की',
  heroSubtitle: 'ग़ाज़ीपुर के हर वंचित वर्ग तक शिक्षा, स्वास्थ्य, अन्न और स्वावलंबन पहुँचाने का पवित्र सामाजिक संकल्प।',
  aboutText: 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर (उत्तर प्रदेश, भारत) में पंजीकृत एक अग्रणी सामाजिक व परोपकारी संस्था है। हमारा उद्देश्य समाज के निर्धन, बेसहारा व असहाय बंधुओं तक शिक्षा, पोषण और चिकित्सा सहायता पहुँचाना है।',
  missionText: 'शिक्षा का प्रकाश फैलाना, निःशुल्क स्वास्थ्य शिविर, पौधरोपण, युवा स्वावलंबन, आपदा राहत एवं महिला सशक्तीकरण द्वारा ग़ाज़ीपुर (उत्तर प्रदेश, भारत) को एक सशक्त व जागरूक समाज बनाना।',
  footerText: '© 2026 जीवन ज्योति फाउंडेशन ग़ाज़ीपुर, उत्तर प्रदेश, भारत। नीति आयोग दर्पण पंजीकृत गैर-सरकारी संस्था। सर्वाधिकार सुरक्षित।',
  bannerImageUrl: DEFAULT_SLIDER_PHOTOS[0].url,
  bannerImages: DEFAULT_SLIDER_PHOTOS.map((p) => p.url),
  sliderPhotos: DEFAULT_SLIDER_PHOTOS,
  sliderAutoPlay: true,
  sliderInterval: 4,
  bannerVideoUrl: 'https://www.youtube.com/watch?v=0kF5s7J_C3A',
  bannerTitle: 'सशक्त ग़ाज़ीपुर, समृद्ध समाज',
  bannerSubtitle: 'हमारे सेवा अभियानों से जुड़ें और समाज निर्माण में अपना योगदान दें',
  appLogoUrl: '',
  updatedBy: 'सिस्टम एडमिन',
  updatedAt: new Date().toISOString()
};

// डिफ़ॉल्ट सक्रिय सूचनाएं (Default Active Community Notices)
export const DEFAULT_NOTICES: NoticeItem[] = [
  {
    id: 'default-notice-1',
    title: '📢 निःशुल्क स्वास्थ्य व नेत्र जांच महाशिविर',
    message: 'जीवन ज्योति फाउंडेशन द्वारा आगामी रविवार को गाजीपुर ग्रामीण क्षेत्र में निशुल्क चिकित्सा, ब्लड प्रेशर/शुगर जांच एवं दवा वितरण शिविर आयोजित किया जा रहा है। सभी क्षेत्रवासी सादर आमंत्रित हैं।',
    date: '2026-08-30',
    isActive: true,
    priority: 'urgent',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-notice-2',
    title: '🌿 पौधरोपण एवं पर्यावरण संरक्षण महाभियान 2026',
    message: 'हरियाली युक्त गाजीपुर के संकल्प के साथ 1000+ फलदार व छायादार पौधे रोपित किए जा रहे हैं। पर्यावरण मित्र बनकर अपने गांव/मुहल्ले में पौधरोपण करें।',
    date: '2026-08-28',
    isActive: true,
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-notice-3',
    title: '🎓 मेधावी व जरूरतमंद छात्र-छात्रा निःशुल्क पुस्तक व बैग वितरण',
    message: 'आर्थिक रूप से कमजोर प्राथमिक एवं माध्यमिक विद्यार्थियों को निःशुल्क शैक्षणिक सामग्री, स्कूल बैग व कॉपियों का वितरण प्रारंभ हो चुका है।',
    date: '2026-08-25',
    isActive: true,
    priority: 'normal',
    createdAt: new Date().toISOString()
  }
];

/**
 * इमेज को अनुकूलित व संपीड़ित करें (Compress image to lightweight, high-res data URL)
 */
export async function optimizeImageFile(file: File, maxDim = 800, quality = 0.9): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const outputType = file.type === 'image/png' ? 'image/png' : 'image/webp';
      try {
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      } catch {
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}

function sanitizeContentData(raw: any): AppHomeContent {
  const merged: AppHomeContent = { ...DEFAULT_HOME_CONTENT, ...raw };
  
  // 1. Check custom logo
  if (raw?.appLogoUrl || raw?.logoUrl) {
    merged.appLogoUrl = raw.appLogoUrl || raw.logoUrl;
  } else {
    try {
      const localLogo = localStorage.getItem('jjf_custom_logo');
      if (localLogo) {
        merged.appLogoUrl = localLogo;
      }
    } catch {
      // Ignore
    }
  }

  // 1b. Check custom app thumbnail logo
  if (raw?.appThumbnailUrl || raw?.thumbnailUrl) {
    merged.appThumbnailUrl = raw.appThumbnailUrl || raw.thumbnailUrl;
  } else {
    try {
      const localThumb = localStorage.getItem('jjf_custom_thumbnail');
      if (localThumb) {
        merged.appThumbnailUrl = localThumb;
      }
    } catch {
      // Ignore
    }
  }

  // 2. Process slider photos & multiple banner images
  if (Array.isArray(raw?.sliderPhotos) && raw.sliderPhotos.length > 0) {
    const validSlides: SliderPhotoItem[] = raw.sliderPhotos.filter(
      (item: any) => item && typeof item.url === 'string' && item.url.trim().length > 0
    );
    merged.sliderPhotos = validSlides.length > 0 ? validSlides : DEFAULT_SLIDER_PHOTOS;
    merged.bannerImages = merged.sliderPhotos.map((p) => p.url);
    if (merged.sliderPhotos.length > 0) {
      merged.bannerImageUrl = merged.sliderPhotos[0].url;
    }
  } else if (Array.isArray(raw?.bannerImages) && raw.bannerImages.length > 0) {
    const validImages = raw.bannerImages.filter((img: any) => typeof img === 'string' && img.trim().length > 0);
    merged.bannerImages = validImages;
    merged.sliderPhotos = validImages.map((url: string, index: number) => ({
      id: `slide-${index + 1}`,
      url,
      title: `संस्था सेवा गतिविधि चित्र ${index + 1}`,
      description: 'जीवन ज्योति फाउंडेशन गाजीपुर'
    }));
    if (validImages.length > 0) {
      merged.bannerImageUrl = validImages[0];
    }
  } else if (raw?.bannerImageUrl && typeof raw.bannerImageUrl === 'string' && raw.bannerImageUrl.trim().length > 0) {
    merged.bannerImageUrl = raw.bannerImageUrl;
    merged.bannerImages = [raw.bannerImageUrl];
    merged.sliderPhotos = [{
      id: 'slide-1',
      url: raw.bannerImageUrl,
      title: raw.bannerTitle || 'संस्था सेवा गतिविधि',
      description: raw.bannerSubtitle || 'जीवन ज्योति फाउंडेशन'
    }];
  } else {
    merged.sliderPhotos = DEFAULT_SLIDER_PHOTOS;
    merged.bannerImages = DEFAULT_SLIDER_PHOTOS.map((p) => p.url);
    merged.bannerImageUrl = DEFAULT_SLIDER_PHOTOS[0].url;
  }

  // Slider intervals & autoplay
  merged.sliderAutoPlay = raw?.sliderAutoPlay !== false;
  merged.sliderInterval = typeof raw?.sliderInterval === 'number' && raw.sliderInterval >= 2 && raw.sliderInterval <= 30
    ? raw.sliderInterval
    : 4;

  return merged;
}

/**
 * संस्था का आधिकारिक लोगो अपडेट करें (Update App Logo across all pages and Firestore)
 */
export async function updateAppLogo(
  logoUrl: string,
  adminName: string = 'व्यवस्थापक',
  adminUid: string = 'admin'
): Promise<void> {
  const now = new Date().toISOString();

  // 1. LocalStorage update (Instant synchronous write)
  try {
    localStorage.setItem('jjf_custom_logo', logoUrl);
    const local = localStorage.getItem('jjf_home_content');
    if (local) {
      const parsed = JSON.parse(local);
      parsed.appLogoUrl = logoUrl;
      parsed.updatedAt = now;
      parsed.updatedBy = adminName;
      localStorage.setItem('jjf_home_content', JSON.stringify(parsed));
    } else {
      localStorage.setItem('jjf_home_content', JSON.stringify({
        ...DEFAULT_HOME_CONTENT,
        appLogoUrl: logoUrl,
        updatedAt: now,
        updatedBy: adminName
      }));
    }
  } catch (e) {
    console.warn('LocalStorage save logo warning:', e);
  }

  // 2. Dispatch custom event for real-time instantaneous DOM / component update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jjf-logo-changed', { detail: logoUrl }));
  }

  // 3. Firestore update
  if (!isMockFirebase) {
    try {
      const contentDocRef = doc(db, 'appContent', 'home');
      await setDoc(contentDocRef, { appLogoUrl: logoUrl, updatedAt: now, updatedBy: adminName }, { merge: true });
    } catch (error) {
      console.warn('Firestore logo update notice (saved locally):', error);
    }
  }

  // 4. Activity Audit Log
  try {
    await logAdminActivity({
      adminUid,
      adminName,
      action: 'LOGO_UPDATED',
      details: `संस्था का आधिकारिक लोगो सफलतापूर्वक अपडेट किया गया (${adminName} द्वारा)`
    });
  } catch {
    // Ignore
  }
}

/**
 * संस्था का लोगो मूल डिफ़ॉल्ट वेक्टर प्रतीक में रीसेट करें (Reset Logo to Default SVG Vector)
 */
export async function resetAppLogo(
  adminName: string,
  adminUid: string
): Promise<void> {
  const now = new Date().toISOString();

  // 1. Clear from localStorage
  try {
    localStorage.removeItem('jjf_custom_logo');
    const local = localStorage.getItem('jjf_home_content');
    if (local) {
      const parsed = JSON.parse(local);
      parsed.appLogoUrl = '';
      parsed.updatedAt = now;
      parsed.updatedBy = adminName;
      localStorage.setItem('jjf_home_content', JSON.stringify(parsed));
    }
  } catch (e) {
    console.warn('LocalStorage reset logo warning:', e);
  }

  // 2. Dispatch custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jjf-logo-changed', { detail: '' }));
  }

  // 3. Firestore update
  if (!isMockFirebase) {
    try {
      const contentDocRef = doc(db, 'appContent', 'home');
      await setDoc(contentDocRef, { appLogoUrl: '', updatedAt: now, updatedBy: adminName }, { merge: true });
    } catch (error) {
      console.warn('Firestore logo reset notice:', error);
    }
  }

  // 4. Activity Audit Log
  try {
    await logAdminActivity({
      adminUid,
      adminName,
      action: 'LOGO_RESET',
      details: `संस्था का लोगो मूल डिफ़ॉल्ट वेक्टर प्रतीक में रीसेट किया गया (${adminName} द्वारा)`
    });
  } catch {
    // Ignore
  }
}

/**
 * वेबसाइट एवं ऐप के थंबनेल लोगो को ब्राउज़र के मेटा टैग्स, OpenGraph, Twitter Card व Favicon में लाइव लागू करें
 */
export function applyDynamicAppThumbnail(thumbnailUrl: string = ''): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const resolvedThumb = thumbnailUrl.trim() || '/pwa-icon-512.png';

  try {
    // 1. Update Open Graph image (WhatsApp, Facebook, LinkedIn link share cards)
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', resolvedThumb);

    // 2. Update Twitter Card image
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', resolvedThumb);

    // 3. Update Apple Touch Icon (iOS Home Screen Shortcut)
    const appleIcons = document.querySelectorAll('link[rel="apple-touch-icon"]');
    if (appleIcons.length > 0) {
      appleIcons.forEach((el) => el.setAttribute('href', resolvedThumb));
    } else {
      const appleLink = document.createElement('link');
      appleLink.setAttribute('rel', 'apple-touch-icon');
      appleLink.setAttribute('href', resolvedThumb);
      document.head.appendChild(appleLink);
    }

    // 4. Update Favicon if custom thumbnail supplied
    if (thumbnailUrl.trim()) {
      const favicons = document.querySelectorAll('link[rel="icon"]');
      if (favicons.length > 0) {
        favicons.forEach((el) => el.setAttribute('href', resolvedThumb));
      }
    }

    // 5. Dispatch reactive custom event for all components
    window.dispatchEvent(new CustomEvent('jjf-thumbnail-changed', { detail: resolvedThumb }));
  } catch (e) {
    console.warn('Error applying dynamic app thumbnail:', e);
  }
}

/**
 * वेबसाइट एवं ऐप का थंबनेल लोगो अपडेट करें (Update App Thumbnail Logo across Social Share, OpenGraph, PWA & Firestore)
 */
export async function updateAppThumbnail(
  thumbnailUrl: string,
  adminName: string = 'व्यवस्थापक',
  adminUid: string = 'admin'
): Promise<void> {
  const now = new Date().toISOString();

  // 1. LocalStorage update (Instant synchronous write)
  try {
    localStorage.setItem('jjf_custom_thumbnail', thumbnailUrl);
    const local = localStorage.getItem('jjf_home_content');
    if (local) {
      const parsed = JSON.parse(local);
      parsed.appThumbnailUrl = thumbnailUrl;
      parsed.updatedAt = now;
      parsed.updatedBy = adminName;
      localStorage.setItem('jjf_home_content', JSON.stringify(parsed));
    } else {
      localStorage.setItem('jjf_home_content', JSON.stringify({
        ...DEFAULT_HOME_CONTENT,
        appThumbnailUrl: thumbnailUrl,
        updatedAt: now,
        updatedBy: adminName
      }));
    }
  } catch (e) {
    console.warn('LocalStorage save thumbnail warning:', e);
  }

  // 2. Update dynamic DOM meta tags in real-time
  applyDynamicAppThumbnail(thumbnailUrl);

  // 3. Firestore update
  if (!isMockFirebase) {
    try {
      const contentDocRef = doc(db, 'appContent', 'home');
      await setDoc(contentDocRef, { appThumbnailUrl: thumbnailUrl, updatedAt: now, updatedBy: adminName }, { merge: true });
    } catch (error) {
      console.warn('Firestore thumbnail update notice (saved locally):', error);
    }
  }

  // 4. Activity Audit Log
  try {
    await logAdminActivity({
      adminUid,
      adminName,
      action: 'APP_THUMBNAIL_UPDATED',
      details: `वेबसाइट एवं ऐप का थंबनेल लोगो सफलतापूर्वक अपडेट किया गया (${adminName} द्वारा)`
    });
  } catch {
    // Ignore
  }
}

/**
 * वेबसाइट एवं ऐप थंबनेल लोगो मूल डिफ़ॉल्ट में रीसेट करें
 */
export async function resetAppThumbnail(
  adminName: string = 'व्यवस्थापक',
  adminUid: string = 'admin'
): Promise<void> {
  const now = new Date().toISOString();

  // 1. Clear from localStorage
  try {
    localStorage.removeItem('jjf_custom_thumbnail');
    const local = localStorage.getItem('jjf_home_content');
    if (local) {
      const parsed = JSON.parse(local);
      parsed.appThumbnailUrl = '';
      parsed.updatedAt = now;
      parsed.updatedBy = adminName;
      localStorage.setItem('jjf_home_content', JSON.stringify(parsed));
    }
  } catch (e) {
    console.warn('LocalStorage reset thumbnail warning:', e);
  }

  // 2. Reset DOM meta tags to default PWA icon
  applyDynamicAppThumbnail('/pwa-icon-512.png');

  // 3. Firestore update
  if (!isMockFirebase) {
    try {
      const contentDocRef = doc(db, 'appContent', 'home');
      await setDoc(contentDocRef, { appThumbnailUrl: '', updatedAt: now, updatedBy: adminName }, { merge: true });
    } catch (error) {
      console.warn('Firestore thumbnail reset notice:', error);
    }
  }

  // 4. Activity Audit Log
  try {
    await logAdminActivity({
      adminUid,
      adminName,
      action: 'APP_THUMBNAIL_RESET',
      details: `वेबसाइट एवं ऐप थंबनेल लोगो मूल डिफ़ॉल्ट में रीसेट किया गया (${adminName} द्वारा)`
    });
  } catch {
    // Ignore
  }
}

/**
 * डेटाबेस और लोकल स्टोरेज से ऐप थंबनेल लोगो पूरी तरह हटाएं
 */
export async function deleteThumbnailFromAllDatabases(
  adminName: string = 'व्यवस्थापक',
  adminUid: string = 'admin'
): Promise<{ success: boolean; message: string }> {
  await resetAppThumbnail(adminName, adminUid);
  return {
    success: true,
    message: 'ऐप थंबनेल लोगो डेटाबेस, स्टोरेज व मेटा टैग्स से सफलतापूर्वक हटा दिया गया है!'
  };
}

/**
 * डेटाबेस और लोकल स्टोरेज से केवल वर्तमान लोगो को सुरक्षित रखकर अन्य सभी पुराने लोगो संदर्भ स्थायी रूप से हटाएं
 * (Purge all other stale logos and enforce only the current active official logo everywhere)
 */
export async function purgeAllOtherLogosFromDatabaseAndEnforceSoleLogo(
  currentActiveLogo: string = '',
  adminName: string = 'सिस्टम व्यवस्थापक'
): Promise<{ success: boolean; message: string; cleanedKeysCount: number }> {
  let cleanedCount = 0;
  const now = new Date().toISOString();

  // 1. Enforce current active logo in local storage
  try {
    const validLogo = currentActiveLogo || '';
    if (validLogo) {
      localStorage.setItem('jjf_custom_logo', validLogo);
    } else {
      localStorage.removeItem('jjf_custom_logo');
    }

    const localHome = localStorage.getItem('jjf_home_content');
    if (localHome) {
      try {
        const parsed = JSON.parse(localHome);
        parsed.appLogoUrl = validLogo;
        parsed.updatedAt = now;
        delete parsed.logoUrl;
        delete parsed.logo;
        delete parsed.customLogo;
        delete parsed.logoBase64;
        delete parsed.logoPath;
        if (parsed.bannerImageUrl && (parsed.bannerImageUrl.includes('logo') || parsed.bannerImageUrl.includes('jeevan_jyoti_logo'))) {
          parsed.bannerImageUrl = '';
        }
        localStorage.setItem('jjf_home_content', JSON.stringify(parsed));
      } catch {
        // Ignore
      }
    }

    // Remove all obsolete/stale keys
    const staleKeys = [
      'jjf_logo_url',
      'jjf_branding',
      'jjf_logo_base64',
      'jjf_header_logo',
      'jjf_logo',
      'jjf_logo_svg',
      'jjf_logo_cache',
      'foundation_logo',
      'brand_logo',
      'jjf_temp_logo',
      'jjf_old_logo'
    ];

    staleKeys.forEach((k) => {
      if (localStorage.getItem(k)) {
        localStorage.removeItem(k);
        cleanedCount++;
      }
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(k)) {
        sessionStorage.removeItem(k);
      }
    });
  } catch (e) {
    console.warn('Local storage logo purge note:', e);
  }

  // 2. Dispatch custom event to notify all UI components to use the sole valid logo
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jjf-logo-changed', { detail: currentActiveLogo || '' }));
  }

  // 3. Firestore Database Deep Cleaning
  if (!isMockFirebase) {
    try {
      // Clean appContent/home
      const homeDocRef = doc(db, 'appContent', 'home');
      await setDoc(
        homeDocRef,
        {
          appLogoUrl: currentActiveLogo || '',
          logoUrl: deleteField(),
          logo: deleteField(),
          logoPath: deleteField(),
          customLogo: deleteField(),
          logoBase64: deleteField(),
          updatedAt: now,
          updatedBy: adminName
        },
        { merge: true }
      );

      // Clean other documents in appContent
      const auxiliaryDocs = ['branding', 'settings', 'media', 'general', 'header', 'footer', 'logo', 'banners', 'hero', 'about'];
      await Promise.allSettled(
        auxiliaryDocs.map(async (docId) => {
          const docRef = doc(db, 'appContent', docId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            const updates: Record<string, any> = {};

            if (data.bannerImageUrl && (data.bannerImageUrl.includes('logo') || data.bannerImageUrl.includes('jeevan_jyoti_logo'))) {
              updates.bannerImageUrl = '';
            }
            if (data.logoUrl) updates.logoUrl = deleteField();
            if (data.logo) updates.logo = deleteField();
            if (data.logoPath) updates.logoPath = deleteField();
            if (data.customLogo) updates.customLogo = deleteField();
            if (data.logoBase64) updates.logoBase64 = deleteField();
            if (data.oldLogo) updates.oldLogo = deleteField();

            if (Object.keys(updates).length > 0) {
              updates.updatedAt = now;
              await updateDoc(docRef, updates);
              cleanedCount++;
            }
          }
        })
      );
    } catch (err) {
      console.warn('Firestore deep logo cleanup notice:', err);
    }
  }

  // Log admin action
  try {
    await logAdminActivity({
      adminUid: 'admin',
      adminName,
      action: 'LOGO_PURGE_ENFORCE',
      details: `डेटाबेस से अन्य सभी पुराने लोगो हटाए गए एवं केवल वर्तमान लोगो (${currentActiveLogo || 'डिफ़ॉल्ट वेक्टर'}) सुरक्षित रखा गया।`
    });
  } catch {
    // Ignore
  }

  return {
    success: true,
    message: `डेटाबेस व स्टोरेज से अन्य सभी पुराने लोगो सफलतापूर्वक हटा दिए गए हैं।`,
    cleanedKeysCount: cleanedCount
  };
}

/**
 * डेटाबेस और लोकल स्टोरेज से लोगो संदर्भ स्थायी रूप से पूरी तरह हटाएँ (Delete logo completely from all databases and storage)
 */
export async function deleteLogoFromAllDatabases(adminName: string = 'सिस्टम व्यवस्थापक'): Promise<{ success: boolean; message: string; cleanedKeysCount: number }> {
  let cleanedCount = 0;
  const now = new Date().toISOString();

  // 1. LocalStorage & SessionStorage Wipe
  try {
    const staleKeys = [
      'jjf_custom_logo',
      'jjf_logo_url',
      'jjf_branding',
      'jjf_logo_base64',
      'jjf_header_logo',
      'jjf_logo',
      'jjf_logo_svg',
      'jjf_logo_cache',
      'foundation_logo',
      'brand_logo',
      'jjf_temp_logo',
      'jjf_old_logo'
    ];

    staleKeys.forEach((k) => {
      if (localStorage.getItem(k)) {
        localStorage.removeItem(k);
        cleanedCount++;
      }
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(k)) {
        sessionStorage.removeItem(k);
      }
    });

    const localHome = localStorage.getItem('jjf_home_content');
    if (localHome) {
      try {
        const parsed = JSON.parse(localHome);
        parsed.appLogoUrl = '';
        parsed.updatedAt = now;
        delete parsed.logoUrl;
        delete parsed.logo;
        delete parsed.customLogo;
        delete parsed.logoBase64;
        delete parsed.logoPath;
        if (parsed.bannerImageUrl && (parsed.bannerImageUrl.includes('logo') || parsed.bannerImageUrl.includes('jeevan_jyoti_logo'))) {
          parsed.bannerImageUrl = '';
        }
        localStorage.setItem('jjf_home_content', JSON.stringify(parsed));
      } catch {
        // Ignore
      }
    }
  } catch (e) {
    console.warn('LocalStorage logo wipe note:', e);
  }

  // 2. Dispatch custom event for zero-delay UI update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jjf-logo-changed', { detail: '' }));
  }

  // 3. Firestore Database Complete Cleaning
  if (!isMockFirebase) {
    try {
      // Clean appContent/home
      const homeDocRef = doc(db, 'appContent', 'home');
      await setDoc(
        homeDocRef,
        {
          appLogoUrl: '',
          logoUrl: deleteField(),
          logo: deleteField(),
          logoPath: deleteField(),
          customLogo: deleteField(),
          logoBase64: deleteField(),
          oldLogo: deleteField(),
          updatedAt: now,
          updatedBy: adminName
        },
        { merge: true }
      );

      // Clean other documents in appContent
      const auxiliaryDocs = ['branding', 'settings', 'media', 'general', 'header', 'footer', 'logo', 'banners', 'hero', 'about'];
      await Promise.allSettled(
        auxiliaryDocs.map(async (docId) => {
          const docRef = doc(db, 'appContent', docId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            const updates: Record<string, any> = {};

            if (data.bannerImageUrl && (data.bannerImageUrl.includes('logo') || data.bannerImageUrl.includes('jeevan_jyoti_logo'))) {
              updates.bannerImageUrl = '';
            }
            if (data.appLogoUrl) updates.appLogoUrl = deleteField();
            if (data.logoUrl) updates.logoUrl = deleteField();
            if (data.logo) updates.logo = deleteField();
            if (data.logoPath) updates.logoPath = deleteField();
            if (data.customLogo) updates.customLogo = deleteField();
            if (data.logoBase64) updates.logoBase64 = deleteField();
            if (data.oldLogo) updates.oldLogo = deleteField();

            if (Object.keys(updates).length > 0) {
              updates.updatedAt = now;
              await updateDoc(docRef, updates);
              cleanedCount++;
            }
          }
        })
      );
    } catch (err) {
      console.warn('Firestore deep logo deletion notice:', err);
    }
  }

  // Log admin action
  try {
    await logAdminActivity({
      adminUid: 'admin',
      adminName,
      action: 'LOGO_DELETED_ALL',
      details: `डेटाबेस और सभी स्टोरेज से लोगो स्थायी रूप से हटा दिया गया (${adminName} द्वारा)`
    });
  } catch {
    // Ignore
  }

  return {
    success: true,
    message: 'डेटाबेस, फायरस्टोर और लोकल स्टोरेज से लोगो स्थायी रूप से डिलीट कर दिया गया है।',
    cleanedKeysCount: cleanedCount
  };
}

// ----------------------------------------------------------------------------
// 1. यूज़र प्रोफ़ाइल और ऑथेंटिकेशन ऑपरेशन्स (User Profile Operations)
// ----------------------------------------------------------------------------

/**
 * फ़ायरबेस में यूज़र डेटा प्राप्त करें (Fetch User by UID with ultra-fast local & memory cache)
 */
export async function getAdminUserProfile(uid: string): Promise<AdminUser | null> {
  // 1. Instant check for master Super Admin & Admin keys
  if (uid.includes('8052361666') || uid.includes('superadmin')) {
    const superProfile = {
      uid,
      name: 'श्री शैलेश प्रधान जी',
      mobile: '8052361666',
      email: 'superadmin@jeevanjyotifoundation.org',
      role: 'superadmin' as const,
      approved: true,
      createdAt: '2021-04-15T00:00:00.000Z',
      lastLogin: new Date().toISOString()
    };
    return superProfile;
  }

  if (uid.includes('8948165666') || uid === 'admin-8948165666') {
    const adminProfile = {
      uid,
      name: 'अधिकृत एडमिन (व्यवस्थापक)',
      mobile: '8948165666',
      email: 'admin@jeevanjyotifoundation.org',
      role: 'admin' as const,
      approved: true,
      createdAt: '2021-06-10T00:00:00.000Z',
      lastLogin: new Date().toISOString()
    };
    return adminProfile;
  }

  // 2. Fast check in sessionStorage & localStorage (<1ms)
  try {
    const sessionDemo = sessionStorage.getItem('jjf_demo_admin');
    if (sessionDemo) {
      const parsed = JSON.parse(sessionDemo);
      if (parsed && (parsed.uid === uid || uid.includes(parsed.mobile || ''))) {
        return parsed;
      }
    }

    const localUsers = JSON.parse(localStorage.getItem('jjf_admin_users') || '[]');
    const found = localUsers.find((u: AdminUser) => u.uid === uid || (u.mobile && uid.includes(u.mobile)));
    if (found) return found;
  } catch {
    // Ignore storage parse error
  }

  // 3. Fast race with Firestore with strict 800ms timeout
  if (!isMockFirebase) {
    try {
      const fetchPromise = (async () => {
        const userDocRef = doc(db, 'users', uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          return snap.data() as AdminUser;
        }
        return null;
      })();

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 800));
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      if (result) return result;
    } catch (error) {
      console.warn('Firestore fetch user notice (using fast fallback):', error);
    }
  }

  return null;
}

/**
 * नए एडमिन का रजिस्ट्रेशन रिकॉर्ड बनाएं (Register New Admin)
 * Super Admin (पहला एडमिन) स्वतः approved हो सकता है, बाकी Admins का अप्रूवल पेंडिंग रहेगा
 */
export async function registerAdminUser(data: {
  uid: string;
  name: string;
  mobile: string;
  email: string;
  role: 'superadmin' | 'admin';
  autoApprove?: boolean;
}): Promise<AdminUser> {
  const now = new Date().toISOString();

  // यदि कोई autoApprove flag है (जैसे Official Super Admin 8052361666 या Admin 8948165666) तो approved = true
  const isApproved =
    data.autoApprove ??
    (data.role === 'superadmin' ||
      data.mobile.includes('8052361666') ||
      data.mobile.includes('8948165666') ||
      data.mobile.includes('9876543210'));

  const newUser: AdminUser = {
    uid: data.uid,
    name: data.name,
    mobile: data.mobile,
    email: data.email,
    role: data.role,
    approved: isApproved,
    createdAt: now,
    lastLogin: now,
  };

  // 1. Save to local storage cache immediately (Instant synchronous write)
  try {
    const localUsers: AdminUser[] = JSON.parse(localStorage.getItem('jjf_admin_users') || '[]');
    const existingIndex = localUsers.findIndex((u) => u.uid === data.uid);
    if (existingIndex >= 0) {
      localUsers[existingIndex] = newUser;
    } else {
      localUsers.push(newUser);
    }
    localStorage.setItem('jjf_admin_users', JSON.stringify(localUsers));
  } catch {
    // Ignore
  }

  // 2. Background Firestore write
  if (!isMockFirebase) {
    (async () => {
      try {
        const userDocRef = doc(db, 'users', data.uid);
        await setDoc(userDocRef, newUser, { merge: true });
      } catch (error) {
        console.warn('Firestore setDoc notice (saved locally):', error);
      }
    })();
  }

  // 3. Non-blocking Activity Log
  logAdminActivity({
    adminUid: data.uid,
    adminName: data.name,
    action: 'REGISTRATION',
    details: `नया पंजीकरण: ${data.name} (${data.role.toUpperCase()}) - स्टेटस: ${isApproved ? 'Approved' : 'Pending Approval'}`
  }).catch(() => {});

  return newUser;
}

/**
 * एडमिन लॉगइन टाइम अपडेट करें
 */
export async function updateAdminLastLogin(uid: string): Promise<void> {
  if (isMockFirebase) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    updateDoc(userDocRef, {
      lastLogin: new Date().toISOString()
    }).catch(() => {});
  } catch (error) {
    console.warn('Could not update last login:', error);
  }
}

/**
 * सभी एडमिन्स की सूची प्राप्त करें (Fetch All Admins for Super Admin with instant default seeds)
 */
export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const usersMap = new Map<string, AdminUser>();

  // 0. Add master super admin & admin seeds
  const masterSuperAdmin: AdminUser = {
    uid: 'superadmin-8052361666',
    name: 'श्री शैलेश प्रधान जी',
    mobile: '8052361666',
    email: 'superadmin@jeevanjyotifoundation.org',
    role: 'superadmin',
    approved: true,
    createdAt: '2021-04-15T00:00:00.000Z',
    lastLogin: new Date().toISOString()
  };
  const masterAdmin: AdminUser = {
    uid: 'admin-8948165666',
    name: 'अधिकृत एडमिन (व्यवस्थापक)',
    mobile: '8948165666',
    email: 'admin@jeevanjyotifoundation.org',
    role: 'admin',
    approved: true,
    createdAt: '2021-06-10T00:00:00.000Z',
    lastLogin: new Date().toISOString()
  };
  usersMap.set(masterSuperAdmin.uid, masterSuperAdmin);
  usersMap.set(masterAdmin.uid, masterAdmin);

  // 1. Get from localStorage
  try {
    const localUsers: AdminUser[] = JSON.parse(localStorage.getItem('jjf_admin_users') || '[]');
    localUsers.forEach((u) => usersMap.set(u.uid, u));
  } catch {
    // Ignore
  }

  // 2. Get from Firestore with 900ms race timeout
  if (!isMockFirebase) {
    try {
      const fetchPromise = (async () => {
        const usersCol = collection(db, 'users');
        const snap = await getDocs(usersCol);
        snap.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
          const u = d.data() as AdminUser;
          usersMap.set(u.uid || d.id, u);
        });
      })();

      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 900));
      await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
      console.warn('Notice getting admin users from firestore (using local cache):', error);
    }
  }

  return Array.from(usersMap.values());
}

/**
 * नए एडमिन को Approve या Reject करें (Super Admin Action)
 */
export async function setAdminApprovalStatus(
  targetUid: string,
  approved: boolean,
  superAdminName: string,
  superAdminUid: string
): Promise<void> {
  const userDocRef = doc(db, 'users', targetUid);
  await updateDoc(userDocRef, {
    approved,
    approvedBy: superAdminName,
    approvedAt: new Date().toISOString()
  });

  await logAdminActivity({
    adminUid: superAdminUid,
    adminName: superAdminName,
    action: approved ? 'ADMIN_APPROVED' : 'ADMIN_REJECTED',
    details: `यूज़र (UID: ${targetUid}) का स्टेटस बदलकर ${approved ? 'APPROVED' : 'REJECTED/SUSPENDED'} किया गया।`
  });
}

/**
 * एडमिन का रोल बदलें (Role Change: superadmin <-> admin)
 */
export async function updateAdminRole(
  targetUid: string,
  newRole: 'superadmin' | 'admin',
  superAdminName: string,
  superAdminUid: string
): Promise<void> {
  const userDocRef = doc(db, 'users', targetUid);
  await updateDoc(userDocRef, {
    role: newRole,
    updatedAt: new Date().toISOString()
  });

  await logAdminActivity({
    adminUid: superAdminUid,
    adminName: superAdminName,
    action: 'ROLE_CHANGED',
    details: `यूज़र (UID: ${targetUid}) का रोल बदलकर ${newRole.toUpperCase()} किया गया।`
  });
}

/**
 * एडमिन को डिलीट करें (Super Admin Only)
 */
export async function deleteAdminUser(
  targetUid: string,
  targetName: string,
  superAdminName: string,
  superAdminUid: string
): Promise<void> {
  const userDocRef = doc(db, 'users', targetUid);
  await deleteDoc(userDocRef);

  await logAdminActivity({
    adminUid: superAdminUid,
    adminName: superAdminName,
    action: 'ADMIN_DELETED',
    details: `एडमिन खाता हटाया गया: ${targetName} (UID: ${targetUid})`
  });
}

// ----------------------------------------------------------------------------
// 2. होम पेज कंटेंट मैनेजर (Home Page Content Manager)
// ----------------------------------------------------------------------------

/**
 * होम पेज कंटेंट लोड करें (Get Home Content)
 */
export async function getHomeContent(): Promise<AppHomeContent> {
  // 1. Check localStorage first
  try {
    const localContent = localStorage.getItem('jjf_home_content');
    if (localContent) {
      return sanitizeContentData(JSON.parse(localContent));
    }
  } catch {
    // Ignore
  }

  // 2. Try Firestore
  if (!isMockFirebase && db) {
    try {
      const contentDocRef = doc(db, 'appContent', 'home');
      const snap = await getDoc(contentDocRef);
      if (snap.exists()) {
        const data = sanitizeContentData(snap.data() as AppHomeContent);
        try {
          localStorage.setItem('jjf_home_content', JSON.stringify(data));
        } catch {
          // Ignore
        }
        return data;
      }
      return DEFAULT_HOME_CONTENT;
    } catch (error) {
      console.warn('Notice fetching home content from firestore (using local default):', error);
      return DEFAULT_HOME_CONTENT;
    }
  }

  return DEFAULT_HOME_CONTENT;
}

/**
 * रियल-टाइम होम पेज कंटेंट लिसनर (Realtime Subscription)
 */
export function subscribeToHomeContent(callback: (content: AppHomeContent) => void): () => void {
  // Call immediately with local storage or default content
  try {
    const local = localStorage.getItem('jjf_home_content');
    if (local) {
      callback(sanitizeContentData(JSON.parse(local)));
    } else {
      callback(DEFAULT_HOME_CONTENT);
    }
  } catch {
    callback(DEFAULT_HOME_CONTENT);
  }

  if (isMockFirebase) {
    return () => {};
  }

  try {
    const contentDocRef = doc(db, 'appContent', 'home');
    return onSnapshot(
      contentDocRef,
      (snap: DocumentSnapshot<DocumentData>) => {
        if (snap.exists()) {
          const liveData = sanitizeContentData(snap.data() as AppHomeContent);
          try {
            localStorage.setItem('jjf_home_content', JSON.stringify(liveData));
          } catch {
            // Ignore
          }
          callback(liveData);
        }
      },
      (err: Error) => {
        // Fallback gracefully to locally cached content if backend is offline/unreachable
        try {
          const local = localStorage.getItem('jjf_home_content');
          if (local) {
            callback(sanitizeContentData(JSON.parse(local)));
          }
        } catch {
          // Ignore
        }
      }
    );
  } catch (err) {
    console.warn('Home content subscription init error:', err);
    return () => {};
  }
}

/**
 * होम पेज कंटेंट सेव करें (Save Home Content to Firestore & Local Storage)
 */
export async function saveHomeContent(
  content: Partial<AppHomeContent>,
  adminName: string = 'व्यवस्थापक',
  adminUid: string = 'admin'
): Promise<void> {
  const now = new Date().toISOString();

  let preservedLogo = content.appLogoUrl;
  if (preservedLogo === undefined) {
    try {
      preservedLogo = localStorage.getItem('jjf_custom_logo') || DEFAULT_HOME_CONTENT.appLogoUrl;
    } catch {
      preservedLogo = DEFAULT_HOME_CONTENT.appLogoUrl;
    }
  }

  let preservedThumbnail = content.appThumbnailUrl;
  if (preservedThumbnail === undefined) {
    try {
      preservedThumbnail = localStorage.getItem('jjf_custom_thumbnail') || '';
    } catch {
      preservedThumbnail = '';
    }
  }

  const payload: AppHomeContent = sanitizeContentData({
    heroTitle: content.heroTitle || DEFAULT_HOME_CONTENT.heroTitle,
    heroSubtitle: content.heroSubtitle || DEFAULT_HOME_CONTENT.heroSubtitle,
    aboutText: content.aboutText || DEFAULT_HOME_CONTENT.aboutText,
    missionText: content.missionText || DEFAULT_HOME_CONTENT.missionText,
    footerText: content.footerText || DEFAULT_HOME_CONTENT.footerText,
    bannerImageUrl: content.bannerImageUrl || '',
    bannerImages: content.bannerImages,
    sliderPhotos: content.sliderPhotos,
    sliderAutoPlay: content.sliderAutoPlay,
    sliderInterval: content.sliderInterval,
    bannerVideoUrl: content.bannerVideoUrl || DEFAULT_HOME_CONTENT.bannerVideoUrl,
    bannerTitle: content.bannerTitle || DEFAULT_HOME_CONTENT.bannerTitle,
    bannerSubtitle: content.bannerSubtitle || DEFAULT_HOME_CONTENT.bannerSubtitle,
    appLogoUrl: preservedLogo,
    appThumbnailUrl: preservedThumbnail,
    updatedBy: adminName,
    updatedAt: now
  });

  // Local storage save
  try {
    localStorage.setItem('jjf_home_content', JSON.stringify(payload));
  } catch {
    // Ignore
  }

  // Firestore save
  if (!isMockFirebase && db) {
    try {
      const contentDocRef = doc(db, 'appContent', 'home');
      await setDoc(contentDocRef, payload, { merge: true });
    } catch (error) {
      console.warn('Notice saving home content to Firestore (saved locally):', error);
    }
  }

  try {
    await logAdminActivity({
      adminUid,
      adminName,
      action: 'CONTENT_UPDATED',
      details: `होम पेज सामग्री अपडेट की गई (${adminName} द्वारा)`
    });
  } catch {
    // Ignore
  }
}

// ----------------------------------------------------------------------------
// 3. नोटिस बोर्ड ऑपरेशन्स (Notice Board Operations)
// ----------------------------------------------------------------------------

/**
 * नोटिस बोर्ड रियल-टाइम सब्सक्रिप्शन (Subscribe to Notices)
 */
export function subscribeToNotices(callback: (notices: NoticeItem[]) => void): () => void {
  // 1. Send cached local notices immediately
  try {
    const local = localStorage.getItem('jjf_notices');
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        callback(parsed);
      } else {
        callback(DEFAULT_NOTICES);
      }
    } else {
      callback(DEFAULT_NOTICES);
    }
  } catch {
    callback(DEFAULT_NOTICES);
  }

  if (isMockFirebase || !db) {
    return () => {};
  }

  // 2. Listen to Firestore
  try {
    const noticesCol = collection(db, 'notices');
    const q = query(noticesCol, orderBy('createdAt', 'desc'), limit(20));

    return onSnapshot(
      q,
      (snap: QuerySnapshot<DocumentData>) => {
        const items: NoticeItem[] = [];
        snap.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
          items.push({ id: d.id, ...(d.data() as Omit<NoticeItem, 'id'>) });
        });
        const result = items.length > 0 ? items : DEFAULT_NOTICES;
        try {
          localStorage.setItem('jjf_notices', JSON.stringify(result));
        } catch {
          // Ignore
        }
        callback(result);
      },
      (err: Error) => {
        console.warn('Notices subscription fallback:', err);
        try {
          const local = localStorage.getItem('jjf_notices');
          if (local) {
            callback(JSON.parse(local));
          } else {
            callback(DEFAULT_NOTICES);
          }
        } catch {
          callback(DEFAULT_NOTICES);
        }
      }
    );
  } catch (error) {
    console.warn('Notice subscription init notice:', error);
    return () => {};
  }
}

/**
 * नया नोटिस जोड़ें (Create Notice)
 */
export async function createNotice(
  data: {
    title: string;
    message: string;
    date: string;
    isActive: boolean;
    priority?: 'normal' | 'urgent' | 'high';
  },
  adminName: string,
  adminUid: string
): Promise<string> {
  const generatedId = `notice-${Date.now()}`;
  const now = new Date().toISOString();

  const noticeData: NoticeItem = {
    id: generatedId,
    title: data.title,
    message: data.message,
    date: data.date || new Date().toLocaleDateString('hi-IN'),
    isActive: data.isActive,
    priority: data.priority || 'normal',
    updatedBy: adminName,
    createdAt: now
  };

  // Save to local cache
  try {
    const localNotices: NoticeItem[] = JSON.parse(localStorage.getItem('jjf_notices') || '[]');
    localNotices.unshift(noticeData);
    localStorage.setItem('jjf_notices', JSON.stringify(localNotices));
  } catch {
    // Ignore
  }

  // Save to Firestore
  if (!isMockFirebase && db) {
    try {
      const noticeDocRef = doc(db, 'notices', generatedId);
      await setDoc(noticeDocRef, noticeData);
    } catch (error) {
      console.warn('Notice saving to Firestore notice (saved locally):', error);
    }
  }

  try {
    await logAdminActivity({
      adminUid,
      adminName,
      action: 'NOTICE_CREATED',
      details: `नया नोटिस प्रकाशित किया: "${data.title}"`
    });
  } catch {
    // Ignore
  }

  return generatedId;
}

/**
 * नोटिस अपडेट करें (Update Notice)
 */
export async function updateNotice(
  noticeId: string,
  data: Partial<NoticeItem>,
  adminName: string,
  adminUid: string
): Promise<void> {
  // Update local cache
  try {
    const localNotices: NoticeItem[] = JSON.parse(localStorage.getItem('jjf_notices') || '[]');
    const index = localNotices.findIndex((n) => n.id === noticeId);
    if (index >= 0) {
      localNotices[index] = {
        ...localNotices[index],
        ...data,
        updatedBy: adminName,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('jjf_notices', JSON.stringify(localNotices));
    }
  } catch {
    // Ignore
  }

  // Update in Firestore
  if (!isMockFirebase && db) {
    try {
      const noticeDocRef = doc(db, 'notices', noticeId);
      await updateDoc(noticeDocRef, {
        ...data,
        updatedBy: adminName,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Notice update in Firestore notice (updated locally):', error);
    }
  }

  try {
    await logAdminActivity({
      adminUid,
      adminName,
      action: 'NOTICE_UPDATED',
      details: `नोटिस अपडेट किया गया (ID: ${noticeId})`
    });
  } catch {
    // Ignore
  }
}

/**
 * नोटिस डिलीट करें (Delete Notice)
 */
export async function deleteNotice(
  noticeId: string,
  noticeTitle: string,
  adminName: string,
  adminUid: string
): Promise<void> {
  // Delete from local cache
  try {
    const localNotices: NoticeItem[] = JSON.parse(localStorage.getItem('jjf_notices') || '[]');
    const filtered = localNotices.filter((n) => n.id !== noticeId);
    localStorage.setItem('jjf_notices', JSON.stringify(filtered));
  } catch {
    // Ignore
  }

  // Delete from Firestore
  if (!isMockFirebase && db) {
    try {
      const noticeDocRef = doc(db, 'notices', noticeId);
      await deleteDoc(noticeDocRef);
    } catch (error) {
      console.warn('Notice deletion in Firestore notice (deleted locally):', error);
    }
  }

  try {
    await logAdminActivity({
      adminUid,
      adminName,
      action: 'NOTICE_DELETED',
      details: `नोटिस हटाया गया: "${noticeTitle}"`
    });
  } catch {
    // Ignore
  }
}

// ----------------------------------------------------------------------------
// 4. मीडिया अपलोड ऑपरेशन्स (Firebase Storage / Base64 Data URL)
// ----------------------------------------------------------------------------

/**
 * फ़ोटो या वीडियो फ़ाइल अपलोड करें (Upload Media to Firebase Storage with Real-Time Progress Tracking)
 */
export async function uploadMediaFile(
  file: File,
  folder: 'banners' | 'videos' | 'home-slider' | string = 'banners',
  onProgress?: (progress: number, message?: string, bytesDetail?: string) => void
): Promise<string> {
  const uploadStart = performance.now();
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const sizeKb = (file.size / 1024).toFixed(1);
  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
  const sizeLabel = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;

  console.info(`%c[AdminMediaUpload] 📤 Starting file upload: ${file.name} (${sizeLabel}) -> /${folder}`, 'color: #3b82f6; font-weight: bold;');
  if (onProgress) onProgress(10, 'फ़ाइल सत्यापन एवं स्टोरेज कनेक्ट हो रहा है...', `0 KB / ${sizeLabel}`);

  if (!isMockFirebase) {
    try {
      const storageRef = ref(storage, `${folder}/${timestamp}_${cleanFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const rawProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const progress = Math.min(99, Math.max(10, Math.round(rawProgress)));
            const transferredKb = (snapshot.bytesTransferred / 1024).toFixed(1);
            const totalKb = (snapshot.totalBytes / 1024).toFixed(1);
            const bytesDetail = `${transferredKb} KB / ${totalKb} KB`;
            
            console.debug(`[AdminMediaUpload:Progress] ${progress}% (${bytesDetail})`);
            if (onProgress) {
              onProgress(progress, `फ़ायरबेस स्टोरेज पर अपलोड हो रहा है... ${progress}%`, bytesDetail);
            }
          },
          (storageError) => {
            console.warn('[AdminMediaUpload] ⚠️ Live Storage upload warning, falling back to local data URI:', storageError);
            // Fallback to Base64 data URL
            const reader = new FileReader();
            reader.onload = () => {
              if (onProgress) onProgress(100, 'स्थानीय डेटा में सुरक्षित किया गया', sizeLabel);
              resolve(reader.result as string);
            };
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const duration = Math.round(performance.now() - uploadStart);
            console.info(`%c[AdminMediaUpload]  Upload complete in ${duration}ms: ${downloadUrl}`, 'color: #10b981; font-weight: bold;');
            if (onProgress) onProgress(100, 'अपलोड पूर्ण व URL तैयार!', sizeLabel);
            resolve(downloadUrl);
          }
        );
      });
    } catch (e) {
      console.warn('[AdminMediaUpload] Direct upload catch, using FileReader fallback:', e);
    }
  }

  // Fallback if mock / client storage
  return new Promise((resolve, reject) => {
    let pct = 20;
    const interval = setInterval(() => {
      pct += 25;
      if (pct >= 90) {
        clearInterval(interval);
        pct = 90;
      }
      if (onProgress) onProgress(pct, `स्थानीय स्टोरेज प्रक्रिया... ${pct}%`, sizeLabel);
    }, 120);

    const reader = new FileReader();
    reader.onload = () => {
      clearInterval(interval);
      if (onProgress) onProgress(100, 'अपलोड पूर्ण!', sizeLabel);
      resolve(reader.result as string);
    };
    reader.onerror = (err) => {
      clearInterval(interval);
      reject(err);
    };
    reader.readAsDataURL(file);
  });
}

// ----------------------------------------------------------------------------
// 5. एक्टिविटी लॉग ऑपरेशन्स (Admin Activity Audit Logs)
// ----------------------------------------------------------------------------

/**
 * एडमिन गतिविधि लॉग करें (Log Action)
 */
export async function logAdminActivity(log: {
  adminUid: string;
  adminName: string;
  action: string;
  details: string;
}): Promise<void> {
  const generatedId = `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const activityLog: AdminActivityLog = {
    id: generatedId,
    adminUid: log.adminUid,
    adminName: log.adminName,
    action: log.action,
    details: log.details,
    timestamp: new Date().toISOString()
  };

  // 1. Instant local storage cache
  try {
    const cachedLogs: AdminActivityLog[] = JSON.parse(localStorage.getItem('jjf_admin_logs') || '[]');
    cachedLogs.unshift(activityLog);
    if (cachedLogs.length > 100) cachedLogs.length = 100;
    localStorage.setItem('jjf_admin_logs', JSON.stringify(cachedLogs));
  } catch {
    // Ignore
  }

  // 2. Async background Firestore write
  if (!isMockFirebase) {
    (async () => {
      try {
        const logsCol = collection(db, 'adminLogs');
        const logDocRef = doc(logsCol, generatedId);
        await setDoc(logDocRef, activityLog);
      } catch (err) {
        console.warn('Activity logging error:', err);
      }
    })();
  }
}

/**
 * सभी एक्टिविटी लॉग्स प्राप्त करें (Super Admin Only with instant local cache)
 */
export async function getAdminActivityLogs(maxLimit = 50): Promise<AdminActivityLog[]> {
  const localList: AdminActivityLog[] = [];
  try {
    const stored = localStorage.getItem('jjf_admin_logs');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        localList.push(...parsed);
      }
    }
  } catch {
    // Ignore
  }

  // Seed default audit activities if empty
  if (localList.length === 0) {
    localList.push(
      {
        id: 'log-seed-1',
        adminUid: 'superadmin-8052361666',
        adminName: 'श्री शैलेश प्रधान जी',
        action: 'SUPER_ADMIN_LOGIN',
        details: 'सुपर एडमिन कंसोल (8052361666) में सुरक्षित प्रवेश किया।',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'log-seed-2',
        adminUid: 'admin-8948165666',
        adminName: 'अधिकृत एडमिन (व्यवस्थापक)',
        action: 'ADMIN_LOGIN',
        details: 'एडमिन कंसोल (8948165666) में सुरक्षित प्रवेश किया।',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    );
  }

  if (isMockFirebase) {
    return localList.slice(0, maxLimit);
  }

  try {
    const fetchPromise = (async () => {
      const logsCol = collection(db, 'adminLogs');
      const q = query(logsCol, orderBy('timestamp', 'desc'), limit(maxLimit));
      const snap = await getDocs(q);
      const remoteLogs: AdminActivityLog[] = [];
      snap.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
        remoteLogs.push({ id: d.id, ...(d.data() as Omit<AdminActivityLog, 'id'>) });
      });
      if (remoteLogs.length > 0) return remoteLogs;
      return localList;
    })();

    const timeoutPromise = new Promise<AdminActivityLog[]>((resolve) => setTimeout(() => resolve(localList), 800));
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    console.error('Error fetching admin logs (using local fallback):', error);
    return localList.slice(0, maxLimit);
  }
}

// ----------------------------------------------------------------------------
// 6. दान, बैंक खाता, UPI व QR कोड सेटिंग्स मैनेजर (Donation Payment Settings)
// ----------------------------------------------------------------------------

/**
 * वर्तमान सक्रिय दान भुगतान सेटिंग्स लोड करें (Get Donation Payment Settings)
 */
export async function getDonationPaymentSettings(): Promise<DonationPaymentSettings> {
  // 1. Check localStorage first (<1ms)
  try {
    const localSettings = localStorage.getItem('jjf_donation_payment_settings');
    if (localSettings) {
      return sanitizePaymentSettings(JSON.parse(localSettings));
    }
  } catch {
    // Ignore
  }

  // 2. Try Firestore
  if (!isMockFirebase) {
    try {
      const docRef = doc(db, 'appContent', 'donationSettings');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const liveData = sanitizePaymentSettings(snap.data());
        try {
          localStorage.setItem('jjf_donation_payment_settings', JSON.stringify(liveData));
        } catch {
          // Ignore
        }
        return liveData;
      }
    } catch (error) {
      console.warn('Notice fetching donation settings from firestore (using local default):', error);
    }
  }

  return DEFAULT_DONATION_PAYMENT_SETTINGS;
}

/**
 * रीयल-टाइम दान भुगतान सेटिंग्स लिसनर (Realtime Subscription for Payment Settings)
 */
export function subscribeToDonationPaymentSettings(
  callback: (settings: DonationPaymentSettings) => void
): () => void {
  // Call immediately with local storage or default content
  try {
    const local = localStorage.getItem('jjf_donation_payment_settings');
    if (local) {
      callback(sanitizePaymentSettings(JSON.parse(local)));
    } else {
      callback(DEFAULT_DONATION_PAYMENT_SETTINGS);
    }
  } catch {
    callback(DEFAULT_DONATION_PAYMENT_SETTINGS);
  }

  // Listen to local custom event for zero-latency multi-component updates
  const handleLocalEvent = (e: Event) => {
    try {
      const customEvent = e as CustomEvent<DonationPaymentSettings>;
      if (customEvent.detail) {
        callback(sanitizePaymentSettings(customEvent.detail));
      }
    } catch {
      // Ignore
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('jjf-payment-settings-changed', handleLocalEvent);
  }

  if (isMockFirebase) {
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('jjf-payment-settings-changed', handleLocalEvent);
      }
    };
  }

  try {
    const docRef = doc(db, 'appContent', 'donationSettings');
    const unsub = onSnapshot(
      docRef,
      (snap: DocumentSnapshot<DocumentData>) => {
        if (snap.exists()) {
          const liveData = sanitizePaymentSettings(snap.data());
          try {
            localStorage.setItem('jjf_donation_payment_settings', JSON.stringify(liveData));
          } catch {
            // Ignore
          }
          callback(liveData);
        }
      },
      (err: Error) => {
        // Fallback gracefully to locally stored payment settings if offline/unreachable
        try {
          const local = localStorage.getItem('jjf_donation_payment_settings');
          if (local) {
            callback(sanitizePaymentSettings(JSON.parse(local)));
          }
        } catch {
          // Ignore
        }
      }
    );

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('jjf-payment-settings-changed', handleLocalEvent);
      }
      if (typeof unsub === 'function') unsub();
    };
  } catch (err) {
    console.warn('Donation settings subscription init error:', err);
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('jjf-payment-settings-changed', handleLocalEvent);
      }
    };
  }
}

/**
 * दान बैंक, UPI एवं QR सेटिंग्स सेव करें (Save Donation Payment Settings)
 */
export async function saveDonationPaymentSettings(
  newSettings: Partial<DonationPaymentSettings>,
  adminName: string,
  adminUid: string
): Promise<{ success: boolean; data: DonationPaymentSettings }> {
  const current = await getDonationPaymentSettings();
  const merged: DonationPaymentSettings = {
    ...current,
    ...newSettings,
    updatedBy: adminName,
    updatedAt: new Date().toISOString()
  };

  // 1. Instant LocalStorage Write
  try {
    localStorage.setItem('jjf_donation_payment_settings', JSON.stringify(merged));
  } catch (e) {
    console.warn('LocalStorage save payment settings warning:', e);
  }

  // 2. Dispatch custom event for real-time instantaneous DOM / component update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('jjf-payment-settings-changed', { detail: merged })
    );
  }

  // 3. Firestore update
  if (!isMockFirebase) {
    try {
      const docRef = doc(db, 'appContent', 'donationSettings');
      await setDoc(docRef, merged, { merge: true });
    } catch (error) {
      console.warn('Firestore payment settings update notice (saved locally):', error);
    }
  }

  // 4. Activity Audit Log
  try {
    await logAdminActivity({
      adminUid,
      adminName,
      action: 'PAYMENT_SETTINGS_UPDATED',
      details: `दान भुगतान व बैंक विवरण अपडेट किए गए: UPI ID (${merged.upiId}), खाता संख्या (${merged.bankAccountNumber}), बैंक (${merged.bankName})`
    });
  } catch {
    // Ignore
  }

  return { success: true, data: merged };
}

/**
 * दान भुगतान विवरण को मूल डिफ़ॉल्ट पर रीसेट करें (Reset Payment Settings to Default)
 */
export async function resetDonationPaymentSettings(
  adminName: string,
  adminUid: string
): Promise<{ success: boolean; data: DonationPaymentSettings }> {
  const resetData: DonationPaymentSettings = {
    ...DEFAULT_DONATION_PAYMENT_SETTINGS,
    updatedBy: adminName,
    updatedAt: new Date().toISOString()
  };

  // 1. LocalStorage update
  try {
    localStorage.setItem('jjf_donation_payment_settings', JSON.stringify(resetData));
  } catch (e) {
    console.warn('LocalStorage reset payment settings warning:', e);
  }

  // 2. Dispatch event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('jjf-payment-settings-changed', { detail: resetData })
    );
  }

  // 3. Firestore reset
  if (!isMockFirebase) {
    try {
      const docRef = doc(db, 'appContent', 'donationSettings');
      await setDoc(docRef, resetData);
    } catch (error) {
      console.warn('Firestore payment settings reset notice:', error);
    }
  }

  // 4. Audit Log
  try {
    await logAdminActivity({
      adminUid,
      adminName,
      action: 'PAYMENT_SETTINGS_RESET',
      details: `दान भुगतान व बैंक विवरण मूल डिफ़ॉल्ट पर रीसेट किए गए (${adminName} द्वारा)`
    });
  } catch {
    // Ignore
  }

  return { success: true, data: resetData };
}

/**
 * कस्टम QR कोड फोटो अपलोड करें (Upload Custom Payment QR Image)
 */
export async function uploadCustomPaymentQrImage(
  file: File,
  adminUid: string,
  progressCallback?: (progress: number) => void
): Promise<string> {
  // Compress / convert to base64 for instant preview and fallback storage
  const base64Promise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

  const base64Data = await base64Promise;

  if (isMockFirebase || !storage) {
    if (progressCallback) {
      progressCallback(100);
    }
    return base64Data;
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const storagePath = `donation_qrs/qr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        uploadedBy: adminUid,
        purpose: 'custom_donation_qr'
      }
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progressCallback) progressCallback(Math.round(progress));
        },
        (error) => {
          console.warn('Storage upload error for QR, falling back to base64:', error);
          resolve(base64Data);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch {
            resolve(base64Data);
          }
        }
      );
    });
  } catch (err) {
    console.warn('Storage QR upload init failed, using base64:', err);
    return base64Data;
  }
}
