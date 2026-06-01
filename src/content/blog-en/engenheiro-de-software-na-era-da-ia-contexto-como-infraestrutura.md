---
title: "The Software Engineer in the Age of AI: What Silicon Valley Already Understands and Brazil Still Doesn't"
date: 2026-05-29
description: "AI won't give you autonomy you don't have. It will amplify the leverage you already have. And the main leverage of the modern engineer isn't code speed it's context."
tags: ["ai", "engineering", "productivity", "career"]
---

---

In March 2024, Shopify fired 20% of its engineers. At the same time, it doubled its product output.

It wasn't magic. It was the consequence of a shift that the best tech teams in the world had already understood and that most Brazilian companies still ignore: **the leverage point of the software engineer has moved.**

For years, the leverage was execution: how many stories the team delivered per sprint, how many lines of code were produced, how many tickets closed per week. The entire process daily, refinement, review existed to coordinate that execution.

With AI accelerating execution, this model no longer makes sense. The bottleneck stopped being "how many hands do I have" and became "how good is the scope those hands receive."

In this article I explain what changed, why context became infrastructure and what you can start doing this week.

---

## 1. Smaller teams, more autonomous and with mixed roles

For years, the standard model of a product team looked something like this:

**PM → Designer → Tech Lead → 6 to 8 engineers**

Clear hierarchy. Well-defined specialties. Handoffs between areas. The engineer received the refined ticket, developed, passed to QA. Everyone in their own box.

This model worked well **as long as the main constraint was execution**. The process sprint, refinement, daily, retro existed to compensate for lack of individual autonomy. The more people in the loop, the more ceremony to ensure alignment.

The problem: this model assumes that execution is expensive and slow. In the age of AI, that's no longer true.

### What the Valley is doing differently

Companies like Anthropic, Coinbase, and dozens of AI-native startups are operating with squads of **5 to 6 people** and with a radically different composition:

**2 Engs + Data Scientist + Designer + PM**

No dedicated Tech Lead in the early years. With explicit role blurring: PMs who open PRs, engineers who make design decisions, GTM Engineers who mix development with marketing and sales.

Anthropic has a documented policy: **every manager starts as IC**. They spend 20% of the time writing code. The criterion for leadership isn't how many people you manage it's how much you do real dogfooding of the product.

At Coinbase, the same principle: 20% of technical leadership time dedicated to direct execution, not management.

The 6-month roadmap lost usefulness. The model is Just In Time planning: clear strategic north, decisions made close to execution, prototyping before any detailed specification.

**The ratio of people per team changed because the leverage changed.** With AI accelerating execution, the bottleneck stopped being "how many hands do I have" and became "what is the scope of work those hands receive."

---

## 2. Context as infrastructure the least discussed insight

Here's the point I consider most important and the least apparent in discussions about AI in tech.

> **The developer with the most leverage isn't the one who writes the most code. It's the one who has the most instrumented context.**

What does that mean in practice?

Think about how most engineers receive work today:

- A pre-formatted ticket that went through PM, PO, and Tech Lead
- Without direct access to analytics that data is with the PM
- Without conversation with whoever raised the requirement
- Business context exists, but is scattered in other people's heads

Now think about what happens when you put AI in that scenario:

**You deliver faster the wrong thing.**

AI amplifies execution speed. But if the scope is wrong, you got to the wrong place faster. It's like turbocharging a car with the GPS pointing to the wrong address.

### What is instrumented context, concretely?

The engineer with instrumented context has direct access to:

- **Analytics** can query usage data without depending on the PM
- **Database replica** before writing a line, runs queries to understand real volumetry, patterns, and edge cases
- **Aggregated user feedback** doesn't need a meeting to know what the customer is complaining about
- **Logs and error data** can correlate user behavior with technical failures

With this setup, the question changes completely. Instead of *"how should this feature be?"*, the engineer asks the agent: *"how many users have more than 500 items in history?"* and the architectural decision about pagination, indexing, or caching comes out based on real data, not guesswork.

**Instrumented context isn't about writing code faster. It's about making better decisions before writing any code.**

---

## 3. The real gap and why it's not lack of tools

Let me be direct: the gap between Brazil and Silicon Valley isn't about access to tools.

Copilot, Cursor, Claude any engineer in Brazil can use them today. **The gap isn't tools. It's autonomy and context.**

### What the typical workday looks like in Brazil

- Refined ticket that went through PM, PO, and Tech Lead the engineer executes, doesn't decide
- Without direct access to metrics or business data
- Without contact with whoever raised the requirement
- The engineer doesn't know which business number the feature they're building intends to move
- AI will speed up the code but within the wrong scope

### What the typical workday looks like at AI-native companies

- Direct access to analytics and production data as routine
- Conversations with PM, designers, and customers are part of the engineer's routine
- Autonomy to propose and prioritize features not just execute
- Business context available via agent before any technical decision
- Result: AI amplifies real leverage, not speed within the wrong scope

The difference isn't 10%. It's **1 to 2 years of competitive advantage** that accumulates silently with each product cycle.

### The most honest point I can make

> **Whoever only receives tickets will deliver code faster but trapped in the same scope.**

AI won't give you autonomy you don't have. It won't give you access to data the PM guards. It won't put you in a meeting with a stakeholder if nobody invites you.

What it will do is amplify the leverage you already have. If your leverage is small execution within a well-defined scope you'll execute faster within that scope. If your leverage is big you have context, autonomy, access to data it will multiply that.

---

## 4. What to do starting this week

You won't transform your company's culture overnight. Trying to do everything at once is the fastest path to burnout without results.

But you can start with four concrete moves:

### 1. Ask for access to analytics and production data

Not as an occasional exception, but as a standard work tool. Understanding the queries the PM uses to make decisions is the first step to making those decisions together and defending your own technical perspective with data.

### 2. Talk to a stakeholder before coding

On the next feature, before opening the editor, schedule 20 minutes with whoever raised the requirement. Ask directly: *"what business metric does this feature intend to move?"* You'll be surprised how much that changes the scope of what you'll build.

### 3. Instrument context in your AI

Explore tools like MCPs connected to the database, error logs and user feedback integrated into your agent. The goal isn't to have more features in Cursor it's to be able to ask business questions before making technical decisions.

### 4. Guide, don't push

If you're senior or tech lead, we're cultural change agents but that change doesn't happen by decree. It happens in small consistent steps. Demonstrate the model, document the result, invite the team to replicate. Within three to six months of steady improvement, the result appears and becomes hard to ignore.

---

## Conclusion

The model of large teams with specialty silos and processes that compensate for lack of autonomy was designed for a world where execution was the bottleneck. That world is over.

The new leverage is context. Smaller teams, with mixed roles and direct access to the real problem, can use AI in a way that amplifies product scope not just code speed.

Brazil has the engineers. It has the tools. What's missing is autonomy and instrumented context.

**Start this week.**