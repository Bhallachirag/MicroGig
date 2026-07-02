# MicroGig — Micro-Internship Marketplace

A full-stack MERN marketplace that connects clients with freelancers for short, well-scoped gigs — from posting a job and receiving applications, through hiring, a collaborative project workspace, submission and review, all the way to an escrow-style payout.

The goal was to build something closer to how a real freelance platform actually works end-to-end, rather than just a CRUD job board — so a lot of the design centers on the *job lifecycle* (a job moves through explicit states with a full history) and on *not trusting the client* for anything money-related.

## Features

### Job posting & discovery
Clients post gigs with a category, required skills, budget, and duration. Freelancers browse with filtering by category, skill, budget range, and duration, server-side pagination, and sorting by budget or urgency — so the listings page stays fast even as job volume grows.

### Full job lifecycle, not just a status flag
Every job carries a `status` (`OPEN → APPLICATION_RECEIVED → IN_PROGRESS → WORK_SUBMITTED → APPROVED / REVISION_REQUESTED → ...`) and every transition is appended to a `statusHistory` array with who changed it and when. This means a job's entire journey is auditable after the fact, not just its current state — useful for dispute resolution and for showing a timeline in the UI.

### Applications & hiring
Freelancers apply with a bid amount, proposed delivery time, and a pitch. Clients review applicants (each with their rating and skills populated inline) and hire one — which assigns the job, flips it to `IN_PROGRESS`, and rejects nothing else automatically, leaving the client free to still consider other applicants if the hire falls through.

### Collaborative project workspace
Once a freelancer is hired, the job gets its own `workspace` — a running thread of messages and file attachments (via Cloudinary) between the client and the assigned freelancer, seeded with a welcome message on hire. Every workspace post also fires a notification to the other party. This is effectively a lightweight per-job chat, scoped to just the two people working on it.

### Submission, review & revisions
Freelancers submit completed work into the workspace; clients can either approve it (which flips `paymentStatus` to `READY_FOR_RELEASE`) or request revisions with feedback logged straight into the workspace thread — so revision requests aren't a separate side-channel, they're part of the same history.

### Escrow-style payments
A Razorpay order is only ever created once a job is `APPROVED` **and** `READY_FOR_RELEASE` — payment can't be initiated before the client has actually signed off on the work. On the verification side, the server independently recomputes and checks the Razorpay signature using HMAC-SHA256 before marking a job as paid, so a manipulated client-side response can't be used to fake a successful payout.

### Reviews, ratings & guilds
After a job wraps up, both sides can leave a review; a user's average rating is recalculated automatically off their review history. Users can also belong to a **guild** — a lightweight team/group construct — and there's a guild leaderboard endpoint that aggregates total earnings, member count, and average rating per guild, sorted by top earners.

### AI job-post assistant
A Gemini-powered assistant that takes a user's rough, unstructured notes about what they need and turns them into a properly structured job title and description — meant to lower the friction of writing a good job post from scratch.

### Auth, notifications & dashboards
Email/password and Google OAuth login, both issuing the same JWT-based session. In-app notifications cover applications, hires, approvals, revisions, and workspace activity. A role-aware dashboard endpoint returns different aggregates depending on whether the logged-in user is a client (jobs posted, people hired, open openings) or a freelancer (their applications and active work).

## Architecture

Monorepo with a `client` and `server`, run together in development via `concurrently`.

```
server/
├── controllers/     # auth, jobs, payments, reviews, users, notifications
├── routes/            # /api/auth, /api/jobs, /api/payments, /api/reviews, /api/users, /api/notifications
├── models/             # User, Job (with embedded statusHistory + workspace), Review, Notification
└── middleware/          # JWT auth (protect), validation

client/src/
├── pages/            # Home, Jobs, PostJob, Dashboard, Freelancers, Login, Signup, Settings, Notifications
├── components/
│   ├── jobs/            # job cards, AIAssistant (Gemini-powered job drafting)
│   ├── dashboard/        # dashboard widgets
│   ├── modals/            # hire/apply/review modals
│   └── ui/                 # shared UI primitives
├── context/            # auth context
└── hooks/               # data-fetching hooks
```

## API Overview

| Area | Examples |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google`, `GET /api/auth/me` |
| Jobs | `GET /api/jobs`, `POST /api/jobs`, `POST /api/jobs/:id/apply`, `POST /api/jobs/:id/hire`, `POST /api/jobs/:id/submit`, `POST /api/jobs/:id/approve`, `POST /api/jobs/:id/revision`, `POST /api/jobs/:id/workspace/message`, `POST /api/jobs/generate` (AI draft) |
| Payments | `POST /api/payments/order`, `POST /api/payments/verify` |
| Reviews | `GET /api/reviews`, `POST /api/reviews` |
| Users | `GET /api/users`, `GET /api/users/:id`, `GET /api/users/me/dashboard`, `GET /api/users/guilds/stats` |

## Tech Stack

**Client:** React, React Router, Context API
**Server:** Node.js, Express, MongoDB / Mongoose, JWT, bcrypt
**Integrations:** Razorpay (payments + escrow release), Google Gemini API (AI job drafting), Cloudinary (uploads), Google OAuth

## Getting Started

```bash
# install everything (root, client, server)
npm run install-all

# run client + server together
npm run dev
```

### Environment variables (`server/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

## Future Plans

- **Real-time workspace** — the project workspace currently updates on a request/response basis; moving it to Socket.io would make client–freelancer messaging feel instant instead of requiring a refresh or poll.
- **Dispute resolution flow** — right now a disagreement over `REVISION_REQUESTED` vs `APPROVED` has no formal escalation path. Adding an admin-mediated dispute state (with the existing `statusHistory` as evidence) is a natural extension.
- **Admin/moderation panel** — tools to review flagged jobs, suspend abusive accounts, and manually intervene in stuck payments.
- **Refunds & partial payouts** — the payment flow currently only handles a single full release; partial releases (for milestone-based gigs) and refunds for cancelled jobs aren't handled yet.
- **Automated testing & CI** — the project doesn't yet have a test suite; adding Jest/Supertest coverage for the payment verification and job-status transitions specifically would harden the parts of the app that matter most.
- **Search improvements** — job search is currently query-based filtering on MongoDB directly; introducing a dedicated search index (e.g. Atlas Search or Elasticsearch) would allow fuzzier, faster full-text search as the number of listings grows.
- **Guild features** — guilds currently only power a read-only leaderboard; turning them into proper team workspaces (shared job pools, team billing) would make the concept more useful.
- **Mobile-friendly / PWA** — making the client installable and usable offline for checking notifications and workspace updates on the go.

## Contributors

- **Chirag Bhalla**
- **Utkarsh Pratap**
