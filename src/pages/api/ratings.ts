import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';

export const prerender = false;

function computeAverage(total: number, count: number): number {
  if (count === 0) return 0;
  return total / count;
}

function validateVote(vote: unknown): vote is number {
  return typeof vote === 'number' && vote >= 1 && vote <= 5;
}

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const total = (await kv.get<number>(`rating:total:${id}`)) ?? 0;
  const count = (await kv.get<number>(`rating:count:${id}`)) ?? 0;

  return new Response(
    JSON.stringify({ average: computeAverage(total, count), count }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== 'string' || !validateVote(body.vote)) {
    return new Response(JSON.stringify({ error: 'invalid input' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id, vote } = body as { id: string; vote: number };
  const total = (await kv.get<number>(`rating:total:${id}`)) ?? 0;
  const count = (await kv.get<number>(`rating:count:${id}`)) ?? 0;

  await kv.set(`rating:total:${id}`, total + vote);
  await kv.set(`rating:count:${id}`, count + 1);

  return new Response(
    JSON.stringify({ average: computeAverage(total + vote, count + 1), count: count + 1 }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
