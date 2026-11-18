# EventNest — College Event Management & Intelligence System

[![B.Tech Minor Project](https://img.shields.io/badge/B.Tech%20Project-Information%20Technology-blue.svg)](https://gtbit.ac.in)
[![Institution](https://img.shields.io/badge/GTBIT-GGSIPU%20New%20Delhi-purple.svg)](http://www.ipu.ac.in)
[![Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://react.dev)
[![AI / NLP](https://img.shields.io/badge/Intelligent%20Services-TF--IDF%20%7C%20VADER-orange.svg)](#)

> **Submitted in Partial Fulfilment of the Requirements for the Award of the Degree of Bachelor of Technology in Information Technology (2023–2027)**  
> **Guru Tegh Bahadur Institute of Technology (GTBIT)**, Affiliated to **Guru Gobind Singh Indraprastha University (GGSIPU), New Delhi**

---

### Project Team & Supervision
- **Student Researchers & Developers:**
  - **Anshuman Chaturvedi** (Enrollment: `03276803123`)
  - **Divya Prakash Yadav** (Enrollment: `04376803123`)
  - **Sahil Raj** (Enrollment: `03576803123`)
- **Project Guide:** **Ms. Shipra Raheja**, Department of Information Technology, GTBIT

---

## 1. Executive Summary & Research Gap

College campus events have traditionally relied on fragmented, manual communication channels—physical notice boards, WhatsApp broadcast groups, informal Google Forms, and paper spreadsheets. Existing campus event systems act merely as digitized record-keeping ledgers without personalization or automated feedback synthesis.

**EventNest** bridges this academic and engineering gap by integrating:
1. **Full-Lifecycle Event Management & Cryptographic Digital Pass Issuance**: Server-side capacity validation, duplicate registration prevention, and tamper-proof HMAC-SHA256 digital QR passes.
2. **Personalized Event Recommendations via Content-Based Filtering**: Combining student interests, department weighting, and past registration history into TF-IDF (Term Frequency-Inverse Document Frequency) feature vectors ranked by Cosine Similarity.
3. **Automated Opinion Mining & Sentiment Analysis**: Real-time natural language processing using a VADER-style valence lexicon to classify post-event reviews into Positive, Neutral, or Negative sentiments with thematic classification (Venue, Organization, Content & Speaker, Hospitality).
4. **Interactive Role-Based Analytics Dashboards**: Dedicated interfaces for Students, Organizers, and College Administrators powered by Recharts.
5. **NestBot Campus Event Assistant**: Intent-based chatbot assisting students with event discovery, QR pass guidance, and FAQs.

---

## 2. System Architecture

```
+-------------------------------------------------------------------------+
|                           PRESENTATION LAYER                            |
|          React.js 18 + Vite + Tailwind CSS + Lucide + Recharts          |
|  - Student Dashboard   - Organizer Studio   - Central Admin Hub         |
|  - Digital QR Wallet   - Gate QR Scanner    - NestBot Campus Assistant  |
+-------------------------------------------------------------------------+
                                    | (REST APIs / JSON)
                                    v
+-------------------------------------------------------------------------+
|                           APPLICATION LAYER                             |
|               Node.js + Express.js Modular Backend API                  |
|  - JWT Authentication Middleware & Role-Based Access Control (RBAC)     |
|  - Server-side Capacity & Duplicate Registration Safeguards             |
|  - In-App & Nodemailer Notification Dispatcher                          |
+-------------------------------------------------------------------------+
            |                                         |
            v                                         v
+-----------------------------+     +-------------------------------------+
|     INTELLIGENT SERVICES    |     |             DATA LAYER              |
|  - TF-IDF Vectorizer        |     |               MongoDB               |
|  - Cosine Similarity Engine |     |  - Users Collection                 |
|  - VADER Sentiment NLP      |     |  - Events Collection                |
|  - Theme/Keyword Extractor  |     |  - Registrations Collection         |
|  - HMAC-SHA256 QR Signer    |     |  - Feedback Collection              |
+-----------------------------+     |  - Notifications Collection         |
                                    +-------------------------------------+
```

---

## 3. Core Modules & Methodology

### 3.1. Recommendation Engine (TF-IDF & Cosine Similarity)
- **Profile Construction**: A student's profile vector is synthesized by combining:
  - Stated academic department (e.g. `Information Technology`)
  - Chosen interest tags (e.g. `Artificial Intelligence`, `Web Development`, `Hackathon`)
  - Categories of past attended events
- **Event Feature Vector**: Tokenizes title, category, tags, and description, eliminating punctuation and domain-specific stop words.
- **Formula**:
  $$\text{TF}(t, d) = \frac{\text{count}(t, d)}{\sum_{t' \in d} \text{count}(t', d)}$$
  $$\text{IDF}(t, D) = \ln\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1$$
  $$\text{Cosine Similarity}(A, B) = \frac{A \cdot B}{\|A\|_2 \|B\|_2} = \frac{\sum A_i B_i}{\sqrt{\sum A_i^2} \sqrt{\sum B_i^2}}$$
- **Cold-Start Fallback**: If a student is newly registered without prior history, the engine provides high-popularity upcoming campus events sorted by capacity demand.

### 3.2. AI Feedback Analysis & Sentiment Classification
- **Engine**: Implements a valence-aware dictionary tailored for collegiate activities (lectures, labs, hackathons, cultural performances).
- **Linguistic Rules**:
  - Valence rating from $-4$ (most negative) to $+4$ (most positive).
  - Degree modifiers / boosters (e.g., `extremely`, `very`, `incredibly`) scale word valence by $1.3\times - 1.6\times$.
  - Negation detection (`not`, `never`, `hardly`, `didn't`) reverses semantic polarity.
  - Normalized compound score calculation:
    $$\text{Compound Score} = \frac{\text{Valence Sum}}{\sqrt{(\text{Valence Sum})^2 + \alpha}}$$
  - Classification thresholds:
    - **Positive**: $\text{Score} \ge +0.08$
    - **Neutral**: $-0.08 < \text{Score} < +0.08$
    - **Negative**: $\text{Score} \le -0.08$
- **Thematic Categorization**: Automatically detects recurring complaints or praise across `Content & Speaker`, `Organization & Timing`, `Venue & Facilities`, and `Hospitality & Food`.

### 3.3. Verifiable QR Attendance Security
- Tickets are assigned a cryptographically signed payload:
  $$\text{Signature} = \text{HMAC-SHA256}(\text{ticketId} : \text{eventId} : \text{userId}, \text{SECRET})$$
- Gate scanners decode the payload, verify signature integrity, and check that the ticket matches the specific event before marking attendance. Prevents ticket forgery or cross-event reuse.

---

## 4. Pre-Configured Demo Accounts (For Viva Demonstration)

| Role | Email Address | Password | Context |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@eventnest.gtbit.ac.in` | `admin123` | Platform-wide moderation, global stats, user management |
| **Organizer** | `ieee@gtbit.ac.in` | `organizer123` | IEEE GTBIT Student Branch (Hackathons & Workshops) |
| **Organizer** | `gdsc@gtbit.ac.in` | `organizer123` | Google Developer Groups (AI Seminars & Cloud Bootcamps) |
| **Student** | `anshuman@gtbit.ac.in` | `student123` | IT Dept, Roll: `03276803123`, AI & Web Dev Interests |
| **Student** | `divya@gtbit.ac.in` | `student123` | IT Dept, Roll: `04376803123`, Machine Learning Interests |
| **Student** | `sahil@gtbit.ac.in` | `student123` | IT Dept, Roll: `03576803123`, Cloud & Cybersecurity Interests |

*(Tip: The login page includes 1-click demo filler buttons for instant evaluation without typing).*

---

## 5. Getting Started & Installation

### Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB** (Local `mongodb://127.0.0.1:27017` or free MongoDB Atlas URI)

### Step 1: Clone or Navigate to Project
```bash
cd eventnest
```

### Step 2: Backend Setup & Seed Data
```bash
cd backend
npm install
npm run seed     # Seeds realistic GTBIT events, users, tickets & feedback
npm start        # Launches REST API server on http://localhost:5000
```

### Step 3: Frontend Setup
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev      # Launches Vite dev server on http://localhost:3000
```

Open your browser and navigate to **`http://localhost:3000`**.

---

## 6. Viva & Academic Defense Q&A

**Q1: Why did you choose Content-Based Filtering over Collaborative Filtering for campus events?**  
*Answer*: Collaborative filtering suffers from severe cold-start and sparsity issues in university settings because events are time-bound, seasonal, or one-off, rarely accumulating the thousands of historical ratings that collaborative models require. Content-based filtering matches event metadata (categories, tags, descriptions) directly against a student's stated interests and academic department via TF-IDF and Cosine Similarity, functioning effectively even for brand-new events.

**Q2: How does your sentiment analysis module work?**  
*Answer*: We implemented a rule-based valence lexicon approach based on VADER principles. It scores words on a $-4$ to $+4$ scale, adjusts for intensifiers ("extremely helpful") and negations ("not well organized"), and normalizes the sum into a compound score between $-1$ and $+1$. This allows instant, transparent feedback categorization without requiring heavy external GPU infrastructure.

**Q3: How do you prevent ticket tampering with QR codes?**  
*Answer*: The QR code does not simply contain the user's ID. It embeds a Base64-encoded JSON payload containing the ticket ID, event ID, user ID, and an HMAC-SHA256 signature generated using a private server secret. When scanned at the venue, the server verifies the cryptographic signature before updating attendance status in MongoDB.

---

## 7. Project Structure

```
eventnest/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & environment configurations
│   │   ├── controllers/     # API request handlers
│   │   ├── middleware/      # JWT auth, role validation, error handling
│   │   ├── models/          # Mongoose Schemas (User, Event, Registration, Feedback, Notification)
│   │   ├── routes/          # Express REST endpoints
│   │   ├── services/
│   │   │   ├── recommendationEngine.js   # TF-IDF & Cosine Similarity
│   │   │   ├── sentimentAnalyzer.js      # VADER Sentiment NLP Engine
│   │   │   ├── qrService.js              # HMAC-SHA256 QR generator & validator
│   │   │   ├── notificationService.js    # In-App & Nodemailer dispatch
│   │   │   └── chatbotService.js         # NestBot Intent Query Processor
│   │   ├── seed/
│   │   │   └── seedData.js               # GTBIT demo database seeder
│   │   └── server.js        # Express main server entry
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, EventCard, QRPassModal, QRScannerModal, FeedbackModal, StatCard, etc.
│   │   ├── context/         # AuthContext & NotificationContext
│   │   ├── pages/
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── student/     # StudentDashboard, RecommendedEvents, MyRegistrations, StudentProfile
│   │   │   ├── organizer/   # OrganizerDashboard, CreateEvent, ManageEvent, EventAnalytics
│   │   │   ├── admin/       # AdminDashboard, UserManagement, EventModeration
│   │   │   ├── Home.jsx
│   │   │   └── ExploreEvents.jsx
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```
