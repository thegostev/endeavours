# Infrastructure as Code - resources

High-trust sources only. Lessons cite these. Checked Nov 21, 2026.

## Knowledge

### Core texts
- [Book: _Infrastructure as Code_, 3rd edition, by Kief Morris (O'Reilly, 2025)](https://www.oreilly.com/library/view/infrastructure-as-code/9781098150341/)
  The core text of the field. Part 1 (foundations: principles of cloud infrastructure, platforms, tools and languages), Part 2 (design: stacks, components, environments). Use for: every Layer 5 and Layer 6 lesson. Companion site: [infrastructure-as-code.com](https://infrastructure-as-code.com/). Thoughtworks offers [a free chapter](https://www.thoughtworks.com/insights/books/infrastructure-as-code-3rd-ed).
- [Article: "Infrastructure As Code" by Martin Fowler (bliki, 2016)](https://www.martinfowler.com/bliki/InfrastructureAsCode.html)
  Two-minute definition and the core practices (definition files, version control, tests, small changes). Use for: the first IaC lesson, the "iron age vs cloud age" picture.

### Delivery (Layers 0-2)
- [The Twelve-Factor App: V. Build, release, run](https://12factor.net/build-release-run)
  Short, precise split of build (code to bundle), release (bundle plus config) and run. Use for: Layer 0, build vs deploy vs release, artifact vs config.
- [Martin Fowler: Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html) (2000, rewritten 2006, revised 18 Jan 2024), with bliki posts [Frequency Reduces Difficulty](https://martinfowler.com/bliki/FrequencyReducesDifficulty.html) (2011) and [Continuous Integration Certification](https://martinfowler.com/bliki/ContinuousIntegrationCertification.html) (2017)
  The long-form source of CI: 11 practices, three styles of integration, benefits, when not to use it, how to start, common questions. Use for: bonus lesson 0002b. Added Nov 22, on Alex's ask.
- [Martin Fowler: Continuous Delivery](https://martinfowler.com/bliki/ContinuousDelivery.html) and [Deployment Pipeline](https://martinfowler.com/bliki/DeploymentPipeline.html)
  Definitions of CD and of the pipeline. Use for: Layer 1-2, CI vs CD.
- [Jez Humble: Continuous Delivery vs Continuous Deployment (2010)](https://continuousdelivery.com/2010/08/continuous-delivery-vs-continuous-deployment)
  The source of the delivery vs deployment split, from the co-author of _Continuous Delivery_. Use for: Layer 2.
- [Trunk Based Development, by Paul Hammant and contributors](https://trunkbaseddevelopment.com/), especially [Feature Flags](https://trunkbaseddevelopment.com/feature-flags/)
  The practical form of CI: one shared trunk, short-lived branches, flags for unfinished work. The Feature Flags page covers build vs launch vs runtime flags, testing flag combinations in CI, and removing flags. Use for: lesson 0002 (moment 2, the flag table), feature branch vs feature flag. Added Nov 21, on Alex's ask.
- [Pete Hodgson: Feature Toggles (martinfowler.com)](https://martinfowler.com/articles/feature-toggles.html)
  Release toggles separate deployment from release. Use for: deploy vs release, Layer 2.

### Runtime and cloud (Layers 3-4)
- [Kubernetes docs: Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
  Desired state vs current state, the control loop (thermostat). Use for: the desired-state idea, before IaC tools.
- [NIST SP 800-145: The NIST Definition of Cloud Computing](https://doi.org/10.6028/NIST.SP.800-145)
  The standard definition: five essential characteristics, three service models. Use for: Layer 4 "what cloud really is".

### IaC tools (Layer 5 - only after the concepts)
- [HashiCorp: What is Terraform?](https://developer.hashicorp.com/terraform/intro) and [Core workflow](https://developer.hashicorp.com/terraform/intro/core-workflow)
  Write, plan, apply. Providers talk to platform APIs. Use for: the IaC engine lesson.
- [OpenTofu docs](https://opentofu.org/docs/)
  Open-source fork of Terraform, same language and workflow. Use for: hands-on labs, if no Terraform licence questions.

## Heard elsewhere (context, not core sources)
- [Podcast: Software Architecture Insights, Lee Atchison - "Navigating Cloud Infrastructure using AI" with Marcin Wyszyński (Spacelift), Jan 13, 2026](https://spacelift.io/intent)
  Vendor co-founder interview, so read it as one company's view. Transcript and analysis in `../1 - Podkaster/`. Use for: intent-based provisioning as a contrast to IaC (lesson 0005). Spacelift's own docs: [Spacelift Intent](https://docs.spacelift.io/concepts/intelligence/intent). The host's course site is Atchison Academy (not checked as a source).

## Wisdom (communities)
Not yet asked if Alex wants to join communities. Ask once, before proposing them in a lesson.
- [HashiCorp Discuss - Terraform](https://discuss.hashicorp.com/): official forum, moderated. Use for: "is this plan behavior expected?" questions.
- CNCF Slack (#platform-engineering and related channels): practitioners of platforms. Use for: Layer 6 questions.
- At work: Delta engineers who run HwtP for Infra. Use for: "how do we do it here, and why?"

## Gaps
- A short, high-trust visual explainer for "state file" and "drift". Search when lesson 0006 is built.
- A free, local lab setup that needs no cloud account (candidates: OpenTofu with a local or Docker provider, LocalStack). Check before the first hands-on lesson.
