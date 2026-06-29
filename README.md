<div align="center">
<h1>👩‍💻 StorySparkAI is an open-source platform designed for creative minds to generate and share multiple story variations from a single prompt. Perfect for writers, creators, and enthusiasts exploring AI-powered storytelling!</h1>
</div>

<p align="center">
   <a href="https://github.com/ronisarkarexe/story-spark-ai/blob/master/LICENSE" target="blank">
   <img src="https://img.shields.io/github/license/ronisarkarexe/story-spark-ai?style=for-the-badge&logo=appveyor" alt="License" />
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/fork" target="blank">
   <img src="https://img.shields.io/github/forks/ronisarkarexe/story-spark-ai?style=for-the-badge&logo=appveyor" alt="Forks"/>
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/stargazers" target="blank">
   <img src="https://img.shields.io/github/stars/ronisarkarexe/story-spark-ai?style=for-the-badge&logo=appveyor" alt="Star"/>
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/issues" target="blank">
   <img src="https://img.shields.io/github/issues/ronisarkarexe/story-spark-ai.svg?style=for-the-badge&logo=appveyor" alt="Click Vote Issue"/>
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/pulls" target="blank">
   <img src="https://img.shields.io/github/issues-pr/ronisarkarexe/story-spark-ai.svg?style=for-the-badge&logo=appveyor" alt="Click Vote Open Pull Request"/>
   </a>
