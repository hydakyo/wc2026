# WorldCup Pulse 2026

Premium FIFA World Cup 2026 realtime-style command center built with Next.js and TypeScript.

## Features

- Dashboard for live matches, latest results and upcoming fixtures.
- Group standings A-L.
- Group winners, runners-up and best third-place qualification view.
- Top 8 third-place race module.
- Projected knockout bracket.
- Team analytics: attack, defense, form and discipline.
- TV/NOC display mode at `/display`.
- Backend API routes with normalized data layer.

## Stack

- Next.js App Router
- React
- TypeScript
- CSS-only premium dashboard UI
- Server-side API routes

## Run

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

## API routes

```text
GET /api/worldcup/summary
GET /api/worldcup/matches
GET /api/worldcup/standings
GET /api/worldcup/bracket
```

## Data provider integration

The current implementation uses normalized mock data in `lib/worldcup-data.ts`. For production, replace the mock layer with a Sportmonks or API-Football adapter on the server side only. Do not expose provider API keys to the browser.
