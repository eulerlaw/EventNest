const Event = require('../models/Event');

/**
 * Intelligent Campus Event Chatbot Assistant
 * Implements intent classification & entity extraction for campus queries.
 */
async function processChatbotQuery(userMessage, user = null) {
  const query = (userMessage || '').toLowerCase().trim();

  // Intent patterns
  const intents = [
    {
      name: 'find_events',
      keywords: ['event', 'hackathon', 'workshop', 'seminar', 'cultural', 'fest', 'what is happening', 'find', 'explore', 'upcoming', 'tech', 'coding'],
      handler: async () => {
        const events = await Event.find({ status: 'published' })
          .sort({ dateTime: 1 })
          .limit(4)
          .select('title category dateTime venue capacity registeredCount coverImage');

        if (!events || events.length === 0) {
          return {
            text: "There are no upcoming events scheduled right now. Check back soon or visit the Explore page!",
            suggestions: ["How do I register?", "Tell me about EventNest", "Contact support"]
          };
        }

        const eventListText = events.map(e => `• **${e.title}** (${e.category}) on ${new Date(e.dateTime).toLocaleDateString()} at ${e.venue}`).join('\n');
        return {
          text: `Here are the top upcoming events on campus:\n\n${eventListText}\n\nYou can click on any event on the **Explore Events** page to view full details and register!`,
          events: events.map(e => ({
            id: e._id,
            title: e.title,
            category: e.category,
            dateTime: e.dateTime,
            venue: e.venue
          })),
          suggestions: ["Show tech hackathons", "How to get QR pass?", "How does recommendation work?"]
        };
      }
    },
    {
      name: 'qr_pass_attendance',
      keywords: ['qr', 'pass', 'ticket', 'attendance', 'checkin', 'check in', 'entry', 'gate'],
      handler: async () => {
        return {
          text: `🎟️ **Digital QR Pass & Attendance:**\n\n1. When you register for any event, EventNest instantly generates a **cryptographically signed digital QR pass**.\n2. You can access your pass under **My Registrations** or in the event details modal.\n3. Show the QR pass at the event entrance venue.\n4. The event organiser scans it using the EventNest QR scanner to mark your verified attendance!`,
          suggestions: ["View my registrations", "How do I give feedback?", "Browse events"]
        };
      }
    },
    {
      name: 'recommendation_info',
      keywords: ['recommend', 'recommendation', 'personalize', 'algorithm', 'tf-idf', 'cosine', 'how does it work'],
      handler: async () => {
        return {
          text: `🧠 **EventNest Recommendation Engine:**\n\nEventNest uses **Content-Based Filtering** with **TF-IDF (Term Frequency-Inverse Document Frequency)** and **Cosine Similarity**:\n• We construct an interest vector based on your chosen interests, department, and past registered events.\n• We compare it against event feature vectors (category, description, tags).\n• The higher the cosine similarity score, the higher it ranks in your **Personalized Recommendations** dashboard!`,
          suggestions: ["View recommended events", "Update my interests", "Show upcoming events"]
        };
      }
    },
    {
      name: 'sentiment_feedback_info',
      keywords: ['feedback', 'sentiment', 'review', 'rating', 'vader', 'nlp', 'opinion'],
      handler: async () => {
        return {
          text: `⭐ **AI Feedback & Sentiment Analysis:**\n\n• After attending an event, students submit star ratings and detailed written feedback.\n• Our NLP sentiment engine (based on the VADER valence lexicon) automatically classifies feedback into **Positive**, **Neutral**, or **Negative**.\n• Organisers see sentiment distributions, keyword clouds, and theme breakdowns (Content, Organization, Venue, Hospitality) in their analytics dashboard.`,
          suggestions: ["Where can I submit feedback?", "Browse events", "Organiser features"]
        };
      }
    },
    {
      name: 'project_info',
      keywords: ['who made', 'creators', 'team', 'synopsis', 'minor project', 'gtbit', 'ggsipu', 'shipra'],
      handler: async () => {
        return {
          text: `🎓 **EventNest Academic Synopsis Info:**\n\n• **Project**: EventNest – College Event Management System\n• **Institution**: Guru Tegh Bahadur Institute of Technology (GTBIT), affiliated to GGSIPU, New Delhi\n• **Team**: Anshuman Chaturvedi (03276803123), Divya Prakash Yadav (04376803123), Sahil Raj (03576803123)\n• **Project Guide**: Ms. Shipra Raheja (Department of Information Technology)`,
          suggestions: ["Show upcoming events", "How do I register?", "Organiser dashboard"]
        };
      }
    },
    {
      name: 'registration_help',
      keywords: ['how to register', 'register', 'sign up for event', 'book ticket', 'deadline', 'capacity'],
      handler: async () => {
        return {
          text: `📝 **How to Register for an Event:**\n\n1. Sign in with your student account.\n2. Browse to **Explore Events** and choose the event you like.\n3. Click **Register Now**.\n4. EventNest automatically verifies available capacity and confirms your seat with a unique digital QR ticket.\n5. You'll receive an in-app notification immediately!`,
          suggestions: ["Explore Events", "My Registrations", "Help with QR pass"]
        };
      }
    }
  ];

  // Match best intent
  for (const item of intents) {
    if (item.keywords.some(kw => query.includes(kw))) {
      return await item.handler();
    }
  }

  // Default Fallback
  return {
    text: `👋 Hello! I am NestBot, your EventNest campus assistant. I can help you find upcoming college events, guide you on registration, explain your digital QR passes, or share details about our recommendation and sentiment analysis algorithms.\n\nWhat would you like to know?`,
    suggestions: ["Upcoming events", "How to get QR pass?", "How does recommendation work?", "Tell me about EventNest"]
  };
}

module.exports = {
  processChatbotQuery
};
