import { TaskRecord, Volunteer, EventStory } from '../types';

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'VOL-01',
    name: 'Aakash Verma',
    fatherName: 'Shri Ramakant Verma',
    role: 'Lead Education & Evening School Coordinator',
    area: 'Mohammadabad',
    areaHindi: 'मोहम्मदाबाद',
    hoursContributed: 148,
    tasksCompleted: 34,
    joinDate: '2022-04-10',
    status: 'leader',
    badge: '🌟 Seva Shiromani',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '+91-9876543211'
  },
  {
    id: 'VOL-02',
    name: 'Pooja Pandey',
    fatherName: 'Shri Dinesh Pandey',
    role: 'Senior Teacher Volunteer',
    area: 'Ghazipur Sadar',
    areaHindi: 'ग़ाज़ीपुर सदर',
    hoursContributed: 132,
    tasksCompleted: 29,
    joinDate: '2023-01-15',
    status: 'certified',
    badge: '🎖️ Shiksha Ratan',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+91-9876543212'
  },
  {
    id: 'VOL-03',
    name: 'Rahul Yadav',
    fatherName: 'Shri Surendra Yadav',
    role: 'Health Camp & Emergency Relief Volunteer',
    area: 'Zamania',
    areaHindi: 'जमानिया',
    hoursContributed: 118,
    tasksCompleted: 26,
    joinDate: '2023-06-20',
    status: 'certified',
    badge: '🏅 Swasthya Senani',
    photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    phone: '+91-9876543213'
  },
  {
    id: 'VOL-04',
    name: 'Neha Rai',
    fatherName: 'Shri Brijesh Rai',
    role: 'Annapurna Nutrition & Food Drive Coordinator',
    area: 'Saidpur',
    areaHindi: 'सैदपुर',
    hoursContributed: 96,
    tasksCompleted: 22,
    joinDate: '2024-02-12',
    status: 'active',
    badge: '🎗️ Annapurna Mitra',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+91-9876543214'
  },
  {
    id: 'VOL-05',
    name: 'Vikas Kumar',
    fatherName: 'Shri Lallan Prasad',
    role: 'Field Logistics & Youth Mobilizer',
    area: 'Miranpur',
    areaHindi: 'मीरानपुर',
    hoursContributed: 84,
    tasksCompleted: 19,
    joinDate: '2024-08-01',
    status: 'active',
    badge: '🌿 Yuva Prerna',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91-9876543215'
  }
];

