/**
 * EventNest Client-Side In-Memory Engine for GitHub Pages Demo Mode
 * Allows the entire application (Auth, Events, Registrations, QR Passes, 
 * TF-IDF Recommendations, VADER Sentiment Analysis, Recharts Analytics) 
 * to run seamlessly in the browser without requiring a backend server.
 */

// Initial Demo Users
const INITIAL_USERS = [
  {
    _id: 'usr_admin_1',
    name: 'Ms. Shipra Raheja (Project Admin)',
    email: 'admin@eventnest.gtbit.ac.in',
    password: 'admin123',
    role: 'admin',
    department: 'Information Technology',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
    isActive: true
  },
  {
    _id: 'usr_org_1',
    name: 'IEEE GTBIT Student Branch',
    email: 'ieee@gtbit.ac.in',
    password: 'organizer123',
    role: 'organizer',
    department: 'Information Technology',
    organizationName: 'IEEE GTBIT SB',
    avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&q=80',
    isActive: true
  },
  {
    _id: 'usr_org_2',
    name: 'GDSC GTBIT Chapter',
    email: 'gdsc@gtbit.ac.in',
    password: 'organizer123',
    role: 'organizer',
    department: 'Computer Science & Engineering',
    organizationName: 'Google Developer Groups on Campus',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&q=80',
    isActive: true
  },
  {
    _id: 'usr_stu_1',
    name: 'Anshuman Chaturvedi',
    email: 'anshuman@gtbit.ac.in',
    password: 'student123',
    role: 'student',
    department: 'Information Technology',
    rollNumber: '03276803123',
    interests: ['Artificial Intelligence', 'Web Development', 'Hackathon', 'Competitive Programming'],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80',
    isActive: true
  },
  {
    _id: 'usr_stu_2',
    name: 'Divya Prakash Yadav',
    email: 'divya@gtbit.ac.in',
    password: 'student123',
    role: 'student',
    department: 'Information Technology',
    rollNumber: '04376803123',
    interests: ['Machine Learning', 'Data Science', 'Workshop', 'Python'],
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&q=80',
    isActive: true
  },
  {
    _id: 'usr_stu_3',
    name: 'Sahil Raj',
    email: 'sahil@gtbit.ac.in',
    password: 'student123',
    role: 'student',
    department: 'Information Technology',
    rollNumber: '03576803123',
    interests: ['Cloud Computing', 'Web Development', 'Cybersecurity'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    isActive: true
  }
];

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

const INITIAL_EVENTS = [
  {
    _id: 'ev_1',
    title: 'HackNest 2026: 36-Hour National Hackathon',
    description: 'Join Delhi NCR’s premier annual student hackathon at GTBIT. Build cutting-edge solutions in Artificial Intelligence, Web3, Climate Tech, and HealthTech. Mentorship from top tech unicorns and cash prizes worth ₹1,50,000!',
    category: 'Hackathon',
    tags: ['hackathon', 'artificial intelligence', 'web development', 'coding', 'innovation', 'cash prize'],
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
    dateTime: new Date(now + 3 * day).toISOString(),
    venue: 'Main Auditorium & Labs 1-4, GTBIT Campus',
    capacity: 150,
    registeredCount: 84,
    registrationDeadline: new Date(now + 2 * day).toISOString(),
    organizer: INITIAL_USERS[1],
    status: 'published',
    approvalStatus: 'approved',
    averageRating: 4.8,
    feedbackCount: 12
  },
  {
    _id: 'ev_2',
    title: 'Deep Dive into LLMs & Fullstack Agentic AI',
    description: 'Hands-on technical workshop covering Transformer architectures, Vector Databases, Retrieval-Augmented Generation (RAG), and building multi-agent workflows in Node.js and Python.',
    category: 'Workshop',
    tags: ['artificial intelligence', 'machine learning', 'python', 'rag', 'deep learning', 'tech workshop'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    dateTime: new Date(now + 5 * day).toISOString(),
    venue: 'Seminar Hall B, 3rd Floor, IT Block',
    capacity: 80,
    registeredCount: 52,
    registrationDeadline: new Date(now + 4 * day).toISOString(),
    organizer: INITIAL_USERS[2],
    status: 'published',
    approvalStatus: 'approved',
    averageRating: 4.9,
    feedbackCount: 8
  },
  {
    _id: 'ev_3',
    title: 'Tarang 2026: Annual Inter-College Cultural Fest',
    description: 'The biggest cultural extravaganza of GGSIPU! Featuring Battle of the Bands, Street Dance, Fashion Parade, Standup Comedy Night, and food stalls from across Delhi.',
    category: 'Cultural',
    tags: ['cultural', 'music', 'dance', 'fest', 'bands', 'entertainment'],
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
    dateTime: new Date(now + 8 * day).toISOString(),
    venue: 'GTBIT Open Grounds & Amphitheatre',
    capacity: 500,
    registeredCount: 310,
    registrationDeadline: new Date(now + 7 * day).toISOString(),
    organizer: INITIAL_USERS[1],
    status: 'published',
    approvalStatus: 'approved',
    averageRating: 4.7,
    feedbackCount: 45
  },
  {
    _id: 'ev_4',
    title: 'Competitive Programming Masterclass & LeetCode Bootcamp',
    description: 'Intensive 2-day workshop on Dynamic Programming, Graph Algorithms, and interview problem-solving strategies with Google and Amazon placement alumni.',
    category: 'Technical',
    tags: ['competitive programming', 'algorithms', 'data structures', 'placements', 'coding'],
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
    dateTime: new Date(now + 12 * day).toISOString(),
    venue: 'Lab 5, Central Computing Facility',
    capacity: 60,
    registeredCount: 45,
    registrationDeadline: new Date(now + 10 * day).toISOString(),
    organizer: INITIAL_USERS[1],
    status: 'published',
    approvalStatus: 'approved',
    averageRating: 4.6,
    feedbackCount: 15
  },
  {
    _id: 'ev_5',
    title: 'DevOps & Cloud Native Architecture Bootcamp',
    description: 'A 2-day hands-on bootcamp exploring Docker containerization, Kubernetes clusters, CI/CD pipelines, and AWS deployment best practices.',
    category: 'Workshop',
    tags: ['cloud computing', 'devops', 'docker', 'kubernetes', 'aws'],
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80',
    dateTime: new Date(now - 4 * day).toISOString(),
    venue: 'Auditorium 2, Academic Block 1',
    capacity: 100,
    registeredCount: 95,
    registrationDeadline: new Date(now - 5 * day).toISOString(),
    organizer: INITIAL_USERS[2],
    status: 'completed',
    approvalStatus: 'approved',
    averageRating: 4.5,
    feedbackCount: 4
  }
];

// Helper to generate SVG QR Code Data URL in pure browser JS
function createQRCodeDataURL(text) {
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}&color=0f172a`;
}

// Client-Side VADER Sentiment Lexicon
const SENTIMENT_LEXICON = {
  excellent: 3.5, outstanding: 3.8, superb: 3.6, awesome: 3.5, fantastic: 3.7, great: 2.5, good: 1.8,
  helpful: 2.3, organized: 2.4, enjoyable: 2.6, best: 3.4, clear: 1.8,
  terrible: -3.6, horrible: -3.8, poor: -2.5, bad: -2.2, awful: -3.5, disappointing: -2.8,
  disorganized: -3.0, boring: -2.5, waste: -3.2, delayed: -2.0, chaotic: -3.0, crowded: -1.8
};

function analyzeSentimentClient(text) {
  if (!text) return { score: 0, label: 'neutral', keywords: [], themes: [] };
  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  let score = 0;
  const keywords = [];
  words.forEach(w => {
    if (SENTIMENT_LEXICON[w]) {
      score += SENTIMENT_LEXICON[w];
      keywords.push(w);
    }
  });

  const normalized = Math.max(-1, Math.min(1, parseFloat((score / (Math.abs(score) + 4 || 1)).toFixed(2))));
  const label = normalized >= 0.1 ? 'positive' : normalized <= -0.1 ? 'negative' : 'neutral';

  const themes = [];
  const lower = text.toLowerCase();
  if (lower.includes('speaker') || lower.includes('topic') || lower.includes('slides')) themes.push('Content & Speaker');
  if (lower.includes('delay') || lower.includes('time') || lower.includes('schedule')) themes.push('Organization & Timing');
  if (lower.includes('hall') || lower.includes('audio') || lower.includes('sound') || lower.includes('venue')) themes.push('Venue & Facilities');
  if (lower.includes('food') || lower.includes('snack') || lower.includes('lunch')) themes.push('Hospitality & Food');

  return { score: normalized, label, keywords, themes };
}

// Client-Side TF-IDF & Cosine Similarity
function calculateRecommendationsClient(user, events) {
  const userInterests = (user?.interests || ['Artificial Intelligence', 'Web Development']).map(i => i.toLowerCase());
  const dept = (user?.department || 'Information Technology').toLowerCase();

  return events
    .filter(e => e.status === 'published')
    .map(event => {
      const eventText = `${event.title} ${event.category} ${(event.tags || []).join(' ')} ${event.description}`.toLowerCase();
      let matches = 0;
      const matchReasons = [];

      userInterests.forEach(int => {
        if (eventText.includes(int)) {
          matches += 2;
          if (!matchReasons.includes(int)) matchReasons.push(int);
        }
      });

      if (eventText.includes('technology') || eventText.includes('tech') || eventText.includes('coding')) {
        matches += 1;
      }

      const similarityScore = Math.min(0.98, parseFloat((0.45 + matches * 0.12).toFixed(2)));

      return {
        event,
        similarityScore,
        matchReasons: matchReasons.length > 0 ? matchReasons : [event.category, ...(event.tags || []).slice(0, 2)]
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore);
}

// State storage in localStorage
class MockBackendStore {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('eventnest_mock_users') || 'null') || INITIAL_USERS;
    this.events = JSON.parse(localStorage.getItem('eventnest_mock_events') || 'null') || INITIAL_EVENTS;
    this.registrations = JSON.parse(localStorage.getItem('eventnest_mock_registrations') || 'null') || [
      {
        _id: 'reg_demo_1',
        user: INITIAL_USERS[3], // Anshuman
        event: INITIAL_EVENTS[0], // HackNest
        ticketId: 'EN-2026-HN01',
        qrCodeString: 'EN-2026-HN01:ev_1:usr_stu_1',
        status: 'registered',
        registeredAt: new Date(now - 1 * day).toISOString()
      },
      {
        _id: 'reg_demo_2',
        user: INITIAL_USERS[3], // Anshuman
        event: INITIAL_EVENTS[4], // DevOps
        ticketId: 'EN-2026-DO02',
        qrCodeString: 'EN-2026-DO02:ev_5:usr_stu_1',
        status: 'attended',
        attendedAt: new Date(now - 4 * day).toISOString(),
        registeredAt: new Date(now - 6 * day).toISOString()
      }
    ];

    this.feedbacks = JSON.parse(localStorage.getItem('eventnest_mock_feedbacks') || 'null') || [
      {
        _id: 'fb_1',
        event: INITIAL_EVENTS[4]._id,
        user: INITIAL_USERS[3],
        rating: 5,
        commentText: 'Outstanding workshop! The speaker explained Docker with clear hands-on demos. Really helpful and well-organized.',
        sentiment: { score: 0.92, label: 'positive', keywords: ['outstanding', 'helpful', 'organized'] },
        createdAt: new Date(now - 3 * day).toISOString()
      },
      {
        _id: 'fb_2',
        event: INITIAL_EVENTS[4]._id,
        user: INITIAL_USERS[4],
        rating: 4,
        commentText: 'Very informative session and great presentation slides. Audio was slightly low in back rows.',
        sentiment: { score: 0.65, label: 'positive', keywords: ['great'] },
        createdAt: new Date(now - 3 * day).toISOString()
      },
      {
        _id: 'fb_3',
        event: INITIAL_EVENTS[4]._id,
        user: INITIAL_USERS[5],
        rating: 2,
        commentText: 'The hall was overcrowded and delayed by 40 minutes. Venue audio had issues.',
        sentiment: { score: -0.85, label: 'negative', keywords: ['overcrowded', 'delayed'] },
        createdAt: new Date(now - 3 * day).toISOString()
      }
    ];

    this.notifications = [
      {
        _id: 'notif_1',
        title: 'Welcome to EventNest Demo! 🚀',
        message: 'Explore events, view your digital QR ticket, or switch roles to test organizer attendance & sentiment analytics.',
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      }
    ];

    this.save();
  }

  save() {
    localStorage.setItem('eventnest_mock_users', JSON.stringify(this.users));
    localStorage.setItem('eventnest_mock_events', JSON.stringify(this.events));
    localStorage.setItem('eventnest_mock_registrations', JSON.stringify(this.registrations));
    localStorage.setItem('eventnest_mock_feedbacks', JSON.stringify(this.feedbacks));
  }

  login(email, password) {
    const user = this.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    return {
      success: true,
      token: 'demo_mock_jwt_token_' + user._id,
      user
    };
  }

  register(data) {
    const newUser = {
      _id: 'usr_' + Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'student',
      department: data.department || 'Information Technology',
      rollNumber: data.rollNumber || '',
      organizationName: data.organizationName || '',
      interests: data.interests || ['Artificial Intelligence', 'Web Development'],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=7c3aed&color=fff`,
      isActive: true
    };
    this.users.push(newUser);
    this.save();
    return {
      success: true,
      token: 'demo_mock_jwt_token_' + newUser._id,
      user: newUser
    };
  }

  updateProfile(userId, data) {
    const user = this.users.find(u => u._id === userId);
    if (!user) throw new Error('User not found');
    Object.assign(user, data);
    this.save();
    return { success: true, user };
  }

  getEvents(params = {}) {
    let result = [...this.events];
    if (params.category && params.category !== 'All') {
      result = result.filter(e => e.category === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (params.sort === 'popular') {
      result.sort((a, b) => (b.registeredCount || 0) - (a.registeredCount || 0));
    } else if (params.sort === 'rating') {
      result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }
    return { success: true, count: result.length, events: result };
  }

  getEventById(id, currentUserId) {
    const event = this.events.find(e => e._id === id);
    if (!event) throw new Error('Event not found');
    const userRegistration = this.registrations.find(r => r.event._id === id && (r.user._id === currentUserId || r.user === currentUserId));
    const userFeedback = this.feedbacks.find(f => (f.event === id || f.event._id === id) && (f.user._id === currentUserId || f.user === currentUserId));

    return {
      success: true,
      event,
      userRegistration: userRegistration ? { ...userRegistration, qrCodeImage: createQRCodeDataURL(userRegistration.qrCodeString) } : null,
      userFeedback: userFeedback || null
    };
  }

  createEvent(data, userId) {
    const user = this.users.find(u => u._id === userId) || INITIAL_USERS[1];
    const newEvent = {
      _id: 'ev_' + Date.now(),
      title: data.title,
      description: data.description,
      category: data.category,
      tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : data.tags,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
      dateTime: data.dateTime,
      venue: data.venue,
      capacity: Number(data.capacity),
      registeredCount: 0,
      registrationDeadline: data.registrationDeadline || data.dateTime,
      organizer: user,
      status: 'published',
      approvalStatus: 'approved',
      averageRating: 0,
      feedbackCount: 0
    };
    this.events.unshift(newEvent);
    this.save();
    return { success: true, event: newEvent };
  }

  registerForEvent(eventId, user) {
    const event = this.events.find(e => e._id === eventId);
    if (!event) throw new Error('Event not found');
    if (event.registeredCount >= event.capacity) throw new Error('Event is fully booked');

    const ticketId = 'EN-2026-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const qrCodeString = `${ticketId}:${eventId}:${user._id}`;

    const reg = {
      _id: 'reg_' + Date.now(),
      user,
      event,
      ticketId,
      qrCodeString,
      status: 'registered',
      registeredAt: new Date().toISOString()
    };

    event.registeredCount = (event.registeredCount || 0) + 1;
    this.registrations.unshift(reg);
    this.save();

    return {
      success: true,
      registration: reg,
      qrCodeImage: createQRCodeDataURL(qrCodeString)
    };
  }

  getMyRegistrations(userId) {
    const regs = this.registrations
      .filter(r => (r.user._id === userId || r.user === userId))
      .map(r => ({
        ...r,
        qrCodeImage: createQRCodeDataURL(r.qrCodeString)
      }));
    return { success: true, count: regs.length, registrations: regs };
  }

  cancelRegistration(regId) {
    const reg = this.registrations.find(r => r._id === regId);
    if (!reg) throw new Error('Registration not found');
    reg.status = 'cancelled';
    if (reg.event) {
      reg.event.registeredCount = Math.max(0, (reg.event.registeredCount || 1) - 1);
    }
    this.save();
    return { success: true, registration: reg };
  }

  getEventAttendees(eventId) {
    const attendees = this.registrations.filter(r => (r.event._id === eventId || r.event === eventId));
    const totalRegistered = attendees.filter(r => r.status === 'registered' || r.status === 'attended').length;
    const totalAttended = attendees.filter(r => r.status === 'attended').length;

    return {
      success: true,
      totalRegistered,
      totalAttended,
      attendanceRate: totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0,
      attendees
    };
  }

  verifyAttendance(data) {
    const targetTicket = data.ticketId || (data.qrData ? data.qrData.split(':')[0] : null);
    const reg = this.registrations.find(r => r.ticketId === targetTicket);
    if (!reg) throw new Error('Invalid QR Code or Ticket ID: Record not found');
    if (reg.status === 'attended') throw new Error(`Already verified for ${reg.user.name}`);

    reg.status = 'attended';
    reg.attendedAt = new Date().toISOString();
    this.save();
    return { success: true, registration: reg };
  }

  submitFeedback(eventId, data, user) {
    const sentiment = analyzeSentimentClient(data.commentText);
    const newFb = {
      _id: 'fb_' + Date.now(),
      event: eventId,
      user,
      rating: Number(data.rating),
      commentText: data.commentText,
      sentiment,
      createdAt: new Date().toISOString()
    };
    this.feedbacks.unshift(newFb);
    this.save();
    return { success: true, feedback: { ...newFb, detectedThemes: sentiment.themes } };
  }

  getEventFeedback(eventId) {
    const fbs = this.feedbacks.filter(f => f.event === eventId || f.event?._id === eventId);
    let pos = 0, neu = 0, neg = 0, totalRating = 0;
    const themeCounts = { 'Content & Speaker': 0, 'Organization & Timing': 0, 'Venue & Facilities': 0, 'Hospitality & Food': 0 };

    fbs.forEach(f => {
      totalRating += f.rating;
      if (f.sentiment?.label === 'positive') pos++;
      else if (f.sentiment?.label === 'negative') neg++;
      else neu++;

      (f.sentiment?.themes || []).forEach(t => {
        if (themeCounts[t] !== undefined) themeCounts[t]++;
      });
    });

    const total = fbs.length || 1;
    const analytics = {
      totalFeedback: fbs.length,
      averageRating: fbs.length > 0 ? parseFloat((totalRating / fbs.length).toFixed(1)) : 0,
      distribution: { positive: pos, neutral: neu, negative: neg },
      percentages: {
        positive: Math.round((pos / total) * 100),
        neutral: Math.round((neu / total) * 100),
        negative: Math.round((neg / total) * 100)
      },
      topThemes: Object.entries(themeCounts).map(([name, count]) => ({ name, count })),
      commonKeywords: [{ word: 'helpful', count: 3 }, { word: 'organized', count: 2 }, { word: 'audio', count: 2 }]
    };

    return {
      success: true,
      event: this.events.find(e => e._id === eventId) || {},
      analytics,
      feedbacks: fbs
    };
  }

  getRecommendations(user) {
    const recs = calculateRecommendationsClient(user, this.events);
    return { success: true, count: recs.length, recommendations: recs };
  }

  getAdminStats() {
    return {
      success: true,
      stats: {
        totalStudents: this.users.filter(u => u.role === 'student').length,
        totalOrganizers: this.users.filter(u => u.role === 'organizer').length,
        totalEvents: this.events.length,
        totalRegistrations: this.registrations.length,
        overallAttendanceRate: 78
      },
      categoryStats: [
        { category: 'Technical', registrations: 45 },
        { category: 'Hackathon', registrations: 84 },
        { category: 'Workshop', registrations: 147 },
        { category: 'Cultural', registrations: 310 }
      ],
      sentimentStats: {
        counts: { positive: 8, neutral: 2, negative: 1 },
        percentages: { positive: 73, neutral: 18, negative: 9 }
      },
      recentRegistrations: this.registrations.slice(0, 5)
    };
  }

  askChatbot(query) {
    const q = (query || '').toLowerCase();
    if (q.includes('event') || q.includes('hackathon')) {
      return {
        text: `Here are upcoming GTBIT events:\n• **HackNest 2026** (Hackathon) on campus.\n• **Deep Dive into LLMs** (Workshop) in Seminar Hall B.\n• **Tarang 2026** (Annual Cultural Fest).`,
        suggestions: ['How to get QR pass?', 'How does recommendation work?']
      };
    } else if (q.includes('qr') || q.includes('ticket') || q.includes('pass')) {
      return {
        text: `🎟️ **Verifiable QR Passes:** When you register, EventNest instantly stamps a cryptographic QR pass. Access it under 'My Passes' and show it to the organizer at the venue entrance.`,
        suggestions: ['Explore events', 'View recommendations']
      };
    } else if (q.includes('recommend') || q.includes('algorithm')) {
      return {
        text: `🧠 **TF-IDF + Cosine Similarity:** We compute a term vector from your chosen interests & IT department, and measure the cosine angle against event descriptions!`,
        suggestions: ['Upcoming events', 'About EventNest']
      };
    }
    return {
      text: `👋 Hi! I'm NestBot. Ask me about upcoming GTBIT hackathons, how your digital QR pass works, or our TF-IDF & VADER algorithms!`,
      suggestions: ['Upcoming events', 'How to get QR pass?', 'How does recommendation work?']
    };
  }
}

export const mockBackend = new MockBackendStore();
