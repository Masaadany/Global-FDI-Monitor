# GFM API Server

Node.js HTTP server powering the Global FDI Monitor platform.

## Quick Start

```bash
# Install
npm ci

# Development
node server.js

# Production (Docker)
docker build -t melsaadany/gfm-api .
docker run -p 3001:3001 --env-file .env melsaadany/gfm-api
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection string (SSL) |
| `JWT_SECRET` | Yes | 32+ char secret for JWT signing |
| `STRIPE_SECRET_KEY` | No | Stripe live/test secret key |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook endpoint secret |
| `RESEND_API_KEY` | No | Resend email API key |
| `ANTHROPIC_API_KEY` | No | Anthropic API for translation agent |
| `APP_URL` | No | App base URL (default: https://fdimonitor.org) |
| `PORT` | No | Server port (default: 3001) |

## API Overview

Base URL: `https://api.fdimonitor.org`

- **53 REST endpoints** across auth, intelligence, pipeline, billing, notifications
- **WebSocket** at `/ws` for real-time signal broadcast (2s interval)
- **JWT** Bearer token authentication
- **Rate limiting**: 100 req/min (public), 500 req/min (authenticated)
- **Gzip compression** for all JSON responses
- **OpenAPI 3.1 spec** at `/api/v1/openapi.json`

## Architecture

```
server.js (1,667 lines)
├── Mock data: M_SIGNALS, M_GFR, M_COMPANIES, M_FORECAST, M_INSIGHTS, M_PUBLICATIONS, M_SCENARIOS
├── Auth: JWT + bcrypt + refresh tokens
├── Routes: ROUTES["METHOD /path"] = handler
├── DB: PostgreSQL (28 tables, 5 schemas)
├── Cache: Redis (TTL-based)
├── Email: Resend (5 templates)
└── WS: ws.Server (2s signal broadcast)
```

## Key Routes

| Route | Auth | FIC | Description |
|-------|------|-----|-------------|
| `POST /api/v1/auth/login` | ❌ | 0 | Get JWT tokens |
| `GET /api/v1/signals` | ✅ | 0 | Real-time FDI signals |
| `GET /api/v1/gfr` | ✅ | 0 | GFR rankings (215 economies) |
| `POST /api/v1/reports/generate` | ✅ | 5+ | Generate AI report |
| `GET /api/v1/forecast` | ✅ | 12 | FDI forecast (Bayesian VAR) |
| `GET /api/v1/analytics` | ✅ | 0 | Platform analytics |

## Health Check

```bash
curl https://api.fdimonitor.org/api/v1/health
# {"status":"ok","db":"connected","redis":"connected","ws_clients":0}
```
