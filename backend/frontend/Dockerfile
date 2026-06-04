FROM node:20-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json

RUN npm ci

FROM deps AS build

ARG VITE_BASE_URL=/api/v1
ARG VITE_SOCKET_URL=http://localhost:4001

ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

COPY frontend frontend

RUN npm run build -w story-spark-ai-frontend

FROM nginx:1.27-alpine AS runtime

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]