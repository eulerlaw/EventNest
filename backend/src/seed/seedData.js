const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const config = require('../config/config');
const connectDB = require('../config/db');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const qrService = require('../services/qrService');
const sentimentAnalyzer = require('../services/sentimentAnalyzer');

const seedAll = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    await Feedback.deleteMany({});
    await Notification.deleteMany({});

    console.log('[Seed] Creating demo users...');
    // 1. Admin
    const admin = await User.create({
      name: 'Ms. Shipra Raheja (Project Admin)',
      email: 'admin@eventnest.gtbit.ac.in',
      password: 'admin123',
      role: 'admin',
      department: 'Information Technology',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80'
    });

    // 2. Organizers
    const orgIEEE = await User.create({
      name: 'IEEE GTBIT Student Branch',
      email: 'ieee@gtbit.ac.in',
      password: 'organizer123',
      role: 'organizer',
      department: 'Information Technology',
      organizationName: 'IEEE GTBIT SB',
      avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&q=80'
    });

    const orgGDSC = await User.create({
      name: 'GDSC GTBIT Chapter',
      email: 'gdsc@gtbit.ac.in',
      password: 'organizer123',
      role: 'organizer',
      department: 'Computer Science & Engineering',
      organizationName: 'Google Developer Groups on Campus',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&q=80'
    });

    const orgCultural = await User.create({
      name: 'Tarang Cultural Society',
      email: 'cultural@gtbit.ac.in',
      password: 'organizer123',
      role: 'organizer',
      department: 'Student Affairs',
      organizationName: 'GTBIT Cultural Council',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80'
    });

    // 3. Students
    const studentAnshuman = await User.create({
      name: 'Anshuman Chaturvedi',
      email: 'anshuman@gtbit.ac.in',
      password: 'student123',
      role: 'student',
      department: 'Information Technology',
      rollNumber: '03276803123',
      interests: ['Artificial Intelligence', 'Web Development', 'Hackathon', 'Competitive Programming'],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80'
    });

    const studentDivya = await User.create({
      name: 'Divya Prakash Yadav',
      email: 'divya@gtbit.ac.in',
      password: 'student123',
      role: 'student',
      department: 'Information Technology',
      rollNumber: '04376803123',
      interests: ['Machine Learning', 'Data Science', 'Workshop', 'Python'],
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&q=80'
    });

    const studentSahil = await User.create({
      name: 'Sahil Raj',
      email: 'sahil@gtbit.ac.in',
      password: 'student123',
      role: 'student',
      department: 'Information Technology',
      rollNumber: '03576803123',
      interests: ['Cloud Computing', 'Web Development', 'Cybersecurity'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80'
    });

    const studentAarav = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@gtbit.ac.in',
      password: 'student123',
      role: 'student',
      department: 'Computer Science & Engineering',
      rollNumber: '01076803123',
      interests: ['Cultural', 'Music', 'Photography', 'Gaming'],
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&q=80'
    });

    console.log('[Seed] Creating realistic campus events...');
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const event1 = await Event.create({
      title: 'HackNest 2026: 36-Hour National Hackathon',
      description: 'Join Delhi NCR’s premier annual student hackathon. Build cutting-edge solutions in Artificial Intelligence, Web3, Climate Tech, and HealthTech. Mentorship from top tech unicorns and cash prizes worth ₹1,50,000!',
      category: 'Hackathon',
      tags: ['hackathon', 'artificial intelligence', 'web development', 'coding', 'innovation', 'cash prize'],
      coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
      dateTime: new Date(now + 3 * day),
      endDateTime: new Date(now + 4.5 * day),
      venue: 'Main Auditorium & Computer Labs 1-4, GTBIT Campus',
      capacity: 150,
      registeredCount: 0,
      registrationDeadline: new Date(now + 2 * day),
      organizer: orgIEEE._id,
      status: 'published',
      approvalStatus: 'approved',
      isFeatured: true
    });

    const event2 = await Event.create({
      title: 'Deep Dive into LLMs & Fullstack Agentic AI',
      description: 'Hands-on technical workshop covering Transformer architectures, Vector Databases, Retrieval-Augmented Generation (RAG), and building multi-agent workflows in Node.js and Python.',
      category: 'Workshop',
      tags: ['artificial intelligence', 'machine learning', 'python', 'rag', 'deep learning', 'tech workshop'],
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
      dateTime: new Date(now + 5 * day),
      venue: 'Seminar Hall B, 3rd Floor, IT Block',
      capacity: 80,
      registeredCount: 0,
      registrationDeadline: new Date(now + 4 * day),
      organizer: orgGDSC._id,
      status: 'published',
      approvalStatus: 'approved'
    });

    const event3 = await Event.create({
      title: 'Tarang 2026: Annual Inter-College Cultural Fest',
      description: 'The biggest cultural extravaganza of GGSIPU! Featuring Battle of the Bands, Street Dance, Fashion Parade, Standup Comedy Night, and food stalls from across Delhi.',
      category: 'Cultural',
      tags: ['cultural', 'music', 'dance', 'fest', 'bands', 'entertainment'],
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
      dateTime: new Date(now + 8 * day),
      venue: 'GTBIT Open Grounds & Amphitheatre',
      capacity: 500,
      registeredCount: 0,
      registrationDeadline: new Date(now + 7 * day),
      organizer: orgCultural._id,
      status: 'published',
      approvalStatus: 'approved',
      isFeatured: true
    });

    const event4 = await Event.create({
      title: 'Competitive Programming Masterclass & LeetCode Bootcamp',
      description: 'Intensive 2-day workshop on Dynamic Programming, Graph Algorithms, and interview problem-solving strategies with Google and Amazon placement alumni.',
      category: 'Technical',
      tags: ['competitive programming', 'algorithms', 'data structures', 'placements', 'coding'],
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
      dateTime: new Date(now + 12 * day),
      venue: 'Lab 5, Central Computing Facility',
      capacity: 60,
      registeredCount: 0,
      registrationDeadline: new Date(now + 10 * day),
      organizer: orgIEEE._id,
      status: 'published',
      approvalStatus: 'approved'
    });

    // Completed Event with Rich Attendee Feedback for Real Sentiment Analytics
    const completedEvent = await Event.create({
      title: 'DevOps & Cloud Native Architecture Bootcamp',
      description: 'A 2-day hands-on bootcamp exploring Docker containerization, Kubernetes clusters, CI/CD pipelines, and AWS deployment best practices.',
      category: 'Workshop',
      tags: ['cloud computing', 'devops', 'docker', 'kubernetes', 'aws'],
      coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80',
      dateTime: new Date(now - 5 * day),
      endDateTime: new Date(now - 3 * day),
      venue: 'Auditorium 2, Academic Block 1',
      capacity: 100,
      registeredCount: 0,
      registrationDeadline: new Date(now - 6 * day),
      organizer: orgGDSC._id,
      status: 'completed',
      approvalStatus: 'approved'
    });

    console.log('[Seed] Registering demo participants & generating tickets...');
    const createReg = async (user, event, isAttended = false) => {
      const ticketId = qrService.generateTicketId();
      const qrPayload = qrService.generateQRPayload(ticketId, event._id, user._id);
      const reg = await Registration.create({
        user: user._id,
        event: event._id,
        ticketId,
        qrCodeString: qrPayload,
        status: isAttended ? 'attended' : 'registered',
        attendedAt: isAttended ? new Date(event.dateTime) : null
      });
      await Event.findByIdAndUpdate(event._id, { $inc: { registeredCount: 1 } });
      return reg;
    };

    // Upcoming registrations
    await createReg(studentAnshuman, event1, false);
    await createReg(studentDivya, event1, false);
    await createReg(studentSahil, event1, false);

    await createReg(studentAnshuman, event2, false);
    await createReg(studentDivya, event2, false);

    await createReg(studentAarav, event3, false);
    await createReg(studentSahil, event3, false);

    // Completed event registrations (Attended)
    const regC1 = await createReg(studentAnshuman, completedEvent, true);
    const regC2 = await createReg(studentDivya, completedEvent, true);
    const regC3 = await createReg(studentSahil, completedEvent, true);
    const regC4 = await createReg(studentAarav, completedEvent, true);

    console.log('[Seed] Submitting realistic feedbacks and computing VADER sentiments...');
    const feedbacksRaw = [
      {
        user: studentAnshuman,
        rating: 5,
        comment: 'Outstanding workshop! The speaker explained Docker and Kubernetes with clear hands-on demos. Really helpful and well-organized.'
      },
      {
        user: studentDivya,
        rating: 4,
        comment: 'Very informative session and great presentation slides. The audio in the auditorium had minor glitches initially, but overall a great learning experience!'
      },
      {
        user: studentSahil,
        rating: 5,
        comment: 'Superb content! The AWS deployment walkthrough was fantastic and completely worth the time. Delicious refreshments too.'
      },
      {
        user: studentAarav,
        rating: 2,
        comment: 'The venue was overcrowded and delayed by 45 minutes. The sound in the back rows was unclear and disorganized.'
      }
    ];

    let totalRating = 0;
    for (const f of feedbacksRaw) {
      const sentiment = sentimentAnalyzer.analyzeSentiment(f.comment);
      await Feedback.create({
        event: completedEvent._id,
        user: f.user._id,
        rating: f.rating,
        commentText: f.comment,
        sentiment: {
          score: sentiment.score,
          label: sentiment.label,
          keywords: sentiment.keywords
        }
      });
      totalRating += f.rating;
    }

    completedEvent.feedbackCount = feedbacksRaw.length;
    completedEvent.averageRating = parseFloat((totalRating / feedbacksRaw.length).toFixed(2));
    await completedEvent.save();

    console.log('[Seed] Creating welcome in-app notifications...');
    await Notification.create({
      recipient: studentAnshuman._id,
      title: 'Welcome to EventNest! 🚀',
      message: 'Explore upcoming GTBIT hackathons, workshops, and get personalized recommendations based on your IT department interests.',
      type: 'system',
      link: '/student/recommended'
    });

    await Notification.create({
      recipient: studentAnshuman._id,
      title: 'Ticket Ready: HackNest 2026',
      message: 'Your registration for HackNest 2026 is confirmed. View your QR pass under My Registrations.',
      type: 'registration',
      link: '/student/registrations'
    });

    console.log('[Seed] Demo data seeding completed successfully!');
    console.log('====================================================');
    console.log('Demo Credentials for Viva / Evaluation:');
    console.log('Admin:     admin@eventnest.gtbit.ac.in      | pass: admin123');
    console.log('Organizer: ieee@gtbit.ac.in               | pass: organizer123');
    console.log('Organizer: gdsc@gtbit.ac.in               | pass: organizer123');
    console.log('Student:   anshuman@gtbit.ac.in           | pass: student123');
    console.log('Student:   divya@gtbit.ac.in              | pass: student123');
    console.log('Student:   sahil@gtbit.ac.in              | pass: student123');
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedAll();
