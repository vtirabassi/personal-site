---
title: "GitHub Copilot virou pay-per-token: como não levar um susto na fatura"
date: 2026-06-05
description: "Em 1 de junho de 2026 o Copilot trocou mensalidade fixa por cobrança por tokens. Entenda o que mudou e saia com um plano concreto para não esgotar seus créditos a meio do mês."
tags: ["ia", "produtividade", "ferramentas", "engenharia"]
---

Você abre um repositório grande, pede ao agente do Copilot para entender a arquitetura e propor um refactor. Vinte minutos depois, ele terminou. Você fecha a sessão satisfeito.

O que você ainda não sabe: acabou de consumir 35 dos seus 1.000 créditos mensais. No plano Pro, isso é $0,35 do seu orçamento de $10. Com 1.000 créditos no plano Pro, você tem margem para cerca de 28 sessões assim por mês — pouco mais de uma por dia útil.

Em 1 de junho de 2026, o GitHub migrou o Copilot de mensalidade fixa para cobrança por tokens via **GitHub AI Credits**. Se você usa agentes, isso muda a conta. Este artigo explica o que mudou, por que sessões agênticas são caras, e deixa você com um plano concreto para sair na frente.

---

## O que mudou (e quando)

A mudança substituiu os antigos Premium Request Units (PRUs) por **GitHub AI Credits**. A regra: 1 crédito = $0,01. Cada token processado — entrada, saída e tokens em cache — é convertido em créditos usando o rate do modelo escolhido.

O que **não** muda: code completion inline (as sugestões enquanto você digita) e Next Edit suggestions continuam gratuitos em todos os planos.

O que **passa a custar**:

| Recurso | Consome créditos? |
|---|---|
| Code completion inline | Não |
| Next Edit suggestions | Não |
| Chat (perguntas simples) | Sim |
| Modo agente (Agent Mode) | Sim |
| Sessões longas com ferramentas | Sim |
| Copilot Code Review em PRs | Sim |

Os preços dos planos não mudaram:

| Plano | Preço | Créditos/mês |
|---|---|---|
| Copilot Pro | $10/mês | $10 |
| Copilot Pro+ | $39/mês | $39 |
| Copilot Business | $19/usuário/mês | $19/usuário |
| Copilot Enterprise | $39/usuário/mês | $39/usuário |

O detalhe que assusta: antes havia um buffer. Agora a franquia de créditos equivale exatamente ao valor do plano — sem sobra. Quando os créditos acabam, o uso avançado pausa até o próximo ciclo. **Não há fallback automático para modelo mais barato.**

---

## Por que sessões agênticas são caras

A conta funciona assim: cada chamada ao modelo soma tokens de entrada (o contexto enviado) + tokens de saída (a resposta gerada) + tokens em cache. Esse total é multiplicado pelo rate do modelo e convertido em créditos.

O modo agente é caro porque uma única tarefa envolve várias chamadas encadeadas:

1. O agente lê o arquivo relevante
2. Executa um comando e recebe o output
3. Decide o próximo passo
4. Escreve o código
5. Verifica se funcionou
6. Itera se necessário

Cada etapa é uma chamada separada ao modelo. Uma sessão de 20 minutos num repositório médio pode consumir entre 30 e 40 créditos. Com um plano Pro de $10 (1.000 créditos), você tem margem para cerca de 25 a 30 sessões assim por mês — menos de uma por dia útil.

Modelos mais pesados (frontier models) consomem créditos mais rápido. **A escolha do modelo é a alavanca de custo mais direta que você tem.**

---

## Quatro hábitos que reduzem a conta

**1. Escopo antes de delegar**
Defina o que o agente deve fazer *antes* de iniciar a sessão. Reorientações no meio do caminho custam tokens: o agente recapitula o contexto, descarta trabalho e reinicia. Uma instrução clara no início vale mais do que dez correções durante.

**2. Prompts hiper-específicos**
Forneça arquivo de referência, objetivo e formato esperado. "Refatora o módulo de autenticação" é caro. "Extrai a validação de JWT de `src/auth/middleware.ts` para uma função pura em `src/auth/jwt.ts` sem mudar a interface" é cirúrgico.

**3. Modelo por complexidade**
Tarefas rotineiras — explicar código, gerar testes unitários simples, renomear variáveis — usam modelo leve. Refatoração arquitetural, análise de codebase grande, debugging complexo — aí vale o modelo robusto. A maioria dos planos deixa você escolher.

**4. Não deixe agente rodando sem supervisão**
Especialmente em repos grandes. Uma sessão aberta sem escopo claro consome créditos em loop. Se você vai se afastar, pause a sessão.

---

## RTK e Caveman: ferramentas complementares, não substitutas

