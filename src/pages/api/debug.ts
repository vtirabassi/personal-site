import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';
import { Bot } from 'grammy';

export const prerender = false;

export const GET: APIRoute = async () => {
  const results: Record<string, string> = {};

  try {
    await kv.set('debug-test', '1', { ex: 60 });
    const val = await kv.get('debug-test');
    results.kv = val === '1' ? 'ok' : 'wrong value';
  } catch (e) {
    results.kv = String(e);
  }

  try {
    const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
    results.grammy = bot ? 'ok' : 'null';
  } catch (e) {
    results.grammy = String(e);
  }

  return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
};
