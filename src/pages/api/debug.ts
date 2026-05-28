import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    has_telegram: !!process.env.TELEGRAM_BOT_TOKEN,
    has_github: !!process.env.GITHUB_TOKEN,
    has_anthropic: !!process.env.ANTHROPIC_API_KEY,
    has_kv_url: !!process.env.KV_REST_API_URL,
    has_kv_token: !!process.env.KV_REST_API_TOKEN,
  }), { headers: { 'Content-Type': 'application/json' } });
};
