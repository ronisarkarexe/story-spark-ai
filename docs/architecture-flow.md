# 🏗️ StorySpark AI Architecture Guide

A simple overview of how **StorySpark AI** works behind the scenes.

---

# 🌟 System Overview

StorySpark AI follows a modern full-stack architecture that combines:

* ⚛️ React + TypeScript Frontend
* 🟢 Express + Node.js Backend
* 🍃 MongoDB Database
* 🤖 OpenAI & Gemini AI Models
* 🔌 Socket.IO Real-Time Communication

Together, these components allow users to generate, analyze, collaborate on, and manage AI-powered stories.

---

# 🔄 Complete Application Flow

```text
👤 User
   │
   ▼
⚛️ React Frontend
   │
   ▼
🗂️ Redux State Management
   │
   ▼
🌐 API Service Layer
   │
   ▼
🟢 Express Backend
   │
   ├──────────────► 🔐 Authentication Module
   │
   ├──────────────► 📚 Story Management Module
   │
   ├──────────────► 🤖 Recommendation Engine
   │
   ├──────────────► 📊 Analytics Module
   │
   ├──────────────► 🔔 Notification Module
   │
   └──────────────► 🤝 Collaboration Module
   │
   ▼
🤖 OpenAI / Gemini
   │
   ▼
🍃 MongoDB
   │
   ▼
📱 Response Sent Back To User
```

---

# ✍️ Story Generation Flow

This is the core workflow of StorySpark AI.

```text
📝 User Prompt
      │
      ▼
⚛️ Story Workspace
      │
      ▼
📡 API Request
      │
      ▼
🟢 Backend Processing
      │
      ▼
🤖 OpenAI / Gemini
      │
      ▼
📖 Story Generation
      │
      ▼
🌳 Story Branching Engine
      │
      ▼
💾 MongoDB Storage
      │
      ▼
📱 Story Displayed To User
```

---

# 🌳 Story Branching Flow

StorySpark AI supports multiple story paths from a single prompt.

```text
📖 Original Story
      │
      ├── Choice A
      │      │
      │      ▼
      │   Alternate Path 1
      │
      ├── Choice B
      │      │
      │      ▼
      │   Alternate Path 2
      │
      └── Choice C
             │
             ▼
         Alternate Path 3
```

This allows users to explore different outcomes and story directions.

---

# 🤝 Real-Time Collaboration Flow

Users can collaborate using Socket.IO-powered rooms.

```text
👤 User A
     │
     ▼
🔌 Socket.IO Client
     │
     ▼
🟢 Socket Server
     │
     ▼
🤝 Collaboration Module
     │
     ▼
🍃 MongoDB
     │
     ▼
📡 Broadcast Updates
     │
     ▼
👤 User B
```

---

# 🧩 Backend Modules

The backend is organized into feature-based modules.

| Module            | Purpose                               |
| ----------------- | ------------------------------------- |
| 🔐 Auth           | User authentication and authorization |
| 📚 Story          | Story creation and management         |
| 🤖 Recommendation | AI-powered content suggestions        |
| 📊 Analytics      | User and story insights               |
| 🔔 Notification   | Real-time notifications               |
| 👍 Reaction       | Likes and reactions                   |
| 📝 Review         | User feedback and reviews             |
| 🚨 Report         | Content reporting system              |
| 🤝 Collab         | Collaborative storytelling            |
| 🎮 Gamification   | User engagement features              |
| 📧 Verify Email   | Email verification workflow           |

---

# 🎨 Frontend Components

The frontend contains specialized components for different features.

| Component               | Purpose                    |
| ----------------------- | -------------------------- |
| ✍️ Writing Assistant    | AI writing support         |
| 📖 Story Viewer         | Read generated stories     |
| 🌳 Story Workspace      | Interactive story creation |
| 🕒 Story Timeline       | Story progression tracking |
| 📚 Version History      | Story version management   |
| 🤝 Collaboration Room   | Real-time collaboration    |
| 📊 Dashboard            | Analytics and insights     |
| 🔔 Notification Center  | User notifications         |
| 🔐 Authentication Pages | Login and registration     |

---

# 🚀 Technology Stack

```text
Frontend
├── React
├── TypeScript
├── Redux Toolkit
├── Vite
└── Tailwind CSS

Backend
├── Node.js
├── Express.js
├── Socket.IO
├── JWT
└── Zod

Database
└── MongoDB

AI Services
├── OpenAI
└── Gemini

Deployment
└── Vercel
```

---

# 💡 Why This Architecture?

✅ Modular and scalable

✅ Easy for contributors to understand

✅ Supports AI-powered story generation

✅ Enables real-time collaboration

✅ Maintains clean separation of concerns

✅ Simplifies future feature additions

---

Made with ❤️ for StorySpark AI contributors.
