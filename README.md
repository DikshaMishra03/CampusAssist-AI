# CampusAssist AI

An enterprise-grade, AI-powered Student Support Assistant built for engineering colleges and university campuses. Inspired by the conversational intelligence principles of IBM watsonx Assistant, CampusAssist AI uses **Google Gemini** and a grounded knowledge retrieval architecture to deliver factual, hallucination-free answers to student, parent, and faculty inquiries.

---

## Overview

Navigating university administrative procedures—admissions paperwork, attendance mandates, examination regulations, bonafide certificates, hostel curfews, and placement eligibility—often overwhelms students and creates repetitive workload for campus administrative counters.

**CampusAssist AI** solves this by providing:
- **Instant 24/7 Student Query Resolution**: Fast answers for common student inquiries.
- **Strict Knowledge Grounding**: Answers are synthesized exclusively from verified institutional records. If an answer is not in the knowledge base, the assistant explicitly declines to answer and routes the query to the correct department rather than hallucinating policies.
- **Context-Aware Dialogue**: Remembers conversational history across turns to resolve contextual follow-up questions naturally (e.g., *"What are the college timings?"* followed by *"What about Saturday?"*).
- **Source Attribution & Citations**: Displays specific knowledge articles used to formulate every response so students can verify administrative circulars.
- **Knowledge Base Explorer**: An interactive catalog allowing students and staff to browse and search official campus regulations.
- **Live Analytics & Administrative Telemetry**: Tracks common question categories, session volume, and automatically logs **unanswered queries** to identify knowledge gaps for institutional administrators.

---

## Features

- **Full-Stack Modular Architecture**: React 19 + TypeScript + Vite frontend communicating with a hardened Node.js + Express backend.
- **Server-Side LLM Security**: Zero client-side API key exposure; all Google Gemini calls execute strictly on the backend.
- **Keyword & Ranked Relevance Retrieval Engine**: Custom multi-factor retrieval scoring (phrase match, tags, titles, category, content tokens) designed for zero-latency lookups without heavy database dependencies.
- **Dynamic Multi-turn Context Memory**: Tracks user conversation history to resolve pronouns, temporal constraints, and follow-ups.
- **Interactive Knowledge Base Browser**: Real-time category filtering, full-text search, and "Ask AI about this" direct action triggers.
- **Comprehensive Campus Coverage**: Covers Admissions, Academics, Departmental Laboratories, Student Services (Bonafide certificates, ID card replacement, Bus routes, Hostels), Placements & Internships, and Campus Amenities.
- **Admin Analytics Dashboard**: Live metrics on message volume, query category breakdown, and an actionable log of unanswered questions.
- **Production UI/UX**: Dark/Light mode theme persistence, auto-resizing chat input, keyboard shortcuts (Enter to send, Shift+Enter for new line), response copy, regeneration, and mobile drawer support.

---

## Architecture

CampusAssist AI uses a decoupled client-server architecture with an integrated retrieval layer:

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (React)                        │
│  - ChatPage (Multi-turn conversations & Suggested Prompts)  │
│  - KnowledgeBasePage (Live directory & search)              │
│  - AnalyticsPage (Telemetry & Knowledge gap monitoring)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON API
┌──────────────────────────────▼──────────────────────────────┐
│                    Express Backend Server                   │
│                                                             │
│  ┌────────────────────┐            ┌─────────────────────┐  │
│  │   Chat & Session   │            │ Knowledge Retrieval │  │
│  │      Service       │            │       Service       │  │
│  └─────────┬──────────┘            └──────────┬──────────┘  │
│            │                                  │             │
│            ▼                                  ▼             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Gemini Service                     │  │
│  │ - Grounds responses in retrieved knowledge articles   │  │
│  │ - Enforces anti-hallucination system prompt           │  │
│  │ - Calls Google GenAI SDK (gemini-3.1-flash-lite /     │  │
│  │   gemini-flash-latest / gemini-3.8-flash)             │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          Local Structured Knowledge Base (JSON)       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite | Fast, responsive Single Page Application |
| **Styling** | Tailwind CSS v4 | Custom university palette, dark mode support |
| **Icons** | Lucide React | Clean, domain-native iconography |
| **Backend** | Node.js, Express, TypeScript | Modular REST API endpoints and Vite middleware |
| **AI / LLM** | Google Gemini (`@google/genai`) | Low-latency inference with strict system instructions |
| **Knowledge Engine** | Tokenized Ranking & Scoring | In-memory inverted scoring engine, swappable for Vector DB |
| **Runtime** | `tsx` / Node.js ES Modules | Seamless TypeScript execution on server-side |

---

## Project Structure

```
.
├── server/
│   └── src/
│       ├── data/
│       │   └── knowledgeBase.json         # Structured institutional knowledge base
│       ├── routes/
│       │   ├── analyticsRoutes.ts         # GET /api/analytics
│       │   ├── chatRoutes.ts              # POST /api/chat, GET/POST/DELETE /api/conversations
│       │   └── knowledgeRoutes.ts         # GET /api/knowledge
│       ├── services/
│       │   ├── conversationService.ts     # Conversation memory & unanswered query telemetry
│       │   ├── geminiService.ts           # Server-side Gemini API client with grounding prompt
│       │   └── knowledgeRetrievalService.ts # Multi-factor relevance scoring engine
│       └── types/
│           └── index.ts                   # Shared backend type definitions
├── src/
│   ├── components/
│   │   ├── ChatInput.tsx                  # Auto-growing textarea, char counter, shortcuts
│   │   ├── ChatMessage.tsx                # Bubble renderer, markdown formatting, copy/regenerate
│   │   ├── Header.tsx                     # Top navigation, status indicator, theme toggle
│   │   ├── KnowledgeModal.tsx             # Document view modal with official reference & tags
│   │   ├── Sidebar.tsx                    # Conversation history, search filter, delete session
│   │   └── SuggestedQuestions.tsx         # Pre-configured prompt cards
│   ├── pages/
│   │   ├── AnalyticsPage.tsx              # Operations dashboard and knowledge gaps table
│   │   ├── ChatPage.tsx                   # Main interactive chat experience
│   │   └── KnowledgeBasePage.tsx          # Searchable, filterable knowledge directory
│   ├── services/
│   │   └── api.ts                         # Client-side API service consuming backend routes
│   ├── types/
│   │   └── index.ts                       # Client TypeScript interfaces
│   ├── App.tsx                            # Root application container & theme provider
│   ├── index.css                          # Tailwind CSS imports & custom typography
│   └── main.tsx                           # React DOM mount point
├── .env.example                           # Template environment configuration
├── index.html                             # Application entry point with metadata
├── metadata.json                          # Applet capabilities and configuration
├── package.json                           # Dependencies and build scripts
├── server.ts                              # Express server with Vite middleware integration
└── tsconfig.json                          # TypeScript configuration
```

---

## How It Works

1. **User Submits Query**: The student types a question in the chat interface or clicks a suggested prompt.
2. **Conversation Context Matching**: The backend takes the current question along with recent conversation history turns to handle pronoun references and follow-up qualifiers (e.g., *"What about Saturday?"*).
3. **Retrieval Layer**: `knowledgeRetrievalService` tokenizes the query, filters common English stopwords, and scores each knowledge article against titles, tags, summaries, and full text.
4. **Context Injection**: Top-matching knowledge entries are formatted into a structured prompt block and injected into the Google Gemini system prompt.
5. **Grounded Generation**: Gemini evaluates the question strictly against the provided context. If the query cannot be answered from the articles, the model outputs the standardized unanswerable notice.
6. **Telemetry & Response**: The server logs category hits and flags unanswered queries in the analytics service before returning the response, source titles, and message ID to the frontend.

---

## Knowledge Retrieval

The retrieval engine (`server/src/services/knowledgeRetrievalService.ts`) implements multi-factor scoring:
- **Exact Phrase Matching**: +25 points for verbatim substring matches in title or content.
- **Tag / Keyword Matches**: +15 points for exact tag hits, +8 points for partial tag overlap.
- **Title Matches**: +12 points per matching query token.
- **Category Matches**: +6 points per category match.
- **Summary & Content Term Frequency**: Scored with term boundaries to avoid false substrings.
- **Context Continuity**: Short queries (< 5 tokens) inherit score boosts from previous conversation turns.
- **Relevance Gating**: Queries with score < 8 are considered unanswerable by the knowledge base, preventing irrelevant hallucinated retrievals.

---

## Gemini Integration

Gemini API calls are executed strictly on the backend using the modern `@google/genai` TypeScript SDK.

Key integration characteristics:
- **Server-Side Only**: Uses `process.env.GEMINI_API_KEY`. The browser never has access to the key.
- **Zero-Temperature Accuracy**: Low temperature (`0.2`) ensures deterministic, fact-grounded outputs.
- **Automatic Fallback Chain**: Queries `gemini-3.1-flash-lite`, `gemini-flash-latest`, and `gemini-3.8-flash` with graceful failover.
- **Deterministic Knowledge Fallback**: If network or API quota errors occur, the backend cleanly synthesizes a response directly from the retrieved articles, ensuring 100% uptime for campus demonstrations.

---

