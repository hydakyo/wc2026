# WorldCup Pulse 2026

Premium realtime command-center dashboard for FIFA World Cup 2026.

## Features

- Realtime-style dashboard with 15-second frontend polling.
- Live Match Center with score, minute, event timeline and quick stats.
- Latest results and upcoming match panels.
- Group standings from A-L.
- Best third-place ranking with top 8 qualification zone.
- Qualified team split: group winners, runners-up and best third-place teams.
- Projected knockout bracket from Round of 32.
- Team analytics: attack, defense, form and discipline.
- TV/NOC display mode at `/display`.
- Backend-only provider abstraction. API keys are never exposed to the browser.

## Stack

- Next.js App Router
- TypeScript
- CSS-only premium dashboard styling
- Backend API proxy routes
- Mock provider adapter, ready for Sportmonks/API-Football integration

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/display
```

## Build

```bash
npm run typecheck
npm run build
```

## Data provider integration

Current implementation uses mock data in `lib/mock-data.ts`.

Production path:

1. Add provider credentials in `.env.local`.
2. Implement provider adapter in `lib/provider.ts`.
3. Normalize raw provider payload into types from `lib/types.ts`.
4. Keep all provider calls in server-side API routes only.
5. Add Redis or server-side cache before opening the app publicly.

Recommended providers:

- Sportmonks Football API
- API-Football / API-Sports

## API routes

```text
GET /api/worldcup/summary
GET /api/worldcup/matches
GET /api/worldcup/standings
GET /api/worldcup/bracket
```

## Pages

```text
/           Dashboard
/display    TV display mode
/matches    Match center
/standings  Group tables + third-place race
/bracket    Knockout bracket
/teams      Team analytics
```

## Production notes

- Replace mock adapter with a provider-specific adapter.
- Add upstream caching and stale-data protection.
- Use SSE or WebSocket when backend owns the upstream polling loop.
- Validate official tie-breaker rules through the data provider or FIFA reference before final tournament use.
