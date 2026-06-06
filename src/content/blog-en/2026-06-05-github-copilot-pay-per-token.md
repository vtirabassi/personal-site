---
title: "GitHub Copilot switched to pay-per-token: how to avoid bill shock"
date: 2026-06-05
description: "On June 1, 2026, Copilot replaced flat-rate billing with token-based AI Credits. Here's what changed and a concrete plan to stop burning through your monthly allowance."
tags: ["ai", "productivity", "tools", "engineering"]
---

You open a large repository and ask the Copilot agent to understand the architecture and propose a refactor. Twenty minutes later, it's done. You close the session satisfied.

What you don't know yet: you just burned 35 of your 1,000 monthly credits. On the Pro plan, that's $0.35 of your $10 budget. With 1,000 credits on the Pro plan, you have room for about 28 sessions like this per month, a little over one per working day.

On June 1, 2026, GitHub migrated Copilot from flat-rate billing to token-based billing via **GitHub AI Credits**. If you use agents, this changes the math. This article explains what changed, why agentic sessions are expensive, and leaves you with a concrete plan to stay ahead.

---

## What changed (and when)

The update replaced the old Premium Request Units (PRUs) with **GitHub AI Credits**. The rule is simple: 1 credit = $0.01. Every token processed (input, output, and cached tokens) is converted into credits using the rate for the model you're using.

What does **not** change: inline code completions (the suggestions as you type) and Next Edit suggestions remain free across all plans.

What **now costs credits**:

| Feature | Consumes credits? |
|---|---|
| Inline code completion | No |
| Next Edit suggestions | No |
| Chat (simple questions) | Yes |
| Agent Mode | Yes |
| Long sessions with tools | Yes |
| Copilot Code Review on PRs | Yes |

Plan prices are unchanged:

| Plan | Price | Credits/month |
|---|---|---|
| Copilot Pro | $10/mo | $10 |
| Copilot Pro+ | $39/mo | $39 |
| Copilot Business | $19/user/mo | $19/user |
| Copilot Enterprise | $39/user/mo | $39/user |

The detail that stings: there used to be a buffer. Now the credit allowance equals exactly the plan price, with no cushion. When credits run out, advanced features pause until the next cycle. **There is no automatic fallback to a cheaper model.**

---

## Why agentic sessions are expensive

Here's how the math works: each model call adds up input tokens (the context you send) + output tokens (the generated response) + cached tokens. That total is multiplied by the model's rate and converted into credits.

Agent mode is expensive because a single task involves multiple chained calls:

1. The agent reads the relevant file
2. Executes a command and receives the output
3. Decides the next step
4. Writes the code
5. Checks if it worked
6. Iterates if needed

Each step is a separate model call. A 20-minute session on a medium-sized repo can consume 30–40 credits. With a Pro plan at $10 (1,000 credits), you have room for about 25–30 such sessions per month, fewer than one per working day.

To make this concrete: say you have an authentication bug and ask the agent to investigate.

1. It reads `AuthMiddleware.cs` (first call)
2. Spots a suspicious dependency, opens `JwtValidator.cs` (second call)
3. Runs `dotnet test` to see what's failing (third call)
4. Analyzes the 3 errors and writes the fix (fourth call)
5. Runs the tests again to confirm (fifth call)

Five calls for one simple bug. In each call, the context includes everything read before: both files, test results. The cost grows because the context grows.

**The math behind those ~35 credits:**

