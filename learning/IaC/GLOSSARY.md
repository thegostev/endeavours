# Infrastructure as Code glossary

The shared language of this course: how software and infrastructure move from code to a running, reliable system. Every lesson uses these words, in these meanings.

## Established terms
None yet. A term moves here when Alex can say its one line from memory and use it correctly (explain-back or quiz evidence).

## Proposed in lesson 0001 - promote after the explain-back

**Change**:
One recorded edit to code, kept in version control with an author, a time and a reason.
_Avoid_: "update", "push" (a push is one way to send a change, not the change itself)

**Build**:
The step that turns source code into an artifact.
_Avoid_: "compile" (only one part of a build), "deploy"

**Artifact**:
The packaged, versioned, unchangeable output of a build, stored and ready to run anywhere.
_Avoid_: "the build" (in this course "build" is the step, not its output), "binary"

**Environment**:
One place where a copy of the application runs for one purpose (dev, staging, production): infrastructure plus its own config.
_Avoid_: "server", "cluster" (an environment can use many servers, and several environments can share one cluster)

**Infrastructure**:
The computers, networks and storage that an environment is built on.
_Avoid_: "platform" (Layer 6 - a platform is infrastructure packaged as a service for teams; defined later)

**Config**:
Values that change between environments (database address, keys, switches), kept outside the artifact.
_Avoid_: "settings in the code"

**Deployment**:
Putting a given artifact into an environment so that it runs there.
_Avoid_: "release", "ship"

**Release**:
Letting users use a change.
_Avoid_: "deployment". Flag: in Twelve-Factor, "release" means build plus config, ready to run. In this course, "release" always means the user-facing step. See the note in lesson 0001.

**Running application**:
The artifact while it runs as processes in an environment, with its config.
_Avoid_: "the app" when you mean the artifact

## Proposed in lessons 0002-0009 - promote after each explain-back
Each lesson's "Words you need" box holds the full definitions. They move up to "Established terms" one lesson at a time, when Alex can say the one line from memory.
- 0002: pipeline, stage, main line (trunk), trunk-based development, short-lived feature branch, feature flag, build / launch / runtime flag, flag debt, Continuous Integration, Continuous Delivery, Continuous Deployment, promotion, blue-green deployment, canary, rollback
- 0003: process, virtual machine, container image, container, orchestrator, desired state, actual state, controller, imperative, declarative
- 0004: region, availability zone, private network (VPC), subnet, firewall rule, load balancer, DNS, managed service, IAM, resource
- 0005: definition file, ClickOps, script, idempotent, reproducible, drift, intent-based provisioning
- 0006: address, configuration, provider (plugin), init, state, plan, apply, dependency, update in place vs replace
- 0007: refresh-only plan, remote state, state lock, module, input variable, stack, blast radius, import
- 0008: pull request, speculative plan, policy as code, provisioning, configuration management, mutable/immutable infrastructure, configuration as code, GitOps
- 0009: platform, platform engineering, self-service, golden path, guardrails, developer portal, platform as a product, observability

### Added from trunkbaseddevelopment.com (lesson 0002)

**Trunk-based development**:
Everyone works on one shared branch, the trunk, and avoids long-lived branches - the practical form of CI. Rule of the source: every team member commits to trunk at least once every 24 hours.
_Avoid_: "GitFlow" as a synonym (it is a different branching model, with long-lived branches)

**Trunk**:
The one shared branch everyone merges into. Same thing as "main line" and Git's `main`.

**Short-lived feature branch**:
A branch that lives a day or two, only for code review and the CI check, then merges into trunk.
_Avoid_: "feature branch" alone, when you mean one that lives for weeks - that is the thing trunk-based development avoids

