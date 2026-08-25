# SamadhanHub 🇮🇳

**Real Problems. Collective Intelligence. Measurable Solutions.**

A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.

## 🌟 Key Features

- **Challenge Discovery** — Browse and filter societal challenges across India
- **AI-Powered Analysis** — Automatic classification, impact scoring, and collaboration matching
- **Interactive Map** — Geographic visualization of challenges using Leaflet/OpenStreetMap
- **Multi-Step Submission** — Guided challenge submission with evidence and expertise tagging
- **Collaboration Matching** — AI-powered matching of challenges with universities and industry
- **Dedicated Portals** — Specialized dashboards for Universities, Industries, and Government
- **Collaboration Workspace** — Real-time team collaboration with tasks, milestones, and discussions
- **Solution Evaluation** — Weighted expert scoring system (Impact, Feasibility, Scalability, Innovation, Cost)
- **Implementation Pipeline** — Visual tracking from submission to implementation to impact measurement
- **Impact Dashboard** — Before/after metrics with charts and real-world outcome tracking

## 🏗️ Tech Stack

### Frontend
- Next.js 14 + TypeScript
- Tailwind CSS + shadcn/ui components
- Leaflet + OpenStreetMap (maps)
- Recharts (charts)
- Socket.IO Client (real-time)
- Lucide React (icons)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication + RBAC
- Socket.IO (real-time)
- Express Validator (input validation)
- Rate limiting

### AI Service
- Abstraction layer ready for LLM/API integration
- Mock/demo implementation for demonstration purposes
- Challenge classification, impact scoring, and collaboration matching

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install Backend

```bash
cd backend
npm install
```

### 2. Install Frontend

```bash
cd frontend
npm install
```

### 3. Environment Variables

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/samadhanhub
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

**Frontend** (optional, `frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Setup MongoDB

Make sure MongoDB is running:
```bash
# Local
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Seed Demo Data

```bash
cd backend
npm run seed
```

### 6. Start Development Servers

**Backend** (terminal 1):
```bash
cd backend
npm run dev
```

**Frontend** (terminal 2):
```bash
cd frontend
npm run dev
```

### 7. Open the Application

Visit [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@samadhanhub.gov.in | admin123 |
| Government | government@samadhanhub.gov.in | government123 |
| University | university@samadhanhub.gov.in | university123 |
| Industry | industry@samadhanhub.gov.in | industry123 |
| Citizen | citizen@samadhanhub.gov.in | citizen123 |

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Challenges
- `GET /api/challenges` — List challenges (with filters)
- `POST /api/challenges` — Create challenge
- `GET /api/challenges/:id` — Get challenge detail
- `PATCH /api/challenges/:id` — Update challenge
- `DELETE /api/challenges/:id` — Delete challenge

### Solutions
- `GET /api/solutions` — List solutions
- `POST /api/solutions` — Create solution
- `GET /api/solutions/:id` — Get solution detail
- `PATCH /api/solutions/:id` — Update solution

### Organizations
- `GET /api/organizations` — List organizations
- `GET /api/organizations/:id` — Get organization detail

### Collaborations
- `GET /api/collaborations` — List collaborations
- `POST /api/collaborations` — Create collaboration
- `PATCH /api/collaborations/:id` — Update collaboration

### Evaluations
- `POST /api/evaluations` — Submit evaluation
- `GET /api/evaluations/solution/:solutionId` — Get evaluations for solution

### Analytics
- `GET /api/analytics/overview` — Platform overview stats
- `GET /api/analytics/dashboard` — Role-based dashboard data

### AI
- `POST /api/ai/analyze-challenge` — AI analysis of a challenge
- `POST /api/ai/match-collaborators` — AI collaboration matching

## 🎯 Demonstration Flow (5-10 minutes)

1. **Citizen submits** a societal challenge via the multi-step form
2. **AI analyzes** the challenge — classification, impact score, required expertise
3. **Government verifies** the challenge from the Government Dashboard
4. **Platform recommends** university and industry partners (Collaboration Match)
5. **University team** accepts and forms a team
6. **Industry expert** joins as mentor
7. **Team creates** a solution in the Collaboration Workspace
8. **Experts evaluate** using the weighted scorecard
9. **Government approves** a pilot implementation
10. **Dashboard tracks** implementation progress and social impact

## 📁 Project Structure

```
samadhanhub/
├── backend/
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── middleware/     # Auth, validation
│   │   ├── models/        # MongoDB models (12 models)
│   │   ├── routes/        # API routes
│   │   ├── services/      # AI service abstraction
│   │   ├── seeds/         # Demo data seeder
│   │   └── server.ts      # Main server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js pages (17 pages)
│   │   │   ├── challenges/    # Discovery, detail, map, submit
│   │   │   ├── solutions/     # List, detail, submit
│   │   │   ├── university/    # University portal
│   │   │   ├── industry/      # Industry portal
│   │   │   ├── government/    # Government dashboard
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── collaborate/   # Collaboration match
│   │   │   ├── workspace/     # Team workspace
│   │   │   ├── impact/        # Impact dashboard
│   │   │   ├── search/        # Global search
│   │   │   └── auth/          # Login/register
│   │   ├── components/    # UI components (shadcn/ui)
│   │   ├── contexts/      # Auth & Theme providers
│   │   └── lib/           # Utilities, API client
│   └── package.json
└── README.md
```

## ⚠️ Important Notes

- **Demo Data** — All data shown is for demonstration purposes. Do not falsely represent any organization as an official partner.
- **AI Service** — The AI analysis uses a mock implementation. In production, connect it to an actual LLM/API.
- **Security** — JWT authentication, bcrypt password hashing, rate limiting, and RBAC are implemented.

## 📄 License

Open source for educational purposes.
