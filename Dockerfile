FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY index.html ./
COPY src src
COPY public public
COPY vite.config.ts ./
COPY vitest.config.ts ./

RUN npm install -g pnpm
RUN pnpm install