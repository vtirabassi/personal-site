import type { APIRoute } from 'astro';
import { Bot, webhookCallback } from 'grammy';
import { kv } from '@vercel/kv';
import { fetchMetadata } from '../../lib/fetch-metadata';
import { classifyTheme } from '../../lib/classify-theme';
import { addLibraryItem } from '../../lib/github-api';
import { slugify, inferType } from '../../lib/slugify';
import type { LibraryItem } from '../../lib/library-schema';

export const prerender = false;

interface PendingItem {
  url: string;
  title: string;
  description: string;
  theme: string;
  personalNote?: string;
}

function isValidUrl(text: string): boolean {
  try {
    const parsed = new URL(text);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

function createBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');

  const bot = new Bot(token);

  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text.trim();
    const chatId = String(ctx.chat.id);
    const pending = await kv.get<PendingItem>(`pending:${chatId}`);

    if (pending) {
      const isConfirm =
        text === '✅' ||
        text.toLowerCase() === 'sim' ||
        text.toLowerCase() === 'confirma';
      const theme = isConfirm ? pending.theme : text;

      const item: LibraryItem = {
        id: slugify(pending.title),
        title: pending.title,
        url: pending.url,
        type: inferType(pending.url),
        theme,
        description: pending.description,
        personalNote: pending.personalNote,
        addedAt: new Date().toISOString().split('T')[0],
      };

      try {
        await addLibraryItem(item);
        await kv.del(`pending:${chatId}`);
        await ctx.reply('✅ Adicionado! O site será atualizado em ~2 minutos.');
      } catch {
        await ctx.reply('❌ Erro ao salvar. Tente novamente.');
      }
      return;
    }

    const pipeIndex = text.indexOf(' | ');
    const url = pipeIndex > -1 ? text.slice(0, pipeIndex).trim() : text;
    const personalNote = pipeIndex > -1 ? text.slice(pipeIndex + 3).trim() : undefined;

    if (!isValidUrl(url)) {
      await ctx.reply(
        'Manda um link válido\\! Exemplo:\n`https://exemplo.com`\n\nOu com nota pessoal:\n`https://exemplo.com | Minha nota sobre o link`',
        { parse_mode: 'MarkdownV2' }
      );
      return;
    }

    await ctx.reply('🔍 Buscando metadados\\.\\.\\.', { parse_mode: 'MarkdownV2' });

    try {
      const metadata = await fetchMetadata(url);
      const theme = await classifyTheme(metadata.title, metadata.description);

      const pendingItem: PendingItem = {
        url,
        title: metadata.title,
        description: metadata.description,
        theme,
        personalNote,
      };

      await kv.set(`pending:${chatId}`, pendingItem, { ex: 3600 });

      await ctx.reply(
        `📌 *${escapeMarkdown(metadata.title)}*\n\nTema identificado: *${escapeMarkdown(theme)}*\n\nResponda ✅ para confirmar ou escreva o tema correto\\.`,
        { parse_mode: 'MarkdownV2' }
      );
    } catch {
      await ctx.reply('❌ Não consegui acessar esse link\\. Tente outro\\.', {
        parse_mode: 'MarkdownV2',
      });
    }
  });

  return bot;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const bot = createBot();
    const handler = webhookCallback(bot, 'fetch');
    return await handler(request);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
