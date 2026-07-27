FROM node:22-alpine AS development
WORKDIR /app

RUN corepack enable && apk add --no-cache openssl libc6-compat

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
RUN pnpm prisma:generate

COPY src ./src

EXPOSE 5000
CMD ["pnpm", "dev"]

FROM development AS production
CMD ["node", "src/server.js"]