## API Endpoints

### Chat & Conversations
- `POST /api/chat`: Send a message.
  - Request: `{ "conversationId"?: string, "message": string }`
  - Response: `{ "reply": string, "sources": string[], "conversationId": string, "messageId": string, "isUnanswered": boolean }`
- `GET /api/conversations`: Returns a list of all active conversation sessions.
- `POST /api/conversations`: Creates a new conversation thread.
- `GET /api/conversations/:id`: Fetches the full message history of a specific conversation.
- `DELETE /api/conversations/:id`: Deletes a conversation session.

### Knowledge Base
- `GET /api/knowledge`: Returns filtered knowledge base articles.
  - Query parameters: `?category=Admissions&search=timing`
- `GET /api/knowledge/:id`: Retrieves a single article by ID.

### Analytics & System
- `GET /api/analytics`: Returns aggregate metrics, category query counts, and the unanswered query log.
- `GET /api/health`: Returns server status and LLM connectivity confirmation.

---

## Environment Variables

Copy the example file to `.env`:

```bash
cp .env.example .env
```

Define the following variable in `.env`:

```env
# GEMINI_API_KEY: Your Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# PORT: (Optional) Server port, defaults to 3000
PORT=3000
```

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/campusassist-ai.git
   cd campusassist-ai
   ```

2. Install all required dependencies:
   ```bash
   npm install
   ```

---

## Running Locally

1. Start the unified development server (Express backend + Vite frontend):
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. (Optional) Run TypeScript linting:
   ```bash
   npm run lint
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## Example Questions to Test

Try these questions in the chat to test various aspects of the system:

### 1. General FAQs & Student Services
- *"How do I apply for a bonafide certificate?"*
- *"What should I do if I lose my student ID card?"*
- *"What are the hostel rules and curfew timings?"*
- *"Does the college provide bus transport?"*

### 2. Admissions & Eligibility
- *"What documents are required during physical verification for admission?"*
- *"What is the eligibility criteria for regular 4-year B.Tech?"*
- *"Is lateral entry available for diploma holders?"*

### 3. Academics & Context Follow-Ups
- **Turn 1**: *"What are the college timings?"*
  - Expected: College operates Monday to Friday from 9:00 AM to 5:00 PM; Saturdays from 9:30 AM to 1:00 PM for club activities and labs.
- **Turn 2**: *"Does that apply on Saturday?"*
  - Expected: Assistant understands "that" refers to college timings and specifies Saturday policies.
- *"What is the minimum attendance requirement to write semester exams?"*

### 4. Placements & Career
- *"How can I contact the training and placement cell?"*
- *"What is the minimum CGPA requirement for campus placements?"*
- *"Are summer internships mandatory?"*

### 5. Out-of-Scope / Anti-Hallucination Testing
- *"Can I bring my pet iguana into the chemistry lab?"*
  - Expected: Assistant cleanly states: *"I don't have that information in my current knowledge base. Please contact the appropriate college department."* and automatically records the query in the Analytics Dashboard under **Unanswered Queries**.

---

## Screenshots & Visual Walkthrough

- **Chat Interface**: Clean conversation stream with avatar indicators, citation tags, copy button, and auto-expanding input box.
- **Suggested Prompts**: 8 pre-configured question pills categorized across Admissions, Academics, Services, and Placements.
- **Knowledge Base Directory**: Grid of 28 verified articles with live category filtering, search, and official reference codes.
- **Analytics & Admin Console**: Real-time telemetry displaying total sessions, category demand bars, LLM health metrics, and knowledge gap logs.

---

## Future Improvements

To scale CampusAssist AI for university-wide production deployment across multiple campuses, the following upgrades are planned:

- **Vector Database (ChromaDB / Pinecone / pgvector)**: Transition from keyword relevance matching to dense vector embeddings for semantic similarity search.
- **Hierarchical RAG (Retrieval-Augmented Generation)**: Chunking long syllabus documents, academic ordinances, and PDFs with hybrid dense/sparse search (BM25 + cosine similarity).
- **PostgreSQL Database Storage**: Replace local in-memory session tracking with PostgreSQL via Prisma or Drizzle ORM.
- **Student Authentication & RBAC**: Integration with campus single sign-on (OAuth2 / SAML / Firebase Auth) with role-based access for students, faculty, and administrative staff.
- **Administrative CMS & Document Ingestion**: Web interface for campus departments to upload new circulars and PDF notices with automatic re-indexing.
- **Multilingual Support**: Real-time localization in regional languages to support diverse student demographics.
- **Ticketing Escalation**: Automatic creation of helpdesk tickets for unanswered queries routed directly to department coordinators.
