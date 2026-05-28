# Security Policy

Thank you for helping keep **StorySparkAI** and its users safe. We take security seriously and appreciate responsible disclosure from the community.

---

## Table of Contents

- [Supported Versions](#supported-versions)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [What to Include in Your Report](#what-to-include-in-your-report)
- [Our Response Process](#our-response-process)
- [Disclosure Policy](#disclosure-policy)
- [Scope](#scope)
- [Out of Scope](#out-of-scope)
- [Security Best Practices for Contributors](#security-best-practices-for-contributors)
- [Known Security-Sensitive Areas](#known-security-sensitive-areas)
- [Hall of Thanks](#hall-of-thanks)

---

## Supported Versions

We actively maintain and apply security fixes to the following versions:

| Version / Branch | Supported          |
| ---------------- | ------------------ |
| `main` (latest)  | ✅ Actively supported |
| Older branches   | ❌ Not supported — please upgrade |

Only the `main` branch receives security patches. If you are running a forked or older version, we strongly recommend syncing with `main`.

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Public disclosure before a fix is in place puts all users of StorySparkAI at risk. Instead, please use one of the following private channels:

### Option 1 — GitHub Private Security Advisory (Preferred)

Use GitHub's built-in private reporting feature:

1. Go to the [Security Advisories page](https://github.com/ronisarkarexe/story-spark-ai/security/advisories/new)
2. Click **"Report a vulnerability"**
3. Fill in the details and submit

This keeps the report completely private between you and the maintainers until a fix is ready.

### Option 2 — Email

If you prefer email, contact the project maintainer directly:

📧 **[ronisarkarexe@gmail.com](mailto:ronisarkarexe@gmail.com)**

Use the subject line: `[SECURITY] StorySparkAI Vulnerability Report`

Please **encrypt sensitive details** if possible. We will acknowledge your report within **48 hours**.

---

## What to Include in Your Report

A good vulnerability report helps us reproduce and fix the issue faster. Please include:

- **Description** — A clear explanation of the vulnerability and its potential impact
- **Affected component** — Frontend, backend, authentication, API, etc.
- **Steps to reproduce** — Numbered steps that allow us to reproduce the issue
- **Proof of concept** — Code snippets, screenshots, or a screen recording (if safe to share)
- **Expected vs actual behavior** — What should happen vs what actually happens
- **Suggested fix** — Optional, but very welcome
- **Your environment** — Browser, OS, Node.js version, etc.

The more detail you provide, the faster we can act.

---

## Our Response Process

Once you submit a report, here is what to expect:

| Timeline | Action |
| -------- | ------ |
| **Within 48 hours** | We acknowledge receipt of your report |
| **Within 5 days** | We confirm whether the issue is valid and assess severity |
| **Within 14 days** | We aim to have a patch ready for valid high/critical issues |
| **Within 30 days** | We aim to resolve all valid reported issues |
| **After fix is released** | We coordinate public disclosure with you |

We will keep you updated throughout the process and credit you in the release notes (unless you prefer to remain anonymous).

---

## Disclosure Policy

We follow a **coordinated disclosure** model:

1. You report the vulnerability privately
2. We investigate and develop a fix
3. We release the fix
4. We publicly disclose the vulnerability (after the fix is live), crediting you if you wish

We ask that you:
- Give us a reasonable amount of time to fix the issue before any public disclosure
- Avoid exploiting the vulnerability beyond what is needed to demonstrate it
- Do not access or modify other users' data without explicit permission

---

## Scope

The following are **in scope** for security reports:

### Authentication & Authorization
- JWT token issues (weak secrets, missing expiry, algorithm confusion)
- Google OAuth misconfiguration or token leakage
- OTP verification bypass or brute-force vulnerabilities
- Missing or broken authentication guards on protected routes
- Session fixation or session invalidation failures after password reset
- Privilege escalation (e.g., regular user accessing admin endpoints)

### API & Backend (Node.js / Express)
- Injection attacks (SQL, NoSQL/MongoDB injection, command injection)
- Broken access control on REST API endpoints
- Sensitive data exposure in API responses (passwords, tokens, keys)
- Missing rate limiting on authentication or sensitive endpoints
- Insecure direct object references (IDOR)
- Broken error handling that leaks stack traces or internal details
- Server-Side Request Forgery (SSRF)

### Frontend (React / Vite / TypeScript)
- Cross-Site Scripting (XSS) — stored, reflected, or DOM-based
- Cross-Site Request Forgery (CSRF)
- Sensitive data (API keys, tokens) exposed in client-side code or `.env` files
- Open redirects
- Clickjacking vulnerabilities

### Data & Storage
- MongoDB misconfiguration or unauthorized data access
- Exposure of user PII (names, emails, passwords)
- Insecure storage of secrets or credentials

### AI Integration
- Prompt injection attacks that manipulate AI-generated story output maliciously
- Leakage of AI API keys through responses or client bundles

### Infrastructure / Configuration
- Exposed `.env` files or secrets committed to the repository
- Misconfigured CORS policy allowing unauthorized origins
- Security headers missing (CSP, HSTS, X-Frame-Options, etc.)

---

## Out of Scope

The following are **not considered valid** security reports for this project:

- Vulnerabilities in third-party services (MongoDB Atlas, Vercel, Google OAuth infrastructure itself)
- Social engineering attacks targeting maintainers
- Physical security issues
- Denial of Service (DoS) via excessive requests without authentication context
- Missing security headers on third-party CDN resources
- Self-XSS that requires the attacker to already have control of their own browser
- Spam or automated account creation without demonstrated impact
- Theoretical vulnerabilities without a working proof of concept
- Issues in outdated browsers or unsupported environments
- Findings from automated scanners with no manual verification or context

---

## Security Best Practices for Contributors

If you are contributing code to StorySparkAI, please follow these guidelines:

### Environment & Secrets
- **Never commit** `.env` files, API keys, JWT secrets, or database credentials
- Use `.env.example` with placeholder values for documentation
- All secrets must be injected via environment variables — never hardcoded

### Authentication
- Always validate and sanitize user input on both frontend and backend
- JWT tokens must have a reasonable expiry (`expiresIn`)
- Refresh token rotation should invalidate old tokens on use
- Always verify OTP server-side — never trust client-side OTP checks

### API Design
- Apply authentication middleware to all protected routes
- Validate request body schemas (use libraries like `zod` or `joi`)
- Never expose raw MongoDB `_id` fields or internal error stack traces in API responses
- Apply rate limiting to login, signup, OTP, and password-reset endpoints

### Dependencies
- Keep `npm` dependencies up to date
- Run `npm audit` regularly and address high/critical findings before opening a PR
- Do not add dependencies with known unpatched vulnerabilities

### Frontend
- Never store JWT tokens in `localStorage` — prefer `httpOnly` cookies or memory
- Sanitize any user-generated content before rendering it in the DOM
- Do not expose backend URLs, API keys, or secrets in the Vite client bundle

---

## Known Security-Sensitive Areas

The following areas of the codebase handle sensitive logic and deserve extra care during review and contribution:

| Area | Sensitivity | Notes |
| ---- | ----------- | ----- |
| Authentication controllers and middleware | 🔴 High | Login, signup, Google OAuth, OTP handling |
| JWT utility / helper modules | 🔴 High | Token generation, signing, and verification |
| User controller / profile management | 🟠 Medium | User deletion, profile updates, account actions |
| Signup / Login frontend pages | 🟠 Medium | Form validation, password handling, token storage |
| Environment configuration files (`.env`) | 🔴 High | Must never be committed — contains API keys and secrets |
| AI story generation endpoints | 🟠 Medium | Prompt injection surface — sanitize all user input |

---

## Hall of Thanks

We sincerely thank everyone who has responsibly disclosed security issues to us. Your efforts make StorySparkAI safer for everyone.

*No disclosures yet — be the first! 🛡️*

---

> This security policy is inspired by best practices from [GitHub's recommended security policy template](https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository) and the [OWASP Vulnerability Disclosure Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html).
