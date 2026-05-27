import Anthropic from '@anthropic-ai/sdk';

export async function classifyTheme(title: string, description: string): Promise<string> {
  const client = new Anthropic();

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 50,
    messages: [
      {
        role: 'user',
        content: `Classifique este recurso em um tema de 1 a 3 palavras em português. Responda APENAS com o tema, sem explicação.\n\nTítulo: ${title}\nDescrição: ${description}`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Unexpected response from Claude API');
  }

  return textBlock.text.trim();
}
