# Local Development Setup (Monorepo)

This guide documents how to set up and run **Story Spark AI** locally for development and contribution.

---

## **1) Prerequisites and required software**

### **Required**
- **Node.js**: **20.x** (repository `engines.node`)
- **Package manager**: **pnpm 9.15.9** (repository `packageManager`)
- **MongoDB**: running locally (or provide a MongoDB Atlas connection string)

### **Recommended**
- A Node version manager:
  - **nvm** (macOS/Linux)
  - **Volta** (cross-platform)

### **Python (optional)**
The repository includes an ML helper folder under `backend/ml/`. If you want to run those scripts/tests, install Python 3.10+.

---

## **2) Repository cloning instructions**

```bash
# Replace <REPO_URL> with the repository origin
git clone <REPO_URL>
cd story-spark-ai
```

---

## **3) Dependency installation steps**

This is a **pnpm workspace** repo. Install once at the root:

```bash
pnpm install
```

### If you prefer npm (fallback)
The root `package.json` defines workspace scripts, but the repo is primarily configured for **pnpm**.

```bash
npm install
```

> Note: Some setups may rely on the pnpm lockfile. If you hit issues, prefer `pnpm install`.

---

## **4) Environment variable setup (with examples)**

This repo uses `.env.example` files to generate real `.env` files.

### **Copy the example files**

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### **Backend environment variables**
Create `backend/.env` and set at least the following (names are taken from the repo docs and configuration):

**Common required values for local development:**
- `DATABASE_URL` (MongoDB connection string)
- `SALT_ROUNDS`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `DEFAULT_ADMIN_PASSWORD` (used during admin seeding)

**Optional (only if you use corresponding features):**
- `OPEN_AI_KEY` (OpenAI-powered features)
- `GEMINI_API_KEY` (Gemini-powered features)
- `UNSPLASH_KEY_API` / `UNSPLASH_KEY_API_SECRET` (Unsplash image features)
- `VERIFY_EMAIL` / `VERIFY_PASSWORD` (email verification/notifications)
- `GOOGLE_CLIENT_ID` (Google login)

**Example `backend/.env`:**

```env
DATABASE_URL=mongodb://localhost:27017/storysparkai
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:4001
SALT_ROUNDS=10
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=60d
JWT_REFRESH_EXPIRES_IN=120d
DEFAULT_ADMIN_PASSWORD=admin123

# Optional keys
OPEN_AI_KEY=
GEMINI_API_KEY=
GOOGLE_CLIENT_ID=
```

### **Frontend environment variables**
Create `frontend/.env`.

**Required:**
- `VITE_BASE_URL` (backend API base URL)
- `VITE_GOOGLE_CLIENT_ID`

**Optional:**
- `VITE_SOCKET_URL` (Socket.IO server URL, if you are testing real-time features)

**Example `frontend/.env`:**

```env
VITE_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

> Important: Don’t commit `.env` files.

---

## **5) Commands to run the project locally (client and server)**

### **Run both (client + server)**

```bash
pnpm dev
```

This starts:
- `backend` (Express API)
- `frontend` (Vite dev server)

### **Run backend only**

```bash
pnpm dev:backend
```

### **Run frontend only**

```bash
pnpm dev:frontend
```

---

## **6) Build and test instructions**

### **Build**

```bash
pnpm build
```

### **Run backend tests**

```bash
pnpm -C backend test
```

### **Run frontend tests**

```bash
pnpm -C frontend test
```

---

## **7) Common troubleshooting**

### **A) Node version mismatches**
**Symptom:** scripts fail with errors related to Node compatibility.

**Fix:**
- Switch to Node **20.x**:

```bash
node -v
```

Then reinstall dependencies if needed:

```bash
pnpm install
```

### **B) Port conflicts (frontend/backend)**
The project commonly uses:
- **Frontend**: `http://localhost:4001`
- **Backend API**: `http://localhost:5000` (default)

**Fix (identify processes using the ports):**

```bash
lsof -i :4001
lsof -i :5000
```

Stop the conflicting process and restart.

If needed, adjust:
- `backend/.env` → `PORT`
- frontend dev behavior → consult `frontend/vite.config.ts` (only if you changed ports)

### **C) MongoDB connection errors**
**Symptom:** backend fails to connect or cannot load data.

**Fix:**
- Ensure MongoDB is running.
- Verify `backend/.env`:
  - `DATABASE_URL` points to your running MongoDB instance

### **D) Missing environment variables**
**Symptom:** backend/frontend fails to start or key features break.

**Fix:**
- Re-copy and fill values from the `.env.example` files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### **E) Admin seeding issues (first-time setup)**
Some local setups require an admin user.

**Fix:**
1. Ensure `DEFAULT_ADMIN_PASSWORD` is set in `backend/.env`
2. Run the seed script:

```bash
cd backend
npx ts-node scripts/seed-admin.ts
```

### **F) Socket / real-time notification issues**
**Symptom:** browser console shows Socket.IO connection/404 errors.

**Fix:**
- Verify `frontend/.env`:
  - `VITE_SOCKET_URL` points to the active socket service URL
- Ensure the backend/socket server is running (via `pnpm dev` or `pnpm dev:backend`).

---

## **Notes**
- Prefer running the repo exactly as documented in `README.md` / `DEVELOPMENT.md` if anything drifts.
- Keep `.env` files out of version control.

