export interface SectorVisual {
  id: string;
  titleHindi: string;
  titleEnglish: string;
  tagline: string;
  imageUrl: string;
  accentColor: string;
  iconName: string;
}

export const SECTOR_VISUALS: Record<string, SectorVisual> = {
  education: {
    id: 'education',
    titleHindi: 'शिक्षा सेवा - सांध्यकालीन पाठशाला',
    titleEnglish: 'Free Evening Education',
    tagline: 'वंचित बच्चों के लिए निशुल्क डिजिटल और बुनियादी शिक्षा',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    accentColor: '#2563eb',
    iconName: 'GraduationCap'
  },
  health: {
    id: 'health',
    titleHindi: 'स्वास्थ्य रक्षा - ग्रामीण मेडिकल कैंप',
    titleEnglish: 'Healthcare & Medical Relief',
    tagline: 'निशुल्क नेत्र जांच, सामान्य स्वास्थ्य परामर्श एवं दवाएं',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    accentColor: '#dc2626',
    iconName: 'HeartPulse'
  },
  food: {
    id: 'food',
    titleHindi: 'अन्नपूर्णा सेवा - भोजन एवं पोषण वितरण',
    titleEnglish: 'Annapurna Meal Drives',
    tagline: 'झुग्गी बस्तियों व असहाय परिवारों में पौष्टिक गर्म भोजन',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    accentColor: '#d97706',
    iconName: 'Utensils'
  },
  women: {
    id: 'women',
    titleHindi: 'महिला स्वावलंबन एवं कौशल विकास',
    titleEnglish: 'Women Skill & Self Reliance',
    tagline: 'सिलाई प्रशिक्षण, हस्तशिल्प और वित्तीय आत्मनिर्भरता',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    accentColor: '#7c3aed',
    iconName: 'Sparkles'
  }
};

export function getSectorVisual(sector: string): SectorVisual {
  return SECTOR_VISUALS[sector] || SECTOR_VISUALS.education;
}
