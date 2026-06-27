# Production Notes

## Data source

The current app is using normalized mock data. For production, implement a provider adapter on the server side only.

Recommended providers:

- Sportmonks Football API
- API-Football / API-Sports

## Required before public deployment

- Add provider API key to server environment only.
- Add cache layer for upstream API responses.
- Add stale-data warning if upstream sync is older than the threshold.
- Validate official tie-breaker rules with the selected provider.
- Add monitoring for API errors and response latency.
- Add CI build check for `npm run typecheck` and `npm run build`.

## Suggested refresh cadence

- Live matches: 10-15 seconds
- Standings: 30-60 seconds during live windows
- Upcoming fixtures: 5 minutes
- Bracket: after finished matches