**Feature flag**:
A value that turns a capability on or off, so code can be in trunk - and in production - switched off. Lesson 0001 called it a "switch"; from lesson 0002 on, the course says "feature flag".
_Avoid_: "switch" (lesson 0001 only), "feature toggle" (Fowler's word - same thing, but say one word in this course)

**Build flag / launch flag / runtime flag**:
Where a flag's value is read. Build: decides what goes into the artifact - a capability left out cannot be turned on later. Launch: read from config when the app starts, so a change needs a restart. Runtime: changed while the app runs, from a shared store that every copy reads.

**Flag debt**:
Flags that nobody removed after their state was settled. Each one adds dead code paths and combinations to test. The source's fix: a review-for-delete date for every flag.

**Branch by abstraction** (heard, not taught):
Putting the old and new way behind one abstraction in trunk and switching between them, instead of a long-lived branch. The next page on trunkbaseddevelopment.com.

### Added from Fowler's "Continuous Integration" (bonus lesson 0002b)

**Mainline**:
The one shared branch that is the next production version. Fowler's word; the same thing as trunk and main line.

**Self-testing code**:
An automatic test suite that runs on every build, strong enough that a bug put in on purpose turns the build red. Fowler calls it a prerequisite for CI: only tests catch conflicts in meaning.

**Semantic conflict**:
Two changes that merge and compile cleanly but break each other's behaviour. Version control cannot see it; tests can.

**Semi-integration**:
Pulling from the mainline without pushing your own work until a feature is done - a feature branch, even with a CI service building it.
_Avoid_: calling a CI service on feature branches "CI" (Fowler: that is a "continuous build service")

**Pre-release integration**:
Everyone works apart and merges once, near the release. The style CI replaced.

**Commit build / secondary build**:
The fast build on every push (test doubles, inside the ten-minute guideline) / the slower build after it with end-to-end tests. Together: a deployment pipeline.

**Pending head**:
A set-up that holds a commit off the mainline until its build passes, so the mainline cannot go red.

**Keystone interface / dark launching / parallel change** (ways to hide work in progress):
Add the user-facing entry point last / run new code in production before users see its results / change in small, reversible expand-then-contract steps. With feature flags and branch by abstraction, Fowler's five ways to hide work in progress.

**Humble's CI test**:
Three questions: does everyone push to a shared mainline at least daily, does every push start a build with tests, and is a broken build usually green again within 10 minutes? (Fowler's 2017 bliki post.)

**Frequency reduces difficulty**:
Fowler's idea that pain grows faster than the gap between painful actions, so doing them more often makes each one small. His three reasons: chunking, feedback, practice.

Heard, not taught: Ship/Show/Ask (a pull-request style that keeps CI's rhythm), Evolutionary Database Design (Pramod Sadalage: small, versioned database migrations).

Course rulings (apply in every lesson):
- "CD" alone is not used. Say Continuous Delivery or Continuous Deployment.
- "Mainline", "trunk" and "main line" are the same thing. Lessons say "main line" or "trunk"; the bonus lesson uses Fowler's "mainline".
- "Feature flag" is the course word from lesson 0002 on. "Switch" stays only in lesson 0001.
- "Provider" alone = the plugin. The company is the "cloud provider".
- "Configuration as code" = app and tool settings in Git. Not infrastructure definitions, not configuration management.
- "Stack" = one applied piece with its own state (Kief Morris). Terragrunt's word for it is "unit".

## Field vocabulary - heard, not yet taught
Added Nov 21, 2026 from Alex's notes on the Software Architecture Insights episode of Jan 13, 2026 (Lee Atchison with Marcin Wyszyński, Spacelift), checked against docs.spacelift.io and spacelift.io/intent. Words to recognise, not yet established. Each moves up when the lesson that teaches it is done. Tools are listed as one example of a concept - the concept is what you learn.

### Concepts

**State** (lesson 0006):
The IaC tool's own record of what it created and how - instead of asking the cloud from zero every time. The tool compares it with the code and with the cloud to find what differs.
_Flag_: three look-alikes. Desired state = what the code asks for. Actual state = what really exists in the cloud. State (file) = the tool's record of the last known actual state. They can all differ - that difference is drift (lesson 0007).

**Provider** (lesson 0006):
A plugin that turns resource definitions into calls to one platform's API - instead of the tool knowing every cloud itself.
_Flag_: two meanings. "Cloud provider" = the company (AWS). "Terraform provider" = the plugin (`hashicorp/aws`). In this course, "provider" alone means the plugin.

**Policy as code** (lesson 0008):
Rules written as code that check every change automatically before it runs - instead of a person reading every request. Example: OPA/Rego rules in Spacelift.

**Intent-based provisioning** (lesson 0005, as a contrast):
You say what you want in plain language and the system works out the API calls - instead of writing infrastructure code first.
_Avoid_: "Intent" alone (that is also a product name, below).

**CI/CD** (lesson 0002):
An umbrella word for automated pipelines that build, test and deploy changes.
_Flag_: "CD" has two meanings - Continuous Delivery and Continuous Deployment. Lesson 0002 splits them. Avoid "CI/CD" when you mean one of the three.

**Temperature 0** (AI word, not IaC):
An LLM setting that makes the model pick its most likely answer each time. Output becomes more repeatable, but not fully the same every time - so a tool that uses an LLM must record state itself, and not trust the model to repeat itself.

### IaC tools - one example of a concept each

**Terraform**: Declarative IaC tool - you write the desired end state in HCL, and it uses its state to plan and apply only what differs. Concept: declarative IaC (0005-0006).
**OpenTofu**: The open-source fork of Terraform, made after HashiCorp changed Terraform's licence in 2023. Same language and workflow. Concept: same as Terraform.
**Pulumi**: IaC written in normal programming languages (Python, TypeScript, Go) - instead of a special config language. Still declarative at its core: the program builds a desired state, the engine makes it real. Concept: declarative IaC in a general language (0005).
**CloudFormation**: AWS's own IaC service. You give AWS a YAML or JSON template, and AWS keeps the state and changes the "stack" for you. For AWS resources only. Concept: declarative IaC with state kept by the cloud (0006).
**Ansible**: A tool that runs a list of tasks in order, usually over SSH. Each task checks first and changes only what differs, but there is no state file - so it is strong at setting up servers and weak at tracking cloud resources. Concept: configuration management (0008).
**Spacelift**: A platform that runs, controls and audits IaC tools (Terraform, OpenTofu, Pulumi and others) for teams - policies, approvals, history. Concept: an IaC orchestration and governance platform (0008-0009).
**Spacelift Intent**: Provisions infrastructure from a plain-language request through an MCP server, with no Terraform code - using the same Terraform providers, with Spacelift's policies, audit trail and state around it. Every resource can be exported to Terraform/OpenTofu code later. Made for non-critical work (experiments, proofs of concept), not production networking. Open source, plus a commercial version. Concept: intent-based provisioning.

### Clouds and cloud parts

**AWS**: Amazon's cloud, the largest. You rent compute, storage and network by API - instead of buying hardware (lesson 0004).
**Google Cloud (GCP)**: Google's cloud. Known for data analytics and for Kubernetes (Google created Kubernetes; its service is GKE).
**Azure**: Microsoft's cloud. Often chosen by companies that already use Microsoft tools and Entra ID (Microsoft's identity service).
**S3**: AWS object storage - files ("objects") in "buckets", reached over HTTP, with no disk to size or manage. One of the components HwtP for Infra releases.
**Kafka**: Open-source software for a shared, ordered event log that many services write to and read from. Not a cloud service itself - you run it, or rent a managed one (on AWS: Amazon MSK).
**Kinesis**: AWS's own streaming service - the same idea as Kafka (real-time event streams), but not Kafka, and nothing to run yourself.

### Formats, languages and protocols

**HCL**: The config language of Terraform and OpenTofu, made for people to read and write.
**JSON**: A strict data format that is easy for machines and hard for people to write by hand. CloudFormation's first template format.
**YAML**: A data format that uses indentation. Easier to read than JSON, but easy to break with one wrong space. Kubernetes, Argo and CloudFormation use it.
**MCP (Model Context Protocol)**: A standard way to show a set of tools (functions) to an LLM, so the LLM can call them.
**MCP server**: The service that offers those tools. Example: Spacelift's MCP server lets an AI client (Claude Code, ChatGPT, VS Code) ask for infrastructure.
**REST**: A web API style built on resources (URLs) and HTTP verbs (GET, POST, PUT, DELETE). An MCP tool is like a REST endpoint whose caller is an LLM, not code.
**SQLite**: A database in one file, with no server. Enough for one user on one machine (for example, the open-source Intent).
**Postgres (PostgreSQL)**: A full database server that many users can share at the same time. For a team that shares one history and one state.
