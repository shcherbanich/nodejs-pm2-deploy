# ---------- Stage 1: deps + build ----------
FROM node:16-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./tsconfig.json
COPY src ./src
RUN npm run build

# ---------- Stage 2: production runtime ----------
FROM node:16-alpine AS runner
WORKDIR /app

RUN npm i -g pm2

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY ecosystem.runtime.cjs ./ecosystem.config.cjs

USER node

EXPOSE 4000

CMD ["pm2-runtime", "ecosystem.config.cjs"]
