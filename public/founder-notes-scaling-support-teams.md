# Founder Notes: What Actually Breaks When You Scale a Support Team

*Practical commentary on outsourcing, finance operations, growth systems, and offshore strategy.*

I've rebuilt support functions three times now — once from 2 people to 40, once from a single in-house team to a hybrid onshore/offshore model, and once after a botched outsourcing decision that I had to unwind in under 90 days. The patterns repeat. Here's what I wish someone had told me before the first rebuild.

---

## 1. Headcount isn't the bottleneck. Decision rights are.

The instinct when volume goes up is to hire. That's correct, eventually — but it's rarely the first constraint you hit. The first constraint is almost always: **who is allowed to make what call, without escalating.**

At 5 tickets a day, your best rep just knows what to do. At 500 a day, "just knowing" becomes a liability, because now you have inconsistent judgment multiplied across a team, and every edge case routes up to you or your ops lead. You haven't scaled support — you've scaled a bottleneck with more people standing behind it.

The fix isn't a bigger team. It's a **decision tier system**, something like:

- **Tier 1 — Autonomous:** Refunds under $50, standard policy exceptions, known bugs with documented workarounds. Rep resolves, no sign-off.
- **Tier 2 — Judgment call, logged:** Anything outside policy but low financial exposure. Rep resolves but flags it in a shared log reviewed weekly, not in real time.
- **Tier 3 — Escalation required:** Legal exposure, PR risk, anything over a dollar threshold you set explicitly.

Write the thresholds down. Put actual numbers on them. "Use good judgment" is not a policy — it's an invitation to escalate everything, which is what kills founders who try to scale support without first scaling decision-making.

---

## 2. The build vs. outsource decision is a finance question before it's an ops question

Founders tend to frame this as "can I trust an outsourced team with my customers." That's the wrong first question. The right first question is: **what is your fully loaded cost per resolved ticket, in-house, today — including management overhead, tooling, benefits, and attrition-driven rehiring?**

Most founders don't know this number. They know salary. They don't know:

- Recruiting and ramp cost amortized over average tenure
- Manager time spent on QA and coaching (this is real cost, it's just invisible because it's a fraction of someone's salaried time)
- Tooling and seat licenses per agent
- The cost of the inevitable bad hire and the 60–90 days it takes to identify and replace them

Once you actually calculate fully loaded cost per ticket, the outsourcing conversation changes completely. In most cost structures I've seen, a well-managed offshore team lands at **35–55% of fully loaded onshore cost** for comparable tiered-1/tier-2 work. That's not a reason to outsource everything — it's a reason to be precise about *which* tiers of work justify the premium of keeping in-house, and which don't.

**The rule I use now:** anything that's primarily judgment-and-relationship (VIP accounts, anything touching churn risk on your top 20% of revenue) stays onshore or with your most senior people, regardless of cost. Anything that's primarily process-and-volume (password resets, order status, standard refund flows) is a candidate for offshore almost immediately, because the variance in outcome quality between a well-trained offshore agent and a well-trained onshore agent on that kind of ticket is close to zero.

---

## 3. Offshore doesn't fail because of location. It fails because of documentation debt.

I've seen founders blame an offshore team for problems that were actually caused by the founder's own team never having written anything down. If your only playbook lives in your head, or in three years of Slack threads, no team — onshore or offshore — can execute consistently against it.

Offshore just exposes this faster, because you don't have the informal hallway conversations that were quietly patching the gaps in your documentation. Remove the hallway, and the gaps show up as tickets handled inconsistently, or escalated when they shouldn't be.

Before you outsource a single ticket, you need:

- A **living playbook** per ticket category — not a wiki nobody updates, but something tied to actual ticket volume, reviewed monthly against real cases
- **Explicit exception logs** — every time a rep does something not in the playbook, that gets captured, reviewed, and either becomes a new rule or gets flagged as a one-off
- A **single source of truth** for policy, so support isn't referencing three different versions of a refund policy that finance, legal, and the founder each think is current

This is unglamorous work. It is also the actual bottleneck 90% of the time a scaling attempt stalls — not headcount, not location, not tooling.

---

## 4. Your support metrics are probably measuring the wrong thing

Most teams optimize for **first response time** and **resolution time**, because those are easy to pull from a dashboard. Neither one tells you whether the customer's actual problem got solved, or whether it's going to come back in three weeks as a bigger problem — a refund, a churn, a public complaint.

The metric that actually predicts retention and revenue impact is closer to: **first-contact resolution rate on issues that matter, segmented by customer value tier.** A ticket resolved fast but wrong isn't a win, it's a delayed loss with extra steps.

If you're scaling and outsourcing at the same time, insist on this segmentation from day one:

| Segment | What you track | Why |
|---|---|---|
| Top 10–20% of revenue accounts | First-contact resolution, escalation rate, NPS delta pre/post ticket | This is where churn risk lives disproportionately |
| Standard/high-volume tickets | Speed, cost per ticket, CSAT | This is where cost efficiency matters most |
| New/edge-case issues | Time to playbook update | This tells you if your documentation is keeping pace with reality |

Blending all of this into one dashboard-wide CSAT score is how founders miss the fact that their high-value customers are quietly getting worse service while the average looks fine.

---

## 5. The transition period is where scaling attempts actually die

Nobody plans for the messy middle — the 60–90 days where you're running old and new processes in parallel, half your team is trained on the new system and half isn't, and ticket volume doesn't pause to let you catch up.

What's worked for me:

- **Never fully cut over on day one.** Run the new team or process on a defined slice of volume (I usually start at 15–20%) for 2–3 weeks before expanding. This limits blast radius if something's wrong with the playbook, not the people.
- **Shadow period is non-negotiable**, even when it feels slow. New team members — onshore or offshore — should be resolving real tickets under supervision, with a senior person reviewing outcomes, not just watching in real time. Real-time shadowing catches almost nothing; retrospective review of actual resolutions catches almost everything.
- **Budget for a temporary quality dip.** If your CSAT doesn't move at all during a transition, you're probably not actually changing anything meaningful. A small, bounded, temporary dip that recovers within a defined window is a sign you're executing a real transition, not evidence that the plan failed.

---

## 6. The org chart question nobody wants to answer: who owns the outsourced team's output?

This is the one that gets skipped constantly, and it's the one that determines whether outsourcing quietly degrades your product over 12 months or actually strengthens it.

If the outsourced team reports into "ops" generally, with no single named owner accountable for their ticket quality, escalation patterns, and playbook currency — quality drift is guaranteed. Not because the agents are bad, but because nobody's job depends on catching the drift early.

Name one person. Give them the escalation logs, the CSAT-by-tier data, and the playbook update cadence as their actual job, not a side responsibility. This is the single highest-leverage org design decision in the entire scaling process, and it costs nothing to implement.

---

## The short version

If I had to compress three rebuilds into four sentences for a founder about to scale support:

1. Fix decision rights before you add headcount — more people executing bad judgment just multiplies the problem.
2. Know your real fully-loaded cost per ticket before you decide whether to outsource anything.
3. Documentation debt, not location, is what makes offshore transitions fail.
4. Segment your metrics by customer value, run transitions in slices, and name a single owner for outsourced quality — or don't be surprised when nobody notices the drift until it shows up in churn.

None of this is exotic. It's just the stuff that's easy to skip when volume is growing faster than your process, and expensive to fix after the fact.