export const INITIAL_TASKS: TaskRecord[] = [
  {
    id: 'JJF-TSK-2026-01',
    title: 'Evening School Teaching - Mohammadabad Center',
    titleHindi: 'सांध्यकालीन पाठशाला अध्यापन - मोहम्मदाबाद केंद्र',
    category: 'education',
    location: 'Mohammadabad, Ghazipur',
    locationHindi: 'मोहम्मदाबाद, ग़ाज़ीपुर',
    date: '2026-03-28',
    points: 150,
    hours: 4,
    status: 'open',
    description: 'Teach basic Mathematics and Hindi reading to 45 primary grade children from underprivileged households.',
    volunteersRequired: 4,
    volunteersAssigned: 2
  },
  {
    id: 'JJF-TSK-2026-02',
    title: 'Free Health & Eye Checkup Camp Coordinator',
    titleHindi: 'निशुल्क स्वास्थ्य व नेत्र जांच शिविर समन्वयक',
    category: 'health',
    location: 'Miranpur Gram, Ghazipur',
    locationHindi: 'मीरानपुर ग्राम, ग़ाज़ीपुर',
    date: '2026-03-30',
    points: 200,
    hours: 6,
    status: 'in_progress',
    description: 'Coordinate doctor registration desks, token distribution, and assist elderly patients during free eye screening.',
    volunteersRequired: 6,
    volunteersAssigned: 5
  },
  {
    id: 'JJF-TSK-2026-03',
    title: 'Annapurna Food Distribution Drive - Slum Cluster',
    titleHindi: 'अन्नपूर्णा भोजन वितरण अभियान - झुग्गी बस्ती',
    category: 'food',
    location: 'Ghazipur Ghat Slum Area',
    locationHindi: 'ग़ाज़ीपुर घाट मलिन बस्ती',
    date: '2026-04-02',
    points: 180,
    hours: 5,
    status: 'open',
    description: 'Distribute hot freshly cooked nutritious meals and clean drinking water to over 300 daily wage worker families.',
    volunteersRequired: 8,
    volunteersAssigned: 4
  },
  {
    id: 'JJF-TSK-2026-04',
    title: 'Stationery & School Kit Packaging',
    titleHindi: 'शैक्षणिक सामग्री व स्कूल बैग पैकेजिंग',
    category: 'education',
    location: 'JJF Central Hub, Miranpur',
    locationHindi: 'जेजेएफ केंद्रीय कार्यालय, मीरानपुर',
    date: '2026-04-05',
    points: 120,
    hours: 3,
    status: 'open',
    description: 'Sort, package, and label school kits containing notebooks, geometry boxes, and water bottles for 200 children.',
    volunteersRequired: 5,
    volunteersAssigned: 1
  },
  {
    id: 'JJF-TSK-2026-05',
    title: 'Women Skill & Self-Reliance Workshop Facilitator',
    titleHindi: 'महिला स्वावलंबन कार्यशाला समन्वयक',
    category: 'women',
    location: 'Saidpur Block Community Center',
    locationHindi: 'सैदपुर ब्लॉक सामुदायिक भवन',
    date: '2026-04-08',
    points: 220,
    hours: 6,
    status: 'open',
    description: 'Guide rural women participants on stitching patterns, handicraft creation, and financial literacy basics.',
    volunteersRequired: 4,
    volunteersAssigned: 2
  }
];

export const TASK_RECORDS = INITIAL_TASKS;

export const IMPACT_STORIES: EventStory[] = [
  {
    id: 'story-01',
    title: 'From Brick Kiln to District Topper: Radhika’s Journey',
    titleHindi: 'ईंट भट्ठे की मजदूरी से निकलकर कक्षा 8 में प्रथम आने वाली राधिका की कहानी',
    date: '2026-01-20',
    description: 'सांध्यकालीन पाठशाला से जुड़कर राधिका ने न केवल पढ़ना-लिखना सीखा बल्कि आज वह गांव की अन्य बालिकाओं को भी प्रेरित कर रही है।',
    beneficiariesCount: 45,
    category: 'शिक्षा क्रांति',
    badgeText: 'Shiksha Mission'
  },
  {
    id: 'story-02',
    title: 'Restoring Vision: 86-Year-Old Ramdev Ji Gets Free Cataract Care',
    titleHindi: 'रोशनी की वापसी: 86 वर्षीय रामदेव जी का सफल मोतियाबिंद उपचार',
    date: '2026-02-14',
    description: 'ग्रामीण नेत्र शिविर में पहचान के बाद वाराणसी अस्पताल में निशुल्क सर्जरी कराकर पुनः देखने में सक्षम हुए।',
    beneficiariesCount: 120,
    category: 'स्वास्थ्य रक्षा',
    badgeText: 'Vision Relief'
  },
  {
    id: 'story-03',
    title: 'Annapurna Rasoi: Zero Hunger in Mohammadabad Slums',
    titleHindi: 'अन्नपूर्णा रसोई: कोई भी भूखा न सोए का संकल्प',
    date: '2026-03-01',
    description: 'कड़ाके की ठंड और बरसात में दैनिक श्रमिकों व असहायों को पौष्टिक गर्म भोजन की सतत आपूर्ति।',
    beneficiariesCount: 500,
    category: 'अन्नदान',
    badgeText: 'Food for All'
  }
];
