---
title: "Design Spec: Artigo — GitHub Copilot virou pay-per-token"
date: 2026-06-05
status: approved
---

## Contexto

GitHub Copilot migrou de mensalidade fixa para cobrança por tokens (AI Credits) em 1 de junho de 2026. A mudança gerou backlash expressivo na comunidade (904 downvotes vs. 22 upvotes no fórum oficial). O artigo tem utilidade dupla: publicação no blog pessoal + compartilhamento interno com o time técnico.

## Objetivo

Leitores saem do artigo sabendo exatamente o que mudou, por que sessões agênticas são caras, e com um plano concreto para otimizar — incluindo instalação dos plugins caveman e RTK.

## Audiência

Engenheiros e tech leads que usam GitHub Copilot no dia a dia. Nível técnico: pode consumir comandos de terminal, exemplos de antes/depois e tabelas.

## Abordagem narrativa

**Problema → Mecânica → Solução.** Abre com um cenário concreto (sessão agêntica consome 35 créditos em 20 minutos) para o leitor sentir o problema antes de receber a solução. Tom: direto, sem alarmismo, prático.

---

## Estrutura

### Abertura — O cenário concreto
Você abre um repo grande, pede ao agente para entender a arquitetura e propor um refactor. 20 minutos depois ele terminou. O que você ainda não sabe: consumiu 35 dos seus 1.000 créditos mensais do plano Pro ($10/mês). Repita 4x na semana e você chega em meados do mês sem créditos para sessões avançadas.

Objetivo da abertura: criar identificação antes de explicar. Sem parágrafo de introdução genérico.

### Seção 1 — O que mudou (e quando)
- Data efetiva: 1 de junho de 2026
- Substituição de Premium Request Units (PRUs) por AI Credits (1 crédito = $0,01)
- **O que NÃO consome créditos:** code completion inline, Next Edit suggestions
- **O que CONSOME créditos:** chat, modo agente, sessões longas, revisão de PR com Copilot
- Tabela rápida com os dois grupos
- Preços dos planos não mudaram (Pro $10, Pro+ $39, Business $19/user, Enterprise $39/user) mas a franquia de créditos agora é equivalente ao valor do plano — sem buffer extra

### Seção 2 — A mecânica de créditos
- Tokens de entrada + saída + cached tokens → convertidos em créditos pelo rate do modelo usado
- Por que modo agente é caro: uma task = múltiplas chamadas encadeadas (leitura de arquivos, execução, iteração)
- Número concreto: sessão agêntica de 20min num repo médio = 30–40 créditos
- Comparação de custo por modelo (modelos frontier vs. modelos "mini/leves")
- Quando os créditos acabam: uso avançado é pausado; sem fallback automático para modelo mais barato (diferença do modelo anterior)

### Seção 3 — Estratégias comportamentais
Quatro hábitos com impacto direto na conta:

1. **Prompts hiper-específicos:** fornecer arquivo de referência, objetivo e formato esperado. Evitar perguntas abertas que geram vai-e-vem.
2. **Escopo antes de delegar ao agente:** definir o que o agente deve fazer antes de iniciar, não durante. Interrupções e reorientações no meio da sessão custam tokens.
3. **Alternar modelos por complexidade:** tarefas rotineiras (explicar código, gerar testes unitários simples) → modelo leve. Refatoração arquitetural, análise de codebase → modelo robusto.
4. **Não deixar agente rodando sem supervisão:** especialmente em repos grandes. Sessão aberta sem escopo claro consome créditos em loop.

### Seção 4 — Mini-guia: RTK
**O que é:** CLI proxy open-source escrito em Rust que intercepta outputs de comandos de terminal (git, npm, cargo, docker etc.) antes de chegarem ao contexto do LLM, comprimindo-os.

**Como funciona:** RTK executa o comando, filtra ruído, agrupa itens similares, trunca e deduplica — entregando ao agente só o que importa.

**Instalação (2 comandos):**
```bash
brew install rtk
rtk init -g   # ativa o hook global que intercepta comandos automaticamente
```

**Exemplo antes/depois:**
- `git status` padrão → centenas de linhas com arquivos listados individualmente
- `rtk git status` → sumário agrupado por diretório, fração dos tokens

**Dado de referência:** Rafael Pazini economizou 5,3 milhões de tokens em 612 comandos sem mudar uma linha de código (artigo: dev.to/rflpazini/rtk-...).

**Quando usar RTK:** qualquer sessão que envolva comandos de terminal — builds, testes, git, logs de container.

### Seção 5 — Mini-guia: Caveman
**O que é:** skill/plugin para Claude Code e 30+ agentes que comprime os outputs do próprio agente usando linguagem telegráfica, mantendo precisão técnica.

**Como funciona:** instala uma skill que aplica regras de compressão ao output — "drop filler, keep substance, use fragments". Reduz output tokens do agente em ~65%.

**Instalação:** ler o comando exato do README em github.com/JuliusBrussee/caveman antes de escrever o artigo — varia por agente. Para Claude Code, verificar se é um skill instalável via `npx` ou arquivo de configuração manual.

**Exemplo antes/depois:**
- Resposta normal: "The reason your React component is re-rendering is likely because you're creating a new object reference each render cycle..."
- Caveman: "New object ref each render...wrap in `useMemo`" — mesma solução, 73% menos tokens

**Níveis disponíveis:** lite, full (padrão), ultra

**Quando usar Caveman:** sessões de chat e agente longo onde o volume de texto nas respostas é alto. Complementa RTK (RTK age nos inputs vindos de CLI; Caveman age nos outputs do agente).

**Repositório:** github.com/JuliusBrussee/caveman

### Seção 6 — Configurar orçamento no painel
- Onde acessar: GitHub Settings → Copilot → Usage & billing
- Como configurar limite mensal e alertas de gasto
- Diferença de controle: plano individual (limite pessoal) vs. org/enterprise (budget por equipe ou cost center)
- Recomendação: setar alerta a 70% da cota para ter tempo de ajustar comportamento antes de pausar

### Conclusão
Code completion continua gratuito — a IA no editor do dia a dia não mudou. O que mudou é o custo de usar agentes com autonomia ampla. Com os hábitos certos e as ferramentas certas (RTK + Caveman), é possível manter o benefício dos agentes sem deixar a conta explodir.

---

## Restrições de conteúdo

- Não citar números de backlash extremos ($29 → $750) para não soar alarmista — o foco é solução
- Manter tom neutro em relação ao GitHub: a mudança é legítima, o problema é usar agentes sem consciência de custo
- Incluir links reais para repositórios (caveman, rtk) e para o artigo do dev.to
- Seguir convenção do blog: artigo em PT em `src/content/blog/`, versão EN em `src/content/blog-en/` com mesmo slug

## Arquivos a criar

- `src/content/blog/github-copilot-pay-per-token.md`
- `src/content/blog-en/github-copilot-pay-per-token.md`
