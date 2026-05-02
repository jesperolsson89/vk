FROM node:20-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
RUN pnpm install --frozen-lockfile
COPY . .

# Debug — show us what exists
RUN ls -la apps/api/
RUN ls -la apps/api/src/ || echo "NO SRC FOLDER FOUND"
RUN cat apps/api/package.json
RUN cat apps/api/tsconfig.json || echo "NO TSCONFIG FOUND"

# Build
RUN pnpm --filter api build || echo "BUILD FAILED"

# Show result
RUN ls -la apps/api/dist/ || echo "NO DIST FOLDER - BUILD DID NOT PRODUCE OUTPUT"

CMD ["node", "apps/api/dist/index.js"]