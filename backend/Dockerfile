FROM node:20-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json

RUN npm ci

FROM deps AS build

COPY backend/tsconfig.json backend/tsconfig.json
COPY backend/src backend/src

RUN npm run build -w story-spark-ai-backend

FROM node:20-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json

RUN npm ci --omit=dev --workspace story-spark-ai-backend && npm cache clean --force

COPY --from=build /app/backend/dist backend/dist

USER node

EXPOSE 5000

CMD ["node", "backend/dist/server.js"]