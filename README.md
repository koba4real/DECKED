# DECKED

Nuxt 4 app — better-auth (GitHub + Google OAuth) + Drizzle ORM on Neon Postgres.

## Setup

```bash
pnpm install
```

Copy `.env.example` to `.env` and fill in the values (see below).

## Environment

| Var                                                   | Notes                                                   |
| ----------------------------------------------------- | ------------------------------------------------------- |
| `DATABASE_URL`                                        | Neon pooled connection string (host contains `-pooler`) |
| `BETTER_AUTH_SECRET`                                  | random secret for better-auth                           |
| `BETTER_AUTH_URL`                                     | app origin, e.g. `http://localhost:3000`                |
| `AUTH_GITHUB_CLIENT_ID` / `AUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth app credentials                            |
| `AUTH_GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client credentials                         |

## Database

```bash
pnpm db:generate   # generate migrations from the Drizzle schema
pnpm db:migrate    # apply them to DATABASE_URL
pnpm db:studio     # browse the database
```

## Development

```bash
pnpm dev      # http://localhost:3000
pnpm lint     # eslint
pnpm build    # production build
```

## Workflow

`main` is the deploy branch (auto-deploys to Vercel). Feature work happens on
`dc-##` branches (one per kanban issue) → PR into `main` → lint CI gates the merge.