</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About 🚀](#about-)
- [Features 💪](#features-)
- [Local development (monorepo)](#local-development-monorepo)
- [Environment variables](#environment-variables)
- [Contributing 👨‍💻](#contributing-)
- [Contributors 🤝](#contributors-)
- [License](#license)
- [Support 🙏](#support-)

<a id="about"></a>

## About 🚀

- story-spark-ai - [Website](https://storysparkai.vercel.app/)
- **`StorySparkAi`** is an open-source project designed to generate and showcase AI-created stories based on user prompts in a simple, engaging way.
- With **`StorySparkAi`**, users can input a prompt and explore multiple story variations, edit them, and publish their favorites for others to read and enjoy.

<a id="features"></a>

## Features 💪

- One of the key features of **`StorySparkAi`** is its powerful search functionality.
- Users can search for developers based on specific skills, making it easy to find issues with expertise in a particular technology or programming language.
- This makes **`StorySparkAi`** a valuable resource for project managers, showcase and anyone looking to connect with skilled developers for collaboration or employment opportunities.

### Local development (monorepo)

**Prerequisites:** Node.js **18.18+**, npm **9+**, MongoDB URI for the API.

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-github-username>/story-spark-ai.git
   cd story-spark-ai
   ```

2. **Install dependencies** (single install at the repo root — npm workspaces)

   ```bash
   npm install
   ```

3. **Environment files**

   - Copy `backend/.env.example` → `backend/.env` and fill in all values (see [Environment variables](#environment-variables)).
  - Copy `frontend/.env.example` → `frontend/.env` and set `VITE_BASE_URL` to your API base URL (e.g. `http://localhost:5000/api/v1` when the backend runs on port 5000). Optionally set `VITE_SOCKET_URL` for real-time notifications; the frontend uses your logged-in access token to join the notification room.

   > Never commit `backend/.env` or `frontend/.env`. Only `.env.example` files belong in git.

4. **Run apps**

   - **Both** (two terminals or one combined process):

     ```bash
     npm run dev
     ```

   - **Backend only:** `npm run dev:backend` — API (default port **5000** if `PORT` is unset).
   - **Frontend only:** `npm run dev:frontend` — Vite dev server on **http://localhost:4001**

5. **Production builds**

   ```bash
   npm run build
   npm run start:backend    # requires `npm run build:backend` first
   npm run start:frontend   # serves built static app (preview)
   ```

**Git:** Use a **single** repository root (one `.git` folder). Do not nest another `.git` inside `frontend/` or `backend/`.

<a id="environment-variables"></a>

### Environment variables

After cloning, create your env files from the examples in the repo:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

#### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MongoDB connection string (local or [Atlas](https://www.mongodb.com/cloud/atlas)) |
| `PORT` | No | API port (default `5000`) |
| `NODE_ENV` | No | `development` or `production` |
| `CORS_ORIGINS` | No | Comma-separated frontend URLs (e.g. `http://localhost:4001`) |
| `SALT_ROUNDS` | Yes | Bcrypt cost factor (e.g. `10`) |
| `JWT_SECRET` | Yes | Access token signing secret |
| `JWT_REFRESH_SECRET` | Yes | Refresh token signing secret |
| `JWT_EXPIRES_IN` | Yes | Access token lifetime (e.g. `60d`) |
| `JWT_REFRESH_EXPIRES_IN` | Yes | Refresh token lifetime (e.g. `120d`) |
| `DEFAULT_ADMIN_PASSWORD` | Yes | Initial admin password on seed |
| `OPEN_AI_KEY` | For OpenAI | [OpenAI API key](https://platform.openai.com/api-keys) |
| `GEMINI_API_KEY` | For Gemini | [Google AI Studio key](https://aistudio.google.com/apikey) |
| `UNSPLASH_KEY_API` | For images | [Unsplash Access Key](https://unsplash.com/developers) |
| `UNSPLASH_KEY_API_SECRET` | For images | Unsplash secret |
| `VERIFY_EMAIL` | For email | SMTP sender address |
| `VERIFY_PASSWORD` | For email | SMTP password or app password |

#### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BASE_URL` | Yes | API base URL, e.g. `http://localhost:5000/api/v1` |
| `VITE_SOCKET_URL` | No | Socket.IO URL for real-time notifications (optional) |

> Source of truth for local setup: keep `backend/.env.example` and `frontend/.env.example` aligned with any docs you add here. The backend uses `OPEN_AI_KEY`, `GEMINI_API_KEY`, `UNSPLASH_KEY_API`, `VERIFY_EMAIL`, and `VERIFY_PASSWORD`; the frontend uses `VITE_BASE_URL` and optionally `VITE_SOCKET_URL`. Socket.IO requires a persistent host, so do not point it at Vercel serverless.

### Contributing workflow

1. Fork the repository and clone your fork.
2. Create a branch: `git checkout -b your-feature-branch`
3. Install with `npm install` at the repo root, configure `.env` files, then `git add`, `git commit`, `git push`, and open a pull request.


<a id="contributing"></a>

## Contributing 👨‍💻

Contributions make the open source community such an amazing place to learn, inspire, and create. <br>
**Any contributions you make are truly appreciated!**

<a id="contributors"></a>

## Contributors 🤝

<!-- CONTRIBUTORS:START -->
Thanks to everyone who has helped build **Story Spark AI**. This section updates automatically when `contributors.json` changes. Merges entries from `contributors.json` with [GitHub contributors](https://github.com/ronisarkarexe/story-spark-ai/graphs/contributors).

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ronisarkarexe">
        <img src="https://github.com/ronisarkarexe.png" width="100" alt="ronisarkarexe" />
        <br />
        <sub><b>Roni Sarkar</b></sub>
      </a>
      <br />
      <sub>Maintainer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/mzl2233">
        <img src="https://github.com/mzl2233.png" width="100" alt="mzl2233" />
        <br />
        <sub><b>mzl2233</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/amrendrasharma1328-a11y">
        <img src="https://github.com/amrendrasharma1328-a11y.png" width="100" alt="amrendrasharma1328-a11y" />
        <br />
        <sub><b>amrendrasharma1328-a11y</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Swetanegi05">
        <img src="https://github.com/Swetanegi05.png" width="100" alt="Swetanegi05" />
        <br />
        <sub><b>Swetanegi05</b></sub>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/rajdeep-yadav">
        <img src="https://github.com/rajdeep-yadav.png" width="100" alt="rajdeep-yadav" />
        <br />
        <sub><b>Rajdeep</b></sub>
      </a>
    </td>
    <td align="center">
      <sub><b>P. Harshini Padmavathi</b></sub>
    </td>
  </tr>
</table>

<!-- CONTRIBUTORS:END -->

<a id="license"></a>

## License

<table>
  <tr>
     <td>
       <p align="center"> <img src="https://github.com/malivinayak/malivinayak/blob/main/LICENSE-Logo/MIT.png?raw=true" width="80%"></img>
    </td>
    <td> 
      <img src="https://img.shields.io/badge/License-MIT-yellow.svg"/> <br> 
         This project is licensed under <a href="./LICENSE">MIT</a>. <img width=2300/>
    </td>
  </tr>
</table>

<a id="support"></a>

## Support 🙏

Thank you for contributing to our open-source project! We appreciate your support 🚀 <br>
Don't forget to leave a star ⭐