Antes de instalar qualquer coisa, vale entender por que as duas atuam em camadas diferentes — e por que empilhá-las faz mais sentido do que escolher uma.

**RTK opera na camada de entrada.** Ele intercepta os outputs de comandos de terminal (git, npm, cargo, docker etc.) *antes* de chegarem ao contexto do modelo. O agente recebe um input mais compacto e denso. A economia vem do que o modelo *vê*.

**Caveman opera na camada de saída.** Ele não modifica o contexto, mas constrange *como* o modelo expressa a resposta — linguagem telegráfica, sem rodeios, sem formalidades. A economia vem do que o modelo *escreve*.

**O efeito cumulativo:** em workflows agênticos, cada output vira contexto da próxima iteração. Respostas mais curtas do Caveman significam contexto menor nas rodadas seguintes. O benefício propaga para frente.

| | RTK | Caveman |
|---|---|---|
| **Foco** | Tokens de **entrada** | Tokens de **saída** |
| **Camada** | Execução (filtra antes do modelo) | Geração (constrange durante a resposta) |
| **Como age** | Proxy CLI que comprime output de terminal | Skill que instrui o agente a ser telegráfico |
| **Economia típica** | 60–90% nos outputs de terminal | ~65% nas respostas do agente |
| **Quando usar** | Sessões com muitos comandos | Sessões de chat/agente com respostas longas |
| **Repositório** | [github.com/rtk-ai/rtk](https://github.com/rtk-ai/rtk) | [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) |

---

## Mini-guia: RTK

RTK é um proxy CLI open-source escrito em Rust. Quando o agente executa um comando de terminal, o RTK intercepta o output, filtra ruído, agrupa itens similares e entrega ao modelo só o que importa.

**Instalação:**
```bash
brew install rtk
rtk init -g
```

O segundo comando ativa um hook global que intercepta comandos automaticamente — você não precisa prefixar manualmente.

**Antes e depois:**

Sem RTK, um `git status` num repositório médio retorna dezenas de linhas listando cada arquivo modificado individualmente, incluindo caminhos completos, status de staging e metadados. Com RTK, você recebe um sumário agrupado por diretório com contagem de arquivos — uma fração dos tokens.

O mesmo vale para `npm test` ou `./gradlew test`: testes que passam desaparecem, falhas aparecem completas. Rafael Pazini documentou 5,3 milhões de tokens economizados em 612 comandos — sem mudar uma linha de código. Veja o relato completo em [dev.to/rflpazini](https://dev.to/rflpazini/rtk-como-economizei-53-milhoes-de-tokens-sem-mudar-uma-linha-de-codigo-5e1m).

---

## Mini-guia: Caveman

Caveman é uma skill instalável para Claude Code e mais de 30 agentes. Ela instrui o modelo a responder de forma telegráfica — cortando saudações, explicações longas e formalidades — mantendo toda a precisão técnica.

**Instalação (macOS/Linux):**
```bash
curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash
```

Requer Node.js 18+. O script detecta automaticamente quais agentes você tem instalados.

**Ativação no Claude Code:**
```
/caveman
```

Ou simplesmente escreva "talk like caveman" na sessão.

**Antes e depois:**

> Sem caveman: "The reason your React component is re-rendering is likely because you're creating a new object reference on every render cycle. To fix this, you should wrap the object creation in a `useMemo` hook, which will memoize the value and prevent unnecessary re-renders."

> Com caveman: "New object ref each render. Wrap in `useMemo`."

Mesma solução. 73% menos tokens.

**Níveis disponíveis:** `lite`, `full` (padrão) e `ultra`. Use `/caveman-stats` para acompanhar a economia acumulada.

---

## Configurar orçamento no painel

Mesmo com os hábitos certos e as ferramentas instaladas, é bom ter um limite explícito para não ter surpresas no fim do mês.

**Como configurar:**
1. Acesse **GitHub Settings → Copilot → Usage & billing**
2. Defina um limite mensal de gastos
3. Configure alertas (recomendo setar a 70% da cota — você ainda tem margem para ajustar o comportamento antes de pausar)

**Planos individuais** têm controle pessoal. **Planos Business e Enterprise** permitem controle por equipe ou cost center — útil para times que compartilham uma cota corporativa.

---

## Conclusão

Code completion continua gratuito — a IA no editor do dia a dia não mudou. O que mudou é o custo de usar agentes com autonomia ampla e sem escopo definido.

A boa notícia: a maior parte da economia vem de comportamento, não de ferramenta. Prompts claros, escopo antes de delegar e escolha consciente de modelo já resolvem boa parte do problema. RTK e Caveman atacam o que sobra nas camadas de input e output.

Empilhados, os ganhos se multiplicam. E você continua com o benefício dos agentes sem deixar a conta explodir.
