# Working notes

Scratchpad for how Alex wants to be taught, and open threads for the teacher.

## How Alex wants to be taught (from his message, Nov 21)
- Visuals first. Text in ASD-STE100 Simplified Technical English. "-" not long dashes. Sentence-case headings.
- Every concept starts with one line: "what it really solves, instead of what". Then a paragraph, then a diagram. Unwrap like an onion - never all at once.
- 80/20 = most of the needed knowledge fast, per concept. Not "the most popular tools".
- Established knowledge, not hype. Cite sources on the page.
- His methodology file (the attached "Learn Software Delivery and Infrastructure from First Principles"): ubiquitous language, 7 layers, one running example (web app + API + database in a cloud), 7-part structure per concept, one check question at a time, fix a deeper misunderstanding first.

## Carried over from the Argo course (same learner, same method)
Read `../Argo/LEARNING-APPROACH.md` and `../Argo/TASK-DESIGN.md` before building a lesson. Most important rules:
- Every word in a bet is defined earlier on the page (`<dfn>` in "Words you need").
- Story, bet, reveal with a `Why:` line. Bets stand alone.
- Say the look-alike difference everywhere, in the same words.
- "Lost here" boxes. Result lines with Copy buttons are the evidence for learning records.
- Misses come back at 1, 3 and 7 days. Missed twice -> hands-on fix.
- When an answer did not land: a "Wait, what?" re-pitch on the page, plus a 1-day warm-up in new words.
- Build-first when possible (his co-founder's advice, matches his experience).

## Workspace layout
- `MISSION.md`, `RESOURCES.md`, `GLOSSARY.md`, `learning-records/`.
- `reference/course-map.html` - the onion map, the lesson plan, the look-alike pairs. Update it after each lesson.
- `reference/iac-in-one-line.html` - every one-liner, one row per concept. Same words as the lessons.
- `assets/` - `course.css`, `course.js`, `quiz.js` (copied from the Argo course on Nov 21, `CAPA` renamed to `IAC`), plus new `sort.js` (sorter drill).
- Lessons link `../assets/` by relative path. `scripts/build.py --publish OUT_DIR` writes copies with the assets inlined, for publishing as claude.ai pages. Write publish copies outside the vault.

## Open threads
- Mission is a draft. Confirm with Alex: is HwtP for Infra the right anchor? Time budget per day?
- Communities: not yet asked.
- Lesson 0001 has two open questions with no answer on the page on purpose (the HwtP lens, and the bridge question). Wait for Alex's words.
- Order decision (Nov 21): Layers 1-4 are taught at "enough for IaC" depth, Layer 5 in depth. See the map. The methodology allows a changed order when dependencies suggest it.
- Nov 21: Alex asked to add his podcast vocabulary (Spacelift Intent episode) to the glossary. Added as "Field vocabulary - heard, not yet taught", grouped by concept, with a target lesson per concept term. Promote terms only through lessons. Corrections made to his source notes: Ansible (tasks check first; no state file), Kinesis (not managed Kafka - that is MSK), GCP (opinion removed). Use "provider" = plugin and the three "state" words consistently from lesson 0005 on.
- Nov 21 (later): on Alex's ask ("generate all 6 lessons" from the course map), built lessons 0002-0009 in one go (he said 6; the map has 8 lessons for Layers 1-6 - built all 8, told him). Same structure as 0001, built with `scripts/` generator kept outside the vault (container only). Quiz options equal in word count (checked by script). All pages checked: no JS errors, no overflow at 390 px, all links resolve.
- Built ahead, so not adapted to results yet. Warm-ups use 1-lesson-back and older items, not real misses. When result lines arrive, swap warm-up items in the next lesson for real misses (1-3-7 rule) and re-pitch anything "lost" on the page itself.
- Labs (0006, optional 0007): the sandbox could not run OpenTofu, so outputs in the reveals are from the docs, and the pages say so. Step 7 in 0006 (hand-edited file) is open on purpose - do not state the answer before Alex pastes his output. Lab uses `local` + `random` providers, no cloud account. Install: `brew install opentofu`.
- Open questions with no answer on purpose: 0004 m5 (count + how to rebuild staging), 0006 step 7, 0009 m5 (AI front door placement), every HwtP lens (0002-0009). 0008's HwtP lens is the most valuable - it maps HwtP for Infra onto the six-stage infra pipeline.
- 0009 ends with a "mission test" (matches MISSION.md success list). Its result decides the next step: deeper on one layer (real AWS lab, Terragrunt with several stacks) or a product review of HwtP for Infra.
- Facts worth re-checking before teaching further: DORA "fast and stable together" is stated as DORA's finding (dora.dev guide); Spacelift positions Intent for non-critical work (press release + docs); "state can hold secrets in plain text" (HashiCorp sensitive-data docs, Pulumi summary).
- Nov 21 (latest): on Alex's ask, enriched with trunkbaseddevelopment.com/feature-flags ("a practical implementation of CI"). Lesson 0002: new moment 2 (half-finished work merges daily behind a flag; old moments 2-5 are now 3-6, lost-box ids unchanged), trunk vs long-lived branch figure, "three kinds of feature flag" table, new words (trunk-based development, feature flag), pair "feature branch vs feature flag", 2 sorter items, quiz q7-q8, 2 cards, a one-line prompt, the page as a second source. Lesson 0001: "switch" definition points to "feature flag" and the source. Course word from 0002 on: "feature flag". Glossary, one-line page, course map and RESOURCES updated. Branch by abstraction is named only, not taught.
