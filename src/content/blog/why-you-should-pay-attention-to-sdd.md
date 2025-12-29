---
title: Why You Should Pay Attention to Spec-Driven Development
date: 2025-12-28
authors: mat
excerpt: Vibe-coding gets all the headlines, but there's another AI-powered pattern emerging that I think will matter more in the long run — Spec-Driven Development.
cover:
  alt: "Example Spec-Kit project structure"
  image: ./sdd_cover.png
tags:
  - AI
  - SDD
---

# Why You Should Pay Attention to Spec-Driven Development

Vibe-coding gets all the headlines, but there's another AI-powered pattern emerging that I think will matter more in the long run — Spec-Driven Development.

I tried two SDD frameworks on real projects this year. Here are my thoughts after building a few non-trivial applications with both.

## The Old Problem with Specifications

Building specifications is already a well-established process. You gather the requirements — business, functional, and technical — you put them in a template, you iterate, and then you proceed with the implementation. It's valuable work: it helps narrow down what stakeholders really need, it formalizes non-obvious technical choices, it surfaces edge cases early.

It's also tedious and time-consuming. Specs often feel like necessary bureaucracy. Personally, I'm never excited about writing them.

This leads to a familiar pattern: the specification gets built, but it goes out of date almost immediately after the code ships. Engineers fix bugs and react to user feedback, while specs sit unchanged in some forgotten folder.

As the Spec-Kit documentation puts it: "Code was truth. Everything else was, at best, good intentions."

The result? Code becomes the ultimate source of truth for how a system behaves.

## The Paradigm Shift

SDD flips this relationship. Specifications don't serve code — code serves specifications.

This inversion is now practical because LLMs can do two things efficiently: generate well-structured specifications from free-form input, and generate code from those specifications. You can prompt an LLM with raw user feedback, and it will produce structured business value definitions, user stories, and a delivery plan. You can then feed those specs back in and get working code.

Even better, LLMs are good at analyzing tradeoffs, doing competitive analysis, and spotting edge cases — the kind of work that normally takes hours and is prone to human bias.

With this efficiency boost, maintaining specs becomes viable. When you want to make a change, you update the spec first, and the LLM handles the implementation. The spec stays current because it's part of the workflow, not a separate document that needs manual synchronisation.

## Why This Matters Now

Three trends are converging to make SDD not just possible, but necessary:

**AI has crossed a threshold.** Natural language specifications can now reliably generate working code. This isn't about replacing developers — it's about automating the mechanical translation from intent to implementation.

**Software complexity keeps growing.** Modern systems integrate dozens of services, frameworks, and dependencies. Keeping all these pieces aligned with original intent through manual processes is increasingly difficult. SDD provides systematic alignment through specification-driven generation.

**The pace of change has accelerated.** Pivots are no longer exceptional — they're expected. Traditional development treats requirement changes as disruptions, requiring manual propagation through documentation, design, and code. SDD transforms pivots into systematic regenerations rather than manual rewrites.

## What SDD Actually Gives You

What this gives you in practice:

**Specs become collaborative artifacts.** When the specification is the source of truth, you can share it with clients and stakeholders — not just engineers. They can review and iterate on something readable, rather than trying to infer intent from code.

**Research without your blind spots.** LLMs can analyze pros and cons of different approaches, do competitive analysis, and evaluate technical tradeoffs — often surfacing options you wouldn't have considered.

**Automatic documentation.** When specs are the source of truth, you can generate documentation from them — not just API references, but guides, tutorials, and onboarding materials that stay in sync with reality.

## The Current State

SDD frameworks are still in their early days, but they're already useful. They can turn free-form text into well-structured requirements, contracts, and tasks. This alone saves significant effort — combine it with vibe-coding for the implementation, and you can launch an MVP remarkably fast.

That said, the tooling has clear limitations.

The generated code is often sloppy. SDD doesn't replace engineering skill — you still need solid fundamentals to build software that's maintainable in the long run. The frameworks help you define *what* to build more clearly, but the *how* still requires human judgment.

Cross-spec consistency is unsolved. Once you start accumulating multiple specifications, managing their interdependencies becomes tedious. Neither Spec-Kit nor OpenSpec provides robust tooling for checking consistency across specs and keeping them aligned. Not yet, anyway.

## Where to Start

I tried two SDD frameworks:

**[Spec-Kit](https://github.com/github/spec-kit)** — Developed by GitHub, with significant traction (58k+ stars). It provides a structured workflow from requirements through implementation. A good choice when starting a project from scratch. I built [Unentropy](https://unentropy.dev) with Spec-Kit.

**[OpenSpec](https://github.com/Fission-AI/OpenSpec)** — Markets itself as "brownfield-first," designed for existing codebases rather than just greenfield projects. It separates source-of-truth specs from proposed changes, making diffs explicit. Tends to generate simpler documents than Spec-Kit. I used it on a few smaller projects — it seems promising.

Both provide CLI tools for scaffolding and managing specifications, and both support a wide range of AI coding assistants.

If you want to understand the philosophy behind SDD more deeply, read [the spec-driven.md document](https://github.com/github/spec-kit/blob/main/spec-driven.md) in the Spec-Kit repo. It articulates the "power inversion" concept well.

## Conclusion

SDD is still immature, but it's already useful. The tooling will improve. What matters now is the mental model: specifications as the source of truth, with code as the generated output.

If you're building software with AI assistance, this is a space worth watching.
