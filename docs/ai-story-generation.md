 # 🤖 AI Story Generation Pipeline (Beginner Guide)

 This document explains, in simple terms, how a user prompt becomes an AI-generated story in StorySpark AI. It's written for new contributors and beginners.

 ---

 ## Overview

 - **Goal:** Describe the end-to-end flow used when a user creates a story from a prompt.
 - **Audience:** Developers new to the codebase, technical writers, or contributors interested in the AI pipeline.
 - **Scope:** Frontend prompt, request flow, backend handling, AI interaction, database storage, and retrieval/display.

 ---

 ## Architecture Flow

 Below is a simple diagram showing the main pieces and how they connect.

 ```mermaid
 flowchart LR
   U["👤 User"] --> F["⚛️ Frontend (React + Vite)"]
   F -->|"HTTP POST /api/v1/ai/generate"| API["🌐 API Layer (frontend client)"]
   API -->|"HTTP"| B["🟢 Backend (Express API)"]
   B -->|"AI request"| AI["🤖 AI Service (OpenAI / Gemini)"]
   AI -->|"story text"| B
   B -->|"persist story"| DB["🍃 Database (MongoDB)"]
   DB -->|"stored story"| B
   B -->|"response"| F
   F -->|"render"| U
 
   classDef fe fill:#0ea5e9,color:#fff
   classDef be fill:#059669,color:#fff
   classDef ai fill:#d97706,color:#fff
   classDef db fill:#7c3aed,color:#fff
   class F fe
   class B be
   class AI ai
   class DB db
 ```

 ---

 ## Request Lifecycle

 1. **User enters a prompt** in the story generator UI and clicks “Generate”.
 2. **Frontend** prepares a JSON payload with the prompt and optional settings (tone, length, branching options).
 3. Frontend sends an **HTTP POST** to the backend API endpoint (example: `/api/v1/ai/generate`).
 4. The **Backend** validates the request, applies rate limits, authenticates the user (if required), and enqueues or directly calls the AI service.
 5. The **AI Service** (OpenAI, Gemini, or configured provider) returns generated text and optional metadata (tokens used, generation status).
 6. Backend post-processes the result (sanitization, scoring, branching) and writes one or more story documents to the database.
 7. Backend responds to the frontend with the new story ID(s) and generated content (or a reference to fetch it).
 8. Frontend displays the story and stores it in local state; users can save/bookmark or request variations.

 ---

 ## Component Responsibilities

 - **Frontend (`frontend/`)**:
   - Collects prompt input and UI options from the user.
   - Sends requests to the backend API and shows progress (loading, status).
   - Renders final story text, variations, and UI controls for branching or saving.
   - Manages client-side state (Redux or local state) for drafts and temporary results.

 - **Backend (`backend/`)**:
   - Exposes REST endpoints for story generation and story management.
   - Validates and authenticates incoming requests (JWT middleware if logged-in flows are used).
   - Orchestrates calls to the AI provider and applies business rules (rate limiting, quotas, analytics).
   - Persists generated stories and metadata to MongoDB.
   - Optionally emits real-time events (Socket.IO) for long-running generation jobs.

 - **AI Generation Service**:
   - Receives a prompt and parameters; returns generated text.
   - Is accessed via provider SDKs or HTTP APIs; API keys are stored in env vars.
   - Is treated as an external service — responses must be validated and sanitized.

 - **Database (MongoDB)**:
   - Stores story documents that include the original prompt, generated variations, author (if any), timestamps, and status.

 ---

 ## API Communication

 - Typical flow: `Frontend` → `POST /api/v1/ai/generate` → `Backend` → `AI Provider` → `Backend` → `Frontend`.
 - Use JSON request/response bodies. Example request body:

 ```json
 {
   "prompt": "A young dragon discovers a lost city",
   "options": { "length": "short", "tone": "whimsical" }
 }
 ```

 - Example response (success):

 ```json
 {
   "storyId": "64a1e...",
   "status": "completed",
   "content": "Once upon a time...",
   "variations": ["...", "..."]
 }
 ```

 ---

 ## Authentication Flow (if available)

 - If the user is logged in, the frontend attaches an **Access Token** (JWT) in the `Authorization: Bearer <token>` header.
 - The backend verifies the token with JWT middleware and makes generation requests tied to the user's account (so the generated story is stored with an `authorId`).
 - If anonymous generation is allowed, the backend may still record a session ID or save the story as `anonymous` depending on configuration.
 - Rate limiting and quotas are applied per-user or per-api-key to avoid abuse.

 ---

 ## Story Lifecycle: Creation → Display

 1. **Drafting:** User composes a prompt and requests generation.
 2. **Generation:** Backend calls the AI and receives generated content.
 3. **Sanitization & Scoring:** Backend applies content filters and optional scoring (toxicity checks, content length checks).
 4. **Persistence:** Backend stores the story document in MongoDB with metadata.
 5. **Display:** Frontend receives the stored content or ID and renders the story to the user.
 6. **User Actions:** Save/bookmark, request variations, edit, or publish the story.

 ---

 ## Data Storage

 - Story documents typically contain:
   - `prompt`: original user input
   - `authorId`: optional user reference
   - `content`: generated text or list of variations
   - `status`: `pending`, `completed`, `failed`
   - `createdAt` / `updatedAt`
   - `metadata`: token usage, provider, generation options

 - The AI provider keys and sensitive config live in `.env` files (see `backend/.env.example`). Do not commit secrets.

 ---

 ## Developer Notes

 - This doc is documentation-only; do not change application logic here.
 - When adding new AI-related endpoints, follow existing patterns in `backend/src/controllers/ai*` and `backend/src/routes/`.
 - Keep the AI integration behind a service layer so it's easy to swap providers or add caching/queueing later.
 - For long-running jobs, consider: write a `pending` story record first, then update it when the AI job completes; emit socket events for progress.

 ---

 Made with ❤️ for contributors learning the StorySpark AI pipeline.
