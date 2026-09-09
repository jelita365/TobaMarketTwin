# TobaMarketTwin

AI-assisted, human-calibrated Customer Twins for screening sustainable product concepts for Toba MSMEs.

The codebase follows **feature-based Clean Architecture**: domain rules live in features, the Next.js App Router is a thin presentation layer, and Docker Compose is the supported way to run the app.

## Architecture

```
src/
  app/                         # Next.js routes (presentation)
  core/store/                  # composition root + local persistence
  features/                    # vertical slices
    configurations/
    constraints/
    customer-twin/
    sustainability/
    human-validation/
    calibration/
    decision/
    experiments/
    personas/
    evidence/
  shared/
    domain/                    # shared types and product attributes
    lib/                       # formatting and math helpers
    ui/                        # reusable UI primitives
```

Each feature keeps domain logic, application use cases, and infrastructure adapters separate. Features expose a public `index.ts` so pages never reach into internals.

## Run with Docker Compose

Copy the env file, then start the stack. The app listens on port 3000 inside the container; the host port comes from `EXPOSE_PORT` in `.env`.

```bash
cp .env.example .env
docker compose up --build
```

Then open [http://localhost:3000](http://localhost:3000) (or the host port you set in `.env`).

## Run locally without Docker

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
