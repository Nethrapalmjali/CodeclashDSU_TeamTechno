# Base Image for all stages
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# -------------------------
# DEPENDENCY STAGE
# -------------------------
FROM base AS dependencies
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
# Copy workspace packages
COPY artifacts/api-server/package.json artifacts/api-server/
COPY artifacts/mockup-sandbox/package.json artifacts/mockup-sandbox/
COPY lib/db/package.json lib/db/
COPY lib/api-zod/package.json lib/api-zod/
COPY lib/api-spec/package.json lib/api-spec/
COPY lib/api-client-react/package.json lib/api-client-react/

# Install all dependencies required for build
RUN pnpm install --frozen-lockfile --ignore-scripts

# -------------------------
# BUILD STAGE
# -------------------------
FROM dependencies AS builder
WORKDIR /app
COPY . .
# Build the workspace (Typecheck and compile TS into JS)
RUN pnpm run build

# -------------------------
# PRODUCTION RUNNER STAGE
# -------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built assets from builder
COPY --from=builder /app/artifacts/api-server/dist ./server
COPY --from=builder /app/artifacts/mockup-sandbox/dist ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 8080

# In an actual enterprise app, we start the API server to serve the frontend as static files
# Since API server here is meant for backend logic, we'll run it and let it host or accept traffic.
CMD ["node", "server/index.js"]
