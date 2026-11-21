# Mission: Infrastructure as Code, from first principles

Status: draft (Nov 21, 2026), written from Alex's request and his methodology file. Confirm or change.

## Why
Alex is the PM of Highway to Prod for Infra at Jamf: the tool that releases infrastructure components (databases, S3 buckets and more). He wants an engineering mental model of IaC that is strong enough to reason with platform engineers about design, trade-offs and failure modes - instead of knowing only the tool names.

## Success looks like
- Explain the journey from a commit to production in one line, then in a paragraph, then on a diagram - for application code and for infrastructure code.
- Say the one line of each core IaC concept from memory: desired state, actual state, state file, plan, apply, drift, idempotency, provider, module.
- Read a Terraform or OpenTofu plan and say what will change, what will be destroyed, and what the risk is.
- Explain how an infrastructure change should move through environments, where it can fail, and how to recover - and use that to judge HwtP for Infra decisions.
- Keep up in a design talk with platform engineers about stacks, modules, environments and state, and ask the right next question.

## Constraints
- Style: ASD-STE100 Simplified Technical English, visuals first, the "one line - what it really solves, instead of what" rule, then layer by layer (onion).
- 80/20 by learning speed per concept, not by tool popularity. Established knowledge, not hype.
- Build-first when a concept allows it: hands-on soon, theory after.
- Time budget: not yet stated.

## Out of scope
- A certification cram course.
- A catalogue of tools or cloud services. A tool comes in only as one example of a concept.
- Deep provider-specific detail (AWS service by service) beyond what the running example needs.
