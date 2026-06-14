// Cores distintas para as tags de domínio/tópico das trilhas.
// As strings de classe são mantidas inteiras (não concatenadas) para o
// scanner JIT do Tailwind gerar cada utilitário arbitrário usado aqui.

const PALETTE = [
  'bg-[#ff3b30]/10 text-[#cc1a10] dark:bg-[#ff3b30]/20 dark:text-[#ff6b62]', // red
  'bg-apple-blue/10 text-apple-blue dark:bg-apple-blue/20 dark:text-apple-blue-dark', // blue
  'bg-[#af52de]/10 text-[#7c3aed] dark:bg-[#af52de]/20 dark:text-[#af52de]', // purple
  'bg-[#32ade6]/10 text-[#0a6e8a] dark:bg-[#32ade6]/20 dark:text-[#32ade6]', // cyan
  'bg-[#c8a96e]/10 text-[#7a5c1e] dark:bg-[#c8a96e]/20 dark:text-[#c8a96e]', // gold
  'bg-[#34c759]/10 text-[#1a7a33] dark:bg-[#34c759]/20 dark:text-[#34c759]', // green
  'bg-[#ff9500]/10 text-[#8a5100] dark:bg-[#ff9500]/20 dark:text-[#ff9500]', // orange
  'bg-[#ff2d55]/10 text-[#c01a3a] dark:bg-[#ff2d55]/20 dark:text-[#ff6482]', // pink
  'bg-[#5856d6]/10 text-[#3634a3] dark:bg-[#5856d6]/20 dark:text-[#7d7bef]', // indigo
  'bg-[#30b0c7]/10 text-[#0a6e8a] dark:bg-[#30b0c7]/20 dark:text-[#5ac8db]', // teal
];

const NEUTRAL = 'bg-apple-parchment text-apple-ink-48 dark:bg-[#2c2c2e] dark:text-[#98989d]';

// Cores semânticas dos domínios da trilha CCA Foundation, preservadas.
function semanticDomainClass(name: string): string | null {
  const t = name.toLowerCase();
  if (t.startsWith('prompt'))      return PALETTE[0];
  if (t.startsWith('claude code')) return PALETTE[1];
  if (t.startsWith('agentic'))     return PALETTE[2];
  if (t.startsWith('mcp'))         return PALETTE[3];
  if (t.startsWith('context'))     return PALETTE[4];
  if (t.startsWith('evals'))       return PALETTE[5];
  return null;
}

function hashIndex(s: string, n: number): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % n;
}

// Constrói um mapa por trilha atribuindo a cada domínio uma cor distinta:
// semântica quando se aplica (CCA), senão a próxima cor não usada da paleta.
export function buildDomainColors(names: string[]): Map<string, string> {
  const map = new Map<string, string>();
  const used = new Set<string>();

  // Passo 1: reserva as cores semânticas primeiro para evitar colisão.
  for (const name of names) {
    const key = name.toLowerCase();
    if (map.has(key)) continue;
    const sem = semanticDomainClass(name);
    if (sem) {
      map.set(key, sem);
      used.add(sem);
    }
  }

  // Passo 2: distribui as cores restantes da paleta para os demais domínios.
  for (const name of names) {
    const key = name.toLowerCase();
    if (map.has(key)) continue;
    const color = PALETTE.find(c => !used.has(c)) ?? PALETTE[hashIndex(key, PALETTE.length)];
    map.set(key, color);
    used.add(color);
  }

  return map;
}

// Cor de uma única tag de domínio/tópico. Usa o mapa por trilha quando fornecido
// (para os badges de módulo combinarem com o cabeçalho); senão cai na cor
// semântica ou numa cor da paleta determinística por nome.
export function domainTagClass(name: string, map?: Map<string, string>): string {
  if (!name) return NEUTRAL;
  const key = name.toLowerCase();
  if (map?.has(key)) return map.get(key)!;
  return semanticDomainClass(name) ?? PALETTE[hashIndex(key, PALETTE.length)];
}
