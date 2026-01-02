---
title: Why You Should Pay Attention to Spec-Driven Development
date: 2026-01-03
draft: false
authors: mat
excerpt: Vibe-coding gets all the headlines, but there's another AI-powered pattern emerging that I think will matter more in the long run — Spec-Driven Development.
cover:
  alt: Example Spec-Kit project structure
  image: ./sdd_cover.png
tags:
  - AI
  - SDD
---
# Why you should pay attention to Spec-Driven Development

Vibe-coding gets all the headlines, but there's another AI-powered pattern emerging that I think will matter more in the long run — Spec-Driven Development.

I tried two SDD frameworks on real projects in the last two months. Here are my thoughts after building a few non-trivial applications with both.
## The problem with specifications

Building specifications is already a well-established process. You gather the requirements — business, functional, and technical — you put them in a template, you iterate, and then you proceed with the implementation. It's valuable work: it helps narrow down what stakeholders really need, it formalizes non-obvious technical choices, it surfaces edge cases early.

It's also tedious and time-consuming. Specs often feel like necessary bureaucracy. Personally, I'm never excited about writing them.

This leads to a familiar pattern: the specification gets built, but it goes out of date almost immediately after the code ships. Engineers fix bugs and react to user feedback, while specs sit unchanged in some forgotten Confluence space.

As the Spec-Kit documentation puts it: "Code was truth. Everything else was, at best, good intentions."

The result? Code becomes the ultimate source of truth for how a system behaves.

## The paradigm shift

SDD flips this relationship. Specifications don't serve code — code serves specifications.

This inversion is now practical because LLMs can do two things efficiently: generate well-structured specifications from free-form input, and generate code from those specifications. You can prompt an LLM with raw user feedback, and it will produce structured business value definitions, user stories, and a delivery plan. You can then feed those specs back in and get working code.

Even better, LLMs can do competitive analysis and spot edge cases — work that normally takes hours and is prone to human bias.

**With this AI-based efficiency boost, maintaining specs becomes viable**. When you want to make a change, you update the spec first, and the LLM handles the implementation. The spec stays current because it's part of the workflow, not a separate document that needs manual synchronisation.

## Why this matters now

Three trends are converging to make SDD not just possible, but necessary:

**AI has crossed a threshold.** Natural language specifications can now generate working code. This isn't about replacing developers — it's about automating the mechanical translation from intent to implementation.

**Software complexity keeps growing.** Modern systems integrate dozens of services and dependencies. Keeping all these pieces aligned with original intent through manual processes is increasingly difficult. SDD provides systematic alignment through specification-driven generation.

**The pace of change has accelerated.** Pivots are no longer exceptional — they're expected. Traditional development treats requirement changes as disruptions, requiring manual propagation through documentation, design, and code. SDD transforms pivots into systematic regenerations rather than manual rewrites.

## What SDD actually gives you

**Specs become collaborative artifacts.** When the specification is the source of truth, you can share it with clients and stakeholders — not just engineers. They can review and iterate on something readable, rather than trying to infer intent from code.

**Research without your blind spots.** LLMs can analyze pros and cons of different approaches, do competitive analysis, and evaluate technical tradeoffs — often surfacing options you wouldn't have considered.

**Automatic documentation.** When specs are the source of truth, you can generate documentation from them — not just API references, but guides, tutorials, and onboarding materials that stay in sync with reality.

## SDD in practice

Toolkits like Spec-Kit work within your code repository, generating specifications as markdown files. Here's what a single feature specification looks like:

```
001-metrics-tracking-poc/
├── checklists
│   └── requirements.md
├── contracts
│   ├── config-schema.md
│   └── database-schema.md
├── data-model.md
├── plan.md
├── quickstart.md
├── research.md
├── spec.md
└── tasks.md
```

Each of these files serves a specific purpose. The `spec.md` captures user stories, requirements, and acceptance criteria — the *what* and *why*. The `plan.md` translates those into technical decisions and architecture — the *how*. Supporting files like `data-model.md` and the `contracts/` directory define schemas and API specifications. The `tasks.md` breaks everything into actionable implementation steps. All of these are version-controlled markdown files, living alongside your code.

How does this get generated? SDD toolkits combine three elements: CLI tools, templates, and a defined workflow.

The **CLI tools** orchestrate the process. You initialize a project with a command like `specify init`, which scaffolds the directory structure and brings in the templates. From there, you work through a sequence of commands — `/speckit.specify` to define what you're building, `/speckit.plan` to create the technical approach, `/speckit.tasks` to generate the implementation checklist. Each command builds on the output of the previous one.

The **templates** are what gives the LLM output structure. They're markdown files that **constrain the AI's responses** — forcing it to mark uncertainties explicitly, separate requirements from implementation details, and include review checklists. They act as guardrails that ensure consistency and completeness.

The **workflow** ties it together. You start with a natural language description of what you want to build, and the toolkit guides you through iterative refinement — from vague idea to structured spec to technical plan to task list. Each step is a checkpoint where you can review, clarify, and adjust before moving forward. The result is a set of specification documents detailed enough to drive implementation. Hand them to an LLM for code generation, or use them as a reference for manual development.

## The current state

**SDD toolkits are still in their early days**, but they're already useful. They can turn free-form text into well-structured requirements, contracts, and tasks. This alone saves significant effort — combine it with vibe-coding for the implementation, and you can launch an MVP remarkably fast.

That said, the tooling has clear limitations.

**The generated code is often sloppy**. SDD doesn't replace engineering skill — you still need solid fundamentals to build software that's maintainable in the long run. The frameworks help you define *what* to build more clearly, but the *how* still requires human judgment.

Cross-spec consistency is unsolved. Once you start accumulating multiple specifications, managing their interdependencies becomes tedious. Neither Spec-Kit nor OpenSpec provides robust tooling for checking consistency across specs and keeping them aligned. Not yet, anyway.

Finally, most (if not all) toolkits are tied to markdown files directly in the code repository. They don't come with out-of-the-box solution for collaboration - the usual "just use git" answer is too developer-centric to my taste. I would love to see options to sync with Confluence or other knowledge-management tools.

## Where to start

I tried two SDD toolkits:

**[Spec-Kit](https://github.com/github/spec-kit)** — Developed by GitHub, with significant traction (59k+ stars at the time of publishing this article). It provides a structured workflow from requirements through implementation. A good choice when starting a project from scratch. I built [Unentropy](https://unentropy.dev) with Spec-Kit.

**[OpenSpec](https://github.com/Fission-AI/OpenSpec)** — Markets itself as "brownfield-first," designed for existing codebases rather than just greenfield projects. It separates source-of-truth specs from proposed changes, making diffs explicit. Tends to generate simpler documents than Spec-Kit. I used it on a few smaller projects — it seems promising.

Both provide CLI tools for scaffolding and managing specifications, and both support a wide range of AI coding assistants.

If you want to understand the philosophy behind SDD more deeply, read [the spec-driven.md document](https://github.com/github/spec-kit/blob/main/spec-driven.md) in the Spec-Kit repo. It articulates the "power inversion" concept well.

## Conclusion

SDD is still immature, but it's already useful. The tooling will improve. What matters now is the mental model: specifications as the source of truth, with code as the generated output.

If you're building software with AI assistance, try one of these toolkits on your next project.
