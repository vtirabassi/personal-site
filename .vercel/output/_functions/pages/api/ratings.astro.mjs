import { kv } from '@vercel/kv';
export { renderers } from '../../renderers.mjs';

const prerender = false;
function computeAverage(total, count) {
  if (count === 0) return 0;
  return total / count;
}
function validateVote(vote) {
  return typeof vote === "number" && vote >= 1 && vote <= 5;
}
const GET = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "id is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const total = await kv.get(`rating:total:${id}`) ?? 0;
  const count = await kv.get(`rating:count:${id}`) ?? 0;
  return new Response(
    JSON.stringify({ average: computeAverage(total, count), count }),
    { headers: { "Content-Type": "application/json" } }
  );
};
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || !validateVote(body.vote)) {
    return new Response(JSON.stringify({ error: "invalid input" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { id, vote } = body;
  const total = await kv.get(`rating:total:${id}`) ?? 0;
  const count = await kv.get(`rating:count:${id}`) ?? 0;
  await kv.set(`rating:total:${id}`, total + vote);
  await kv.set(`rating:count:${id}`, count + 1);
  return new Response(
    JSON.stringify({ average: computeAverage(total + vote, count + 1), count: count + 1 }),
    { headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
