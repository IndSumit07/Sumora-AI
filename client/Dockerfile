# ── Stage 1: Build the Vite/React app ────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build args for environment variables needed at build time
ARG VITE_API_URL
ARG VITE_DEEPGRAM_API_KEY
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_TURNSTILE_SITE_KEY
ARG VITE_LOGO_DEV_TOKEN

# Set them as env vars so Vite can inline them
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_DEEPGRAM_API_KEY=$VITE_DEEPGRAM_API_KEY
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY
ENV VITE_LOGO_DEV_TOKEN=$VITE_LOGO_DEV_TOKEN

# Build the production bundle
RUN npm run build

# ── Stage 2: Serve with Nginx ────────────────────────────────────────────────
FROM nginx:stable-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
