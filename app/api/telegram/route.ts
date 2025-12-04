import { NextRequest, NextResponse } from 'next/server';
import { getMarketSnapshot } from '@/lib/analysis';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_SECRET = process.env.TELEGRAM_SECRET;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fa-IR', { style: 'currency', currency: 'IRR' })
    .format(amount)
    .replace('ریال', 'تومان');

const sendTelegramMessage = async (chatId: number, text: string) => {
  if (!TELEGRAM_TOKEN) {
    console.warn('Skipping Telegram sendMessage because TELEGRAM_BOT_TOKEN is not configured.');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const body = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown'
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    console.error('Failed to send Telegram message', await response.text());
  }
};

const parseCommand = (text: string | undefined) => {
  if (!text) return { command: 'unknown', args: [] as string[] };
  const [command, ...args] = text.trim().split(/\s+/);
  return { command: command.toLowerCase(), args };
};

const handleCompare = (chatId: number, args: string[]) => {
  const query = args.join(' ').toLowerCase();
  const snapshot = getMarketSnapshot();
  const match = snapshot.devices.find((device) => device.name.toLowerCase().includes(query));

  if (!match) {
    return sendTelegramMessage(chatId, `❗️ *نتیجه‌ای یافت نشد.*\nمدل «${query}» در پایگاه داده موجود نیست.`);
  }

  const message = [
    `📱 *${match.name}*`,
    `بهترین قیمت: *${formatCurrency(match.bestPrice.price)}* از ${match.bestPrice.retailer}`,
    `گران‌ترین قیمت: ${formatCurrency(match.worstPrice.price)} از ${match.worstPrice.retailer}`,
    `اختلاف: ${formatCurrency(match.priceSpread)} (${match.spreadPercent}%)`
  ].join('\n');

  return sendTelegramMessage(chatId, message);
};

const handleReport = (chatId: number) => {
  const snapshot = getMarketSnapshot();
  const headline = snapshot.highestSpread
    .map(
      (device) =>
        `• *${device.name}* → ${formatCurrency(device.priceSpread)} اختلاف بین ${device.bestPrice.retailer} و ${device.worstPrice.retailer}`
    )
    .join('\n');

  const message = [
    '🗞 *گزارش روزانه بازار موبایل*',
    `میانگین بازار: ${formatCurrency(snapshot.overallAverage)}`,
    '',
    headline || 'امروز نوسان خاصی ثبت نشده است.'
  ].join('\n');

  return sendTelegramMessage(chatId, message);
};

const handleHealth = (chatId: number) => {
  const snapshot = getMarketSnapshot();
  const devices = snapshot.devices.length;
  const message = [
    '✅ *Phone Analyst Bot*',
    `دستگاه‌های فعال: ${devices}`,
    `بهترین دستگاه امروز: ${snapshot.highestSpread[0]?.name ?? 'نامشخص'}`
  ].join('\n');
  return sendTelegramMessage(chatId, message);
};

const handleStart = (chatId: number) => {
  const message = [
    '👋 خوش آمدید به Phone Analyst Bot!',
    'دستورات موجود:',
    '/compare <brand model>',
    '/watch <device> <target>',
    '/report',
    '/health'
  ].join('\n');
  return sendTelegramMessage(chatId, message);
};

const handleWatch = (chatId: number, args: string[]) => {
  if (args.length < 2) {
    return sendTelegramMessage(chatId, 'برای ثبت هشدار از الگو /watch <device> <target> استفاده کنید.');
  }
  const threshold = Number(args[args.length - 1].replace(/[^0-9]/g, ''));
  const query = args.slice(0, -1).join(' ').toLowerCase();
  const device = getMarketSnapshot().devices.find((entry) => entry.name.toLowerCase().includes(query));

  if (!device) {
    return sendTelegramMessage(chatId, `هیچ دستگاهی با نام ${query} پیدا نشد.`);
  }

  const message = [
    '🔔 *هشدار ذخیره شد!*',
    `دستگاه: ${device.name}`,
    `قیمت هدف: ${formatCurrency(threshold)}`,
    'به محض رسیدن قیمت پایین‌تر از مقدار فوق پیام ارسال می‌شود.'
  ].join('\n');

  return sendTelegramMessage(chatId, message);
};

export async function POST(request: NextRequest) {
  if (TELEGRAM_SECRET) {
    const secret = request.headers.get('x-telegram-bot-api-secret-token');
    if (secret !== TELEGRAM_SECRET) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
  }

  const payload = await request.json();
  const message = payload?.message;
  if (!message) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const { command, args } = parseCommand(message.text);

  switch (command) {
    case '/start':
      await handleStart(chatId);
      break;
    case '/compare':
      await handleCompare(chatId, args);
      break;
    case '/report':
      await handleReport(chatId);
      break;
    case '/health':
      await handleHealth(chatId);
      break;
    case '/watch':
      await handleWatch(chatId, args);
      break;
    default:
      await sendTelegramMessage(chatId, 'دستور نامعتبر است. از /help برای مشاهده دستورات استفاده کنید.');
  }

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  if (TELEGRAM_SECRET) {
    const secret = request.headers.get('x-telegram-bot-api-secret-token');
    if (secret !== TELEGRAM_SECRET) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
  }

  const snapshot = getMarketSnapshot();
  return NextResponse.json({
    ok: true,
    devices: snapshot.devices.length,
    averagePrice: snapshot.overallAverage
  });
}
