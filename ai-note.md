# AI Notes

This document tracks where and how I used AI in this submission. During an interview I can share my AI chat history and explain my process in more detail.

## General Notes

The email permitted AI use and asked for disclosure, so these notes describe how I actually worked. I kept ownership of architecture, structure, and review, and used AI to generate code against the rules I had already written down, since that was faster than typing it all myself. Since company is practices pair programming, my plan was to simulate pair programming: AI as driver at first, then AI as generator and reviewer over its own output. In practice I stayed the reviewer for both, it was much quicker since project is in early stages and requires a lot of iteration/boilerplate, and it worked well, so I kept this flow.

## Project Setup

I brought over some helpful configurations I use in my own projects, for example a `pnpm fix` command that runs all checks and formatting at once. I also wrote the notes and instructions for the AI in [project-structure.md](docs/project-structure.md) so it could follow them or verify that the rules were being used correctly. I used AI to generate boilerplate code for features, containers, views, and components, as well as several tests.

## Dev Process

I used AI to generate roughly 80% of the code and reviewed all of it. I decide what to build, AI produces a draft, and the source of truth is the review, not the draft. Concretely, that meant:

- Pushing back on structural choices the model invented because the project was too small for it to infer the architecture from existing files. I held it to [project-structure.md](docs/project-structure.md) and restricted its scope when it drifted.
- Injecting patterns I wanted from my previous projects. Most are unnecessary at this scale, but I wanted to show that I can build a codebase that holds up in a larger project. That requires boilerplate (the page -> container -> "master hook" -> view layering on every screen, a typed URL-state parser/serializer, a typed API error layer, and a typed test-ID factory), and AI is faster at that than I am.
- Reviewing every file, running the checks with `pnpm fix`, and fixing the 20% of weirdness the drafts tended to contain.

Confirmed after stage 5: the generate, review, and fix loop was the better workflow for this task.
