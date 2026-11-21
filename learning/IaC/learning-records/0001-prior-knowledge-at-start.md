# 0001 - Prior knowledge at start

Date: 2026-11-21. Evidence: Alex's own statements (this request, his "My tech capabilities" table, earlier sessions). Nothing tested yet in this course.

## What Alex has
- Work: PM of Highway to Prod at Jamf - HwtP for K8s and HwtP for Infra (releases infrastructure components such as databases and S3 buckets). He leads product, not the tech solution. Knows the names and the flow from work.
- Kubernetes: "understand the idea from different angles", some `kubectl`. Kubernetes controllers: "somehow understand the concept". Docker: some commands. GitHub Actions: some practice.
- Argo: CAPA course in `../Argo/`, through DAG lessons. Desired state and sync (Argo CD) are met there.
- No stated practice with Terraform, OpenTofu, Pulumi or Ansible.

## What this changes
- Desired vs actual state can anchor on Argo CD sync and Kubernetes controllers, which he has seen. Check it with a question first - do not assume.
- Risk (same as in the Argo course): words from work (release, deploy, environment, platform) feel like knowledge. Lesson 0001 tests the look-alike pairs before building on them.
- Containers and Kubernetes (Layer 3) can be taught at "enough for IaC" depth, with a check question, not from zero.
