---
name: humanizar-pagina-sobre
description: Humanizar a página /sobre e /en/about — reescrita da bio, remoção de em dashes, nova seção atlética
metadata:
  type: project
---

# Humanizar página /sobre

## Objetivo

Tornar a página sobre mais pessoal e menos formal, mantendo credibilidade profissional. Aplicar as mesmas mudanças na versão EN (`/en/about/`).

## Mudanças aprovadas

### 1. Bio reescrita (PT)

**Antes:**
> Lidero squads de engenharia em plataformas de missão crítica na XP Inc. — Core Bancário e Core Investimentos, responsáveis pelos fluxos de cash-in e cash-out de toda a operação. Comecei como engenheiro fundador da Conta Digital PJ e hoje gerencio 12 engenheiros distribuídos em 2 squads, em ambiente 24/7 com tolerância zero a falhas.

**Depois:**
> Passei os últimos anos construindo e liderando sistemas críticos na XP Inc. Fui engenheiro fundador da Conta Digital PJ e hoje gerencio 12 engenheiros em 2 squads: Core Bancário e Core Investimentos, responsáveis pelos fluxos de cash-in e cash-out de toda a operação. É um ambiente 24/7 com tolerância zero a falhas.

### 2. Bio reescrita (EN)

**Antes:**
> I lead engineering squads on mission-critical platforms at XP Inc. — Core Banking and Core Investments, responsible for cash-in and cash-out flows across the entire operation. I started as a founding engineer of the Business Digital Account and now manage 12 engineers across 2 squads, in a 24/7 environment with zero tolerance for failure.

**Depois:**
> I've spent the last few years building and leading critical systems at XP Inc. I was a founding engineer of the Business Digital Account and now manage 12 engineers across 2 squads: Core Banking and Core Investments, responsible for cash-in and cash-out flows across the entire operation. It's a 24/7 environment with zero tolerance for failure.

### 3. Remoção dos em dashes (—) nos valores

Substituir `—` por `:` ou `,` conforme o contexto:

**PT:**
- `negócio como fim — todo` → `negócio como fim: todo`
- `contexto — não em controle` → `contexto, não em controle`
- `estratégia — escalabilidade` → `estratégia: escalabilidade`

**EN:**
- `business as the end — every` → `business as the end: every`
- `context — not control` → `context, not control`
- `strategy — scalability` → `strategy: scalability`

### 4. Nova seção "Além do trabalho" / "Beyond work" (ao final, após Formação/Education)

**Estrutura (mesma para PT e EN):**

```
título: "Além do trabalho" / "Beyond work"

parágrafo intro (PT): "Atleta amador apaixonado por treinar. Compito em corrida e triathlon nas horas vagas."
parágrafo intro (EN): "Amateur athlete passionate about training. I compete in running and triathlon in my free time."

itens:
  🏃🏻‍♂️  3× Meia Maratona / 3× Half Marathon  (subtítulo: Corrida de rua / Road running)
  🏊🏼‍♂️🚴🏼‍♂️🏃🏻‍♂️  2× Sprint · 1× Olímpico / 2× Sprint · 1× Olympic  (subtítulo: Triathlon)
```

**Visual:** mesma estrutura da seção Trajetória — lista com ícone/emoji à esquerda, título em semibold, subtítulo em caption.

## Arquivos a modificar

- `src/pages/sobre/index.astro`
- `src/pages/en/about/index.astro`

## Fora do escopo

- Nenhuma mudança em outras páginas
- Nenhuma mudança no design system ou layout geral