Using Claude Sonnet 4.6 as reference ([per-model pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing): input $3.00, output $15.00 per million tokens; [1 credit = $0.01](https://docs.github.com/en/copilot/reference/copilot-billing)):

| | Tokens | Rate | Cost |
|---|---|---|---|
| Input (accumulated context) | 3,000 | $3.00/M | $0.009 |
| Output (model response) | 400 | $15.00/M | $0.006 |
| **Total per call** | | | **~$0.015 = ~1.5 credits** |

A 20-minute session involves 20 to 25 calls. Context grows with each iteration, so the cost per call climbs as the session progresses. Result: 30 to 40 credits.

The part that surprises people: output tokens cost **5x more** than input tokens on Sonnet 4.6 ($15.00 vs $3.00 per million). A model that responds at length is more expensive than it looks.

Heavier models (frontier models) burn credits faster. **Model selection is the most direct cost lever you have.**

---

## Four habits that reduce the bill

**1. Scope before delegating**
Define what the agent should do *before* starting the session. Mid-session corrections are expensive: the agent recaps context, discards work, and restarts. A clear upfront instruction is worth more than ten corrections along the way.

**2. Hyper-specific prompts**
Provide a reference file, objective, and expected format. "Refactor the auth module" is expensive. "Extract JWT validation from `AuthMiddleware.cs` into a static method in `JwtValidator.cs` without changing the interface" is surgical.

**3. Model by complexity**
Routine tasks (explaining code, generating simple unit tests, renaming variables) use a lightweight model. Architectural refactors, large codebase analysis, complex debugging: that's when the frontier model earns its keep. Most plans let you choose.

**4. Don't leave agents running unsupervised**
Especially on large repos. An open session with no clear scope burns credits in a loop. If you're stepping away, pause the session.

---

## RTK and Caveman: complementary tools, not substitutes

Both tools target the same problem but at different moments in the same session. Understanding this avoids the "which one do I pick?" confusion.

**RTK acts before the model processes anything.** When the agent runs a terminal command (`git status`, `dotnet test`, `docker logs`...), RTK intercepts the output and delivers a compressed version to the model. The model gets fewer tokens to read.

**Caveman acts after the model has already processed everything.** It instructs the model to respond concisely: no intro, no padding, just the answer. The model writes fewer tokens.

**The effect that stacks up:** in agentic sessions, what the model *writes* in one step becomes what it *reads* in the next. Fewer output tokens with Caveman means fewer input tokens in the following call. The savings multiply across the session.

| | RTK | Caveman |
|---|---|---|
| **Focus** | **Input** tokens | **Output** tokens |
| **Layer** | Execution (filters before the model) | Generation (constrains during response) |
| **How it works** | CLI proxy that compresses terminal output | Skill that instructs the agent to be terse |
| **Typical savings** | 60–90% on terminal outputs | ~65% on agent responses |
| **When to use** | Sessions with many commands | Sessions with long chat/agent responses |
| **Repository** | [github.com/rtk-ai/rtk](https://github.com/rtk-ai/rtk) | [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) |

---

## Quick guide: RTK

RTK is an open-source CLI proxy written in Rust. When the agent runs a terminal command, RTK intercepts the output, filters noise, groups similar items, and delivers to the model only what matters.

**Installation:**
```bash
brew install rtk
rtk init -g
```

The second command activates a global hook that intercepts commands automatically. No need to manually prefix anything.

**Before and after:**

Without RTK, `git status` on a medium-sized repo returns dozens of lines listing each modified file individually, with full paths, staging status, and metadata. With RTK, you get a directory-grouped summary with file counts, a fraction of the tokens.

The same applies to `dotnet test`: passing tests disappear, failures show up complete. Rafael Pazini documented 5.3 million tokens saved across 612 commands, without changing a single line of code. Read the full account at [dev.to/rflpazini](https://dev.to/rflpazini/rtk-como-economizei-53-milhoes-de-tokens-sem-mudar-uma-linha-de-codigo-5e1m) (in Portuguese).

---

## Quick guide: Caveman

Caveman is an installable skill for Claude Code and 30+ agents. It instructs the model to respond telegraphically: no greetings, no long explanations, no filler, while keeping full technical accuracy.

**Installation (macOS/Linux):**
```bash
curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash
```

Requires Node.js 18+. The script auto-detects which agents you have installed.

**Activation in Claude Code:**
```
/caveman
```

Or just type "talk like caveman" in the session.

**Before and after:**

> Without caveman: "The reason your LINQ query is slow is likely because you're calling `.ToList()` inside the loop, which re-evaluates the query on every iteration. To fix this, you should move the `.ToList()` call outside the loop so the collection is materialized only once."

> With caveman: "`.ToList()` inside loop re-evaluates each iteration. Move it outside."

Same solution. 73% fewer tokens.

**Available levels:** `lite`, `full` (default), and `ultra`. Use `/caveman-stats` to track accumulated savings.

---

## Setting up budget controls

Even with the right habits and tools installed, an explicit spending limit helps avoid end-of-month surprises.

**How to configure:**
1. Go to **GitHub Settings → Copilot → Usage & billing**
2. Set a monthly spending limit
3. Configure alerts (recommended: 70% of your allowance, so you still have room to adjust before things pause)

**Individual plans** have personal controls. **Business and Enterprise plans** allow control per team or cost center, useful for teams sharing a corporate quota.

---

## Conclusion

Inline code completion is still free: the AI in your editor for day-to-day work hasn't changed. What changed is the cost of running agents with broad autonomy and no defined scope.

The good news: most of the savings come from behavior, not tooling. Clear prompts, scope before delegating, and conscious model selection already solve most of the problem. RTK and Caveman handle what's left at the input and output layers.

Stacked, the savings compound. And you keep the benefits of agents without letting the bill get out of hand.
