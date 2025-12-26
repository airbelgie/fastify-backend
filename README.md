# AirBelgie Backend

A modern, production-ready Fastify backend API built with TypeScript, Drizzle ORM, and comprehensive observability through Sentry.

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js 24.x |
| Framework | Fastify 5 |
| Language | TypeScript 5.9 |
| Database | PostgreSQL with Drizzle ORM |
| Build | esbuild |
| Linting | Biome |
| Monitoring | Sentry (errors, logs, profiling, tracing) |
| Package Manager | pnpm |
| Containerization | Docker (multi-stage builds) |

## Project Structure

```
src/
├── index.ts           # Application entry point
├── instrument/        # Sentry instrumentation setup
├── plugins/           # Fastify plugins (autoloaded)
│   ├── sensible.ts    # HTTP error utilities
│   └── no-icon.ts     # Favicon 404 handler
├── routes/            # API routes (autoloaded)
│   └── root.ts        # Root endpoints
└── db/
    └── schema.ts      # Drizzle database schema
```

## Getting Started

### Prerequisites

- Node.js 24.x
- pnpm 10.x
- PostgreSQL database

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NODE_ENV` | Environment (`local`, `production`) |

### Development

```bash
# Start development server with hot reload
pnpm watch

# Build for production
pnpm build
```

The server runs on `http://localhost:3008` by default.

### Database Migrations

```bash
# Generate migrations from schema changes
pnpm drizzle-kit generate

# Apply pending migrations
pnpm drizzle-kit migrate

# Open Drizzle Studio for database inspection
pnpm drizzle-kit studio
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Returns 404 (placeholder) |
| GET | `/async` | Async 404 example |
| GET | `/debug-sentry` | Triggers test error for Sentry |

## Deployment

### Docker

```bash
# Build the image
docker build -t airbelgie-backend .

# Run the container
docker run -p 3008:3008 -e DATABASE_URL=<your-url> airbelgie-backend
```

### CI/CD

The project includes GitHub Actions workflows for:

- **Docker Build & Push**: Builds and pushes images to GitHub Container Registry on push to `main`
- **Database Migrations**: Automatically runs Drizzle migrations after build
- **Deployment**: SSH deploys to production server

### Production Container

```bash
docker pull ghcr.io/airbelgie/fastify-backend:main
docker run -d --name airbelgie_backend -p 3008:3008 ghcr.io/airbelgie/fastify-backend:main
```

## Observability

Sentry is configured for comprehensive observability (disabled in `local` environment):

- **Error Tracking**: Automatic capture with Fastify integration
- **Structured Logging**: `Sentry.logger.info()` for structured logs
- **Performance Tracing**: 100% trace sampling
- **Profiling**: Automatic profiling during active traces
- **Metrics**: Custom metrics via `Sentry.metrics`

## Code Quality

```bash
# Format and lint
pnpm biome check --write .

# Type check
pnpm tsc --noEmit
```

Biome is configured with:
- 2-space indentation
- Automatic import organization
- Sorted object keys
- Recommended linting rules

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build with esbuild |
| `pnpm watch` | Development mode with hot reload |
| `pnpm test` | Run tests (not yet configured) |

## License

AGPL-3.0-or-later

## Author

Rahul Parkar
