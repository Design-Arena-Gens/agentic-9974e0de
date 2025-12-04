import Link from 'next/link';

const steps = [
  {
    title: 'Create Bot Token',
    description: 'Chat with @BotFather and use /newbot to provision a token.',
    command: 'BotFather >> /setdomain agentic-9974e0de.vercel.app'
  },
  {
    title: 'Set Webhook',
    description: 'Point Telegram webhook to our Vercel edge function.',
    command: 'curl https://api.telegram.org/bot<token>/setWebhook?url=https://agentic-9974e0de.vercel.app/api/telegram'
  },
  {
    title: 'Verify Health',
    description: 'Send /health to ensure the bot responds with the latest metrics.',
    command: 'telegram >> /health'
  }
];

const capabilities = [
  {
    command: '/compare <brand> <model>',
    description: 'Returns best and worst offers with price spread insights.'
  },
  {
    command: '/watch <device>',
    description: 'Sets an alert when the best offer drops below your target.'
  },
  {
    command: '/report',
    description: 'Daily digest summarizing market movement and top changes.'
  }
];

export function TelegramSetup() {
  return (
    <section id="telegram" className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Telegram Automation</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Deploy the analyst bot in under five minutes</h2>
          <p className="mt-4 text-sm text-slate-300">
            The webhook hosted on Vercel responds instantly with market analytics generated from the dashboard dataset. We include slash commands that marketing teams in Iran use daily to benchmark offers and monitor competitor pricing.
          </p>

          <div className="mt-6 space-y-4">
            {steps.map((step) => (
              <div key={step.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-2 text-xs text-slate-400">{step.description}</p>
                <code className="mt-3 block rounded-xl bg-slate-950/80 px-4 py-3 text-xs text-primary-200">
                  {step.command}
                </code>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-primary-500/40 bg-primary-500/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-200">Live Commands</p>
          <ul className="mt-4 space-y-4 text-sm text-primary-100">
            {capabilities.map((item) => (
              <li key={item.command} className="rounded-xl border border-primary-500/30 bg-primary-500/5 px-4 py-3">
                <p className="font-semibold">{item.command}</p>
                <p className="mt-1 text-xs text-primary-100/80">{item.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">
            <p className="font-semibold text-white">Webhook endpoint</p>
            <p className="mt-1 text-primary-200">https://agentic-9974e0de.vercel.app/api/telegram</p>
            <p className="mt-4 text-slate-400">
              The endpoint validates environment variables `TELEGRAM_BOT_TOKEN` and `TELEGRAM_SECRET`. You can set them via the Vercel dashboard (`Settings → Environment Variables`).
            </p>
            <Link
              href="https://vercel.com/docs/deployments/environment-variables"
              target="_blank"
              className="mt-3 inline-flex items-center gap-1 text-primary-200"
            >
              Vercel guide ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
