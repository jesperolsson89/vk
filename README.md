# vk

A full-stack web application with a React/Vite frontend, an Express API, and a PostgreSQL database — all orchestrated with Docker Compose.

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:5173 |
| API      | http://localhost:3001 |
| Database | localhost:5432        |

## Prerequisites

Make sure you have these installed before you start:

- **Node.js** v20 or later — https://nodejs.org
- **pnpm** — `npm install -g pnpm`
- **Docker Desktop** — https://www.docker.com/products/docker-desktop

## First-time setup

### 1. Environment variables

Create a `.env` file in the root of the repo:

```
BANKID_CERT_PASSPHRASE=qwerty123
SESSION_SECRET=1234567891234567
```

### 2. BankID certificates

Place the following files in a `certs/` folder at the root of the repo:
Download files here: https://cdn.bankid.com/tools/FPTestcert5_20240703.zip
And copy certificate from https://developers.bankid.com/getting-started/environments and put it in a new file and name it bankid-ca.crt

```
certs/
  bankid.p12
  bankid-ca.crt
```

### 3. Install dependencies (for IDE support)

Run this once so your editor can resolve types and give you autocompletion:

```bash
pnpm install
```

### 4. Start the stack

```bash
docker compose up -d
```

The first run will take 1–2 minutes while Docker downloads and caches all packages. Every run after that will be much faster.

Once everything is up, open http://localhost:5173 in your browser.

## Daily use

```bash
# Start all services in the background
docker compose up -d

# Stop all services (data is preserved)
docker compose down

# Stop and wipe everything — volumes, database, node_modules cache (fresh start)
docker compose down -v
```

## After pulling changes

If `package.json` or `pnpm-lock.yaml` changed (e.g. a teammate added a package), re-run:

```bash
pnpm install
docker compose down && docker compose up -d
```

Otherwise a plain `docker compose up -d` is enough.
