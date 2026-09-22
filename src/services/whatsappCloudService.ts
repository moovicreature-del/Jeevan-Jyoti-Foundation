/**
 * Jeevan Jyoti Foundation Ghazipur
 * WhatsApp Cloud API Gateway Service
 * 
 * Provides automated WhatsApp message & OTP dispatch via:
 * 1. Meta / WhatsApp Business Cloud API (graph.facebook.com)
 * 2. Server proxy /api/send-whatsapp-otp for secure API token handling
 * 3. Client-side WhatsApp direct messaging fallback
 */

export interface WhatsAppCloudConfig {
  phoneNumberId?: string;
  accessToken?: string;
  templateName?: string;
  businessAccountId?: string;
}

export interface SendWhatsAppOtpParams {
  phone: string;
  otp: string;
  recipientName?: string;
  purpose?: string;
  certificateId?: string;
}

export interface SendWhatsAppOtpResponse {
  success: boolean;
  message: string;
  messageId?: string;
  channel: 'cloud_api' | 'direct_url' | 'server_proxy';
  whatsappUrl?: string;
}

/**
 * Format clean Indian phone number with 91 prefix for WhatsApp API
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const clean = String(phone).replace(/\D/g, '');
  if (clean.length === 10) return `91${clean}`;
  if (clean.length === 12 && clean.startsWith('91')) return clean;
  if (clean.length === 11 && clean.startsWith('0')) return `91${clean.substring(1)}`;
  return clean.slice(-10) ? `91${clean.slice(-10)}` : clean;
}

/**
 * Generate standard pre-formatted text message for OTP verification
 */
export function createOtpWhatsAppText(params: {
  otp: string;
  recipientName?: string;
  purpose?: string;
  certificateId?: string;
}): string {
  const orgName = 'जीवन ज्योति फाउंडेशन गाजीपुर (JJF Ghazipur)';
  const name = params.recipientName || 'सम्मानित सदस्य/नागरिक';
  let actionTitle = 'सुरक्षा सत्यापन';

  if (params.purpose === 'superadmin_login') {
    actionTitle = '👑 सुपर एडमिन पोर्टल में लॉगिन';
  } else if (params.purpose === 'admin_login') {
    actionTitle = '🛡️ एडमिन पोर्टल में लॉगिन';
  } else if (params.purpose === 'certificate_download') {
    actionTitle = `प्रमाण पत्र [${params.certificateId || 'JJF'}] डाउनलोड`;
  } else if (params.purpose === 'credentials_create') {
    actionTitle = 'एडमिन क्रेडेंशियल्स निर्माण';
  }

  return (
    `*${orgName}*\n\n` +
    `नमस्ते ${name} जी,\n\n` +
    `आपके *${actionTitle}* हेतु अधिकृत वन-टाइम पासवर्ड (OTP) कोड है:\n\n` +
    `🔑 *${params.otp}*\n\n` +
    `⏳ यह कोड 10 मिनट के लिए मान्य है। किसी भी अनधिकृत व्यक्ति के साथ इसे साझा न करें।\n\n` +
    `हेल्पलाइन: +91-8052361666 | NITI Aayog: UP/2018/0207700`
  );
}

/**
 * Dispatch OTP via WhatsApp Cloud API or Server Proxy
 */
export async function sendWhatsAppOtp(params: SendWhatsAppOtpParams): Promise<SendWhatsAppOtpResponse> {
  const cleanPhone = String(params.phone).replace(/\D/g, '').slice(-10);
  const formattedRecipient = formatPhoneForWhatsApp(cleanPhone);
  const messageText = createOtpWhatsAppText(params);
  const fallbackUrl = `https://api.whatsapp.com/send?phone=${formattedRecipient}&text=${encodeURIComponent(messageText)}`;

  if (!cleanPhone || cleanPhone.length !== 10) {
    return {
      success: false,
      message: 'अमान्य मोबाइल नंबर दर्ज किया गया है।',
      channel: 'direct_url',
      whatsappUrl: fallbackUrl
    };
  }

  // 1. Try Server WhatsApp Dispatch endpoint
  try {
    const response = await fetch('/api/send-whatsapp-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: cleanPhone,
        otp: params.otp,
        recipientName: params.recipientName,
        purpose: params.purpose,
        certificateId: params.certificateId
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return {
          success: true,
          message: data.message || 'WhatsApp Cloud API द्वारा OTP सफलतापूर्वक भेजा गया।',
          messageId: data.messageId,
          channel: 'cloud_api',
          whatsappUrl: fallbackUrl
        };
      }
    }
  } catch (err) {
    console.debug('[WhatsAppCloudService] Server API dispatch note:', err);
  }

  // 2. Return direct WhatsApp URL fallback
  return {
    success: true,
    message: 'WhatsApp संदेश तैयार है।',
    channel: 'direct_url',
    whatsappUrl: fallbackUrl
  };
}

export interface SendWhatsAppWelcomeParams {
  phone: string;
  recipientName: string;
  type: 'volunteer' | 'donor';
  referenceId?: string;
  details?: string;
}

export interface WhatsAppWelcomeResponse {
  success: boolean;
  message: string;
  messageId?: string;
  channel: 'cloud_api' | 'direct_url' | 'server_proxy';
  whatsappUrl?: string;
}

/**
 * Generate official welcome message text for WhatsApp opt-in updates
 */
export function createWelcomeWhatsAppText(params: SendWhatsAppWelcomeParams): string {
  const orgName = 'जीवन ज्योति फाउंडेशन गाजीपुर (JJF Ghazipur)';
  const name = params.recipientName || 'सम्मानित नागरिक';

  if (params.type === 'volunteer') {
    return (
      `*${orgName} में आपका हार्दिक स्वागत है!* 🌸🙏\n\n` +
      `नमस्ते *${name}* जी,\n\n` +
      `जीवन ज्योति फाउंडेशन के साथ स्वयंसेवक (Volunteer) के रूप में जुड़ने और WhatsApp अपडेट्स की सहमति देने हेतु धन्यवाद।\n\n` +
      `📌 *स्वयंसेवक आईडी:* ${params.referenceId || 'JJF-VOL'}\n` +
      `📍 *कार्यक्षेत्र:* गाजीपुर, उत्तर प्रदेश\n` +
      `🕊️ *सेवा संकल्प:* निःशुल्क बाल शिक्षा, स्वास्थ्य सुरक्षा व अन्नपूर्णा सेवा\n\n` +
      `आपको आगामी सेवा अभियानों, शिविरों तथा प्रमाण पत्र की स्थिति की सीधी जानकारी WhatsApp पर मिलती रहेगी।\n\n` +
      `हेल्पलाइन: +91-8052361666\n` +
      `वेबसाइट: https://jeevanjyotifoundation.org\n` +
      `नीति आयोग दर्ता: UP/2018/0207700`
    );
  }

  return (
    `*जीवन ज्योति फाउंडेशन गाजीपुर (JJF) - धन्यवाद एवं स्वागत!* 💐🙏\n\n` +
    `नमस्ते *${name}* जी,\n\n` +
    `जीवन ज्योति फाउंडेशन के लोक-कल्याणकारी सेवा प्रकल्पों में आपके पावन दान सहयोग एवं WhatsApp अपडेट्स की सहमति हेतु सहृदय आभार।\n\n` +
    `🧾 *दान रसीद संदर्भ:* ${params.referenceId || 'JJF/DON/2026'}\n` +
    `🌿 *दान विवरण:* ${params.details || 'शिक्षा, स्वास्थ्य व भोजन सेवा'}\n` +
    `🛡️ *आधिकारिक दान पावती:* सरकारी पंजीकृत संस्था\n\n` +
    `एडमिन स्वीकृति के उपरांत आपकी आधिकारिक दान रसीद डाउनलोड का सीधा लिंक आपके WhatsApp पर भेजा जाएगा।\n\n` +
    `संपर्क: +91-8052361666 | गाजीपुर (उ.प्र.)`
  );
}

/**
 * Send WhatsApp Welcome message via Cloud API or server endpoint
 */
export async function sendWhatsAppWelcomeMessage(params: SendWhatsAppWelcomeParams): Promise<WhatsAppWelcomeResponse> {
  const cleanPhone = String(params.phone).replace(/\D/g, '').slice(-10);
  const formattedRecipient = formatPhoneForWhatsApp(cleanPhone);
  const messageText = createWelcomeWhatsAppText(params);
  const fallbackUrl = `https://api.whatsapp.com/send?phone=${formattedRecipient}&text=${encodeURIComponent(messageText)}`;

  if (!cleanPhone || cleanPhone.length !== 10) {
    return {
      success: false,
      message: 'अमान्य मोबाइल नंबर दर्ज किया गया है।',
      channel: 'direct_url',
      whatsappUrl: fallbackUrl
    };
  }

  try {
    const response = await fetch('/api/send-whatsapp-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: cleanPhone,
        recipientName: params.recipientName,
        type: params.type,
        referenceId: params.referenceId,
        details: params.details
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return {
          success: true,
          message: data.message || 'WhatsApp Welcome संदेश सफलतापूर्वक भेजा गया।',
          messageId: data.messageId,
          channel: 'cloud_api',
          whatsappUrl: fallbackUrl
        };
      }
    }
  } catch (err) {
    console.debug('[WhatsAppWelcome] Server API dispatch note:', err);
  }

  return {
    success: true,
    message: 'WhatsApp Welcome संदेश तैयार है।',
    channel: 'direct_url',
    whatsappUrl: fallbackUrl
  };
}

