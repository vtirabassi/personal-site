import { Bot } from 'grammy';
import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
export { renderers } from '../../renderers.mjs';

async function fetchMetadata(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PersonalSiteBot/1.0)" }
  });
  const html = await response.text();
  const ogTitle = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1] ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/)?.[1];
  const ogDesc = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/)?.[1] ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:description"/)?.[1];
  const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1]?.trim();
  return {
    title: ogTitle ?? titleTag ?? url,
    description: ogDesc ?? ""
  };
}

async function classifyTheme(title, description) {
  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 50,
    messages: [
      {
        role: "user",
        content: `Classifique este recurso em um tema de 1 a 3 palavras em português. Responda APENAS com o tema, sem explicação.

Título: ${title}
Descrição: ${description}`
      }
    ]
  });
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Unexpected response from Claude API");
  }
  return textBlock.text.trim();
}

const GITHUB_API = "https://api.github.com";
const FILE_PATH = "src/data/library.json";
function headers() {
  return {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json"
  };
}
async function addLibraryItem(item) {
  const repo = process.env.GITHUB_REPO;
  const url = `${GITHUB_API}/repos/${repo}/contents/${FILE_PATH}`;
  const getRes = await fetch(url, { headers: headers() });
  if (!getRes.ok) {
    const body = await getRes.text();
    throw new Error(`GitHub GET failed ${getRes.status}: ${body}`);
  }
  const fileData = await getRes.json();
  const library = JSON.parse(atob(fileData.content.replace(/\n/g, "")));
  library.items.push(item);
  const putRes = await fetch(url, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({
      message: `feat: add resource "${item.title}"`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(library, null, 2)))),
      sha: fileData.sha
    })
  });
  if (!putRes.ok) {
    const body = await putRes.text();
    throw new Error(`GitHub PUT failed ${putRes.status}: ${body}`);
  }
}

function slugify(text) {
  return text.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function inferType(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com")) {
    return "video";
  }
  if (url.includes("arxiv.org") || url.includes("medium.com") || url.includes("dev.to") || url.includes("substack.com")) {
    return "article";
  }
  return "link";
}

const prerender = false;
function isValidUrl(text) {
  try {
    const parsed = new URL(text);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
function escapeMarkdown(text) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
function createBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  const bot = new Bot(token);
  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text.trim();
    const chatId = String(ctx.chat.id);
    const pending = await kv.get(`pending:${chatId}`);
    if (pending) {
      const isConfirm = text === "✅" || text.toLowerCase() === "sim" || text.toLowerCase() === "confirma";
      const theme = isConfirm ? pending.theme : text;
      const item = {
        id: slugify(pending.title),
        title: pending.title,
        url: pending.url,
        type: inferType(pending.url),
        theme,
        description: pending.description,
        personalNote: pending.personalNote,
        addedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
      try {
        await addLibraryItem(item);
        await kv.del(`pending:${chatId}`);
        await ctx.reply("✅ Adicionado! O site será atualizado em ~2 minutos.");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await ctx.reply(`❌ Erro ao salvar: ${msg.slice(0, 200)}`);
      }
      return;
    }
    const pipeIndex = text.indexOf(" | ");
    const url = pipeIndex > -1 ? text.slice(0, pipeIndex).trim() : text;
    const personalNote = pipeIndex > -1 ? text.slice(pipeIndex + 3).trim() : void 0;
    if (!isValidUrl(url)) {
      await ctx.reply(
        "Manda um link válido\\! Exemplo:\n`https://exemplo.com`\n\nOu com nota pessoal:\n`https://exemplo.com | Minha nota sobre o link`",
        { parse_mode: "MarkdownV2" }
      );
      return;
    }
    await ctx.reply("🔍 Buscando metadados\\.\\.\\.", { parse_mode: "MarkdownV2" });
    try {
      const metadata = await fetchMetadata(url);
      const theme = await classifyTheme(metadata.title, metadata.description);
      const pendingItem = {
        url,
        title: metadata.title,
        description: metadata.description,
        theme,
        personalNote
      };
      await kv.set(`pending:${chatId}`, pendingItem, { ex: 3600 });
      await ctx.reply(
        `📌 *${escapeMarkdown(metadata.title)}*

Tema identificado: *${escapeMarkdown(theme)}*

Responda ✅ para confirmar ou escreva o tema correto\\.`,
        { parse_mode: "MarkdownV2" }
      );
    } catch {
      await ctx.reply("❌ Não consegui acessar esse link\\. Tente outro\\.", {
        parse_mode: "MarkdownV2"
      });
    }
  });
  return bot;
}
const POST = async ({ request }) => {
  try {
    const update = await request.json();
    const bot = createBot();
    await bot.init();
    await bot.handleUpdate(update);
    return new Response("OK", { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
