# AlgoBuddy

**Visualize & Learn Data Structures and Algorithms the Smart Way.**

AlgoBuddy is an open-source, interactive DSA learning platform that brings algorithms to life through step-by-step animations, structured learning paths, and progress tracking — built for students, developers, and interview candidates.


---
**Join our community**
**Discord Server : https://discord.gg/Gv2N4U3KAc**

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

**Algorithm Visualizer**
- Sorting: Bubble Sort, Insertion Sort, Selection Sort, Merge Sort, Quick Sort
- Searching: Linear Search, Binary Search
- Stack: Push/Pop, Peek, isEmpty, isFull, Polish Notation (Prefix/Postfix), Array and Linked List implementations
- Queue: Enqueue/Dequeue, Peek Front, isEmpty, isFull, Single-ended, Double-ended, Circular, Priority Queue, Array and Linked List implementations
- Linked List: Singly, Doubly, Circular — with Insertion, Deletion, Traversal, Merge, Reverse, and Comparison
- Trees: Binary Tree types, In-order Traversal

**User System**
- Email/password auth with Cloudflare Turnstile captcha verification
- Google OAuth sign-in
- User dashboard with module progress tracking
- Activity heatmap (last 90 days) and streak counter

**Blog**
- Category filtering and full-text search
- Articles on DSA concepts with reading time estimates

**UX**
- Dark / Light mode toggle persisted to localStorage
- Responsive design across mobile, tablet, and desktop
- Animated visualizations via GSAP and Framer Motion
- Complexity graphs rendered with Recharts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database / Auth | Supabase |
| Animation | GSAP, Framer Motion |
| Charts | Recharts |
| Email | Nodemailer (Gmail) |
| Captcha | Cloudflare Turnstile |
| Analytics | Google Analytics 4 |
| Deployment | Vercel |
| CI | GitHub Actions (Node 20, Ubuntu / macOS / Windows) |

---

## Project Structure

```
AlgoBuddy/
├── app/
│   ├── api/               # API routes (auth, contact, send-review)
│   ├── blogs/             # Blog pages and content
│   ├── components/        # Shared UI components
│   │   ├── dashboard/     # Activity heatmap, streak counter
│   │   ├── models/        # Data structure visual models
│   │   └── ui/            # Reusable primitives
│   ├── contexts/          # React contexts (UserContext, AuthContext)
│   ├── dashboard/         # User dashboard page
│   ├── login/             # Authentication page
│   └── visualizer/        # Algorithm visualizer pages
├── lib/                   # Supabase client, activity tracker, gtag
├── public/                # Static assets
├── utils/                 # Auth helpers
├── .github/workflows/     # CI pipeline
└── tailwind.config.js
```

---

## Getting Started

**Prerequisites:** Node.js 20+, npm

```bash
# 1. Clone the repository
git clone https://github.com/PankajSingh34/AlgoBuddy.git
cd AlgoBuddy

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp EnvExample.txt .env.local
# Fill in the values — see Environment Variables section below

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file at the root with the following keys (see `EnvExample.txt`):

| Variable | Description |
|---|---|
| `EMAIL_USER` | Gmail address used to send contact/review emails |
| `EMAIL_PASSWORD` | Gmail App Password (not your account password) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics Measurement ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |

Never commit `.env.local` to version control. It is listed in `.gitignore`.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`

Please follow clean code practices and test your changes before submitting. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community guidelines.

---

## License

Licensed under the [Apache 2.0 License](./LICENSE).

---

Made with care by [Sohan Rout](https://www.linkedin.com/in/sohan-rout) and contributors.
