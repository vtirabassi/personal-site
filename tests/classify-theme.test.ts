import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@anthropic-ai/sdk');

import Anthropic from '@anthropic-ai/sdk';
import { classifyTheme } from '../src/lib/classify-theme';

let mockCreate: any;

beforeEach(() => {
  mockCreate = vi.fn();
  (Anthropic as any).mockImplementation(() => ({
    messages: { create: mockCreate },
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('classifyTheme', () => {
  it('returns the theme text from Claude response', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'Machine Learning' }],
    });
    const theme = await classifyTheme('Attention Is All You Need', 'Original Transformer paper');
    expect(theme).toBe('Machine Learning');
  });

  it('trims whitespace from the response', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '  Engenharia de Software  ' }],
    });
    const theme = await classifyTheme('Clean Code', 'Writing maintainable code');
    expect(theme).toBe('Engenharia de Software');
  });

  it('calls Claude with title and description in the prompt', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'DevOps' }],
    });
    await classifyTheme('Docker Compose Guide', 'Setting up containers');
    const call = mockCreate.mock.calls[0][0];
    expect(call.messages[0].content).toContain('Docker Compose Guide');
    expect(call.messages[0].content).toContain('Setting up containers');
  });
});
