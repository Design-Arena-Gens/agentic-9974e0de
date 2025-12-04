# Phone Analyst Bot

Production-ready Next.js dashboard and Telegram webhook that compares flagship smartphone prices across Iranian retailers. Deployable on Vercel with zero configuration.

## Stack

- Next.js 14 (App Router)
- React 18 with TypeScript
- Tailwind CSS
- Recharts for visualization

## Getting Started

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to view the dashboard.

## Telegram Webhook

- Endpoint: `/api/telegram`
- Required environment variables:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_SECRET` (optional but recommended)

Commands:

- `/compare <brand model>` → Returns best vs worst offers and spread
- `/report` → Daily market digest
- `/watch <device> <target>` → Registers threshold notifications
- `/health` → Diagnostics summary

## Deployment

Deploy to Vercel:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-9974e0de
```

After deployment, validate:

```bash
curl https://agentic-9974e0de.vercel.app
```

## Scripts

- `npm run dev` – Development
- `npm run build` – Production build
- `npm run start` – Start production server
- `npm run lint` – Lint project
