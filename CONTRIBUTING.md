# Contributing to StorySparkAI

Thank you for your interest in contributing to StorySparkAI! This guide will help you set up your local development environment quickly.

---

## About StorySparkAI

StorySparkAI is a full-stack AI-powered storytelling platform that helps users generate creative stories using artificial intelligence. This guide will help contributors set up the project, understand the workflow, and submit high-quality contributions.

---

## Prerequisites

Make sure you have the following installed before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18 or higher | https://nodejs.org |
| npm | v9 or higher (comes with Node.js) | — |
| Git | Latest | https://git-scm.com |

Verify your versions:

```bash
node -v
npm -v
git --version
```

---

## 1. Fork and Clone the Repository

1. Click the **Fork** button on the top right of the repo page.
2. Clone your fork locally:

```bash
git clone https://github.com/<your-username>/story-spark-ai.git
cd story-spark-ai
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/ronisarkarexe/story-spark-ai.git
```

---

## 2. Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd ../backend
npm install
```

---

## 3. Environment Variable Setup

### Frontend

```bash
cd frontend
cp .env.example .env
```

Open `frontend/.env` and fill in the values:

```env
VITE_API_URL=http://localhost:5000
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

> ⚠️ **Security Note:**
> Never expose private API keys in production frontend applications.
> The values shown here are intended for local development only.

### Backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in the values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key_here
```

> **Note:** You can get a free OpenAI API key at https://platform.openai.com/api-keys

---

## 4. Run the Project Locally

Open two terminals:

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 5. Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

---

## 6. Development Workflow

```bash
# Always create a new branch for your changes
git checkout main
git pull upstream main
git checkout -b feat/your-feature-name

# After making changes, stage and commit
git add .
git commit -m "feat: description of your change"

# Push and open a PR
git push origin feat/your-feature-name
```

---

## 7. Common Troubleshooting

### `npm install` fails
- Make sure you are using Node.js v18+: `node -v`
- Delete `node_modules` and try again: `rm -rf node_modules && npm install`

### Port already in use
- Kill the process on the port: `npx kill-port 5173` or `npx kill-port 5000`

### Environment variables not loading
- Make sure you copied `.env.example` to `.env` (not `.env.example` itself)
- Restart the dev server after editing `.env`

### API calls failing
- Check that the backend is running on port 5000
- Verify `VITE_API_URL` in `frontend/.env` matches the backend port

### MongoDB connection error
- Check your `MONGO_URI` in `backend/.env`
- You can use a free MongoDB Atlas cluster at https://www.mongodb.com/atlas

---

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## Frequently Asked Questions
## Need Help?


If you get stuck, open a [Discussion](https://github.com/ronisarkarexe/story-spark-ai/discussions) or comment on the relevant issue. We're happy to help!
## **Frequently Asked Questions**

1. **Do I need to get assigned before working on an issue?**
   - Yes. Please wait until a maintainer assigns the issue to you before starting work. Contributions made without assignment may not be accepted if another contributor is already working on the same issue.
2. **My Pull Request has merge conflicts. What should I do?**
   - Update your branch with the latest changes from the upstream repository, resolve the conflicts locally, and push the updated branch.
3. **Can I directly push changes to the main branch?**
   - No. Always create a separate branch for your work and open a Pull Request from that branch.
4. **How long does it take for a Pull Request to be reviewed?**
   - Review times vary depending on maintainer availability and project activity. Please be patient and avoid repeatedly asking for reviews.

---

## Need Help?

If you get stuck, open a [Discussion](https://github.com/ronisarkarexe/story-spark-ai/discussions) or comment on the relevant issue. We're happy to help!

---

## 💗 Thank You for Contributing

We appreciate your time and effort in helping improve StorySparkAI. Every contribution helps make the project better.
