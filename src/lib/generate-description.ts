import Anthropic from '@anthropic-ai/sdk';

export async function generateDescription(title: string, url: string): Promise<string> {
  const client = new Anthropic();

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: `Escreva uma descrição curta (máximo 2 frases, ~120 caracteres) para o recurso abaixo. Responda APENAS com a descrição, sem explicação.\n\nTítulo: ${title}\nURL: ${url}`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Unexpected response from Claude API');
  }

  return textBlock.text.trim();
}
