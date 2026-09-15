# AI Notes

This document tracks where and how I used AI in this submission. These are general notes, during an interview I can share my AI chat history and explain my process in more detail (if needed).

## General Notes

Since pair programming is practiced at your company, I wanted to simulate that dynamic. At the start of the project, where there is a lot of manual, repetitive work and porting patterns/habits from previous projects, I used AI to help speed things up. Later on, the plan was for me to do the implementation while the AI acted as a reviewer.

## Project Setup

As mentioned, I began by bringing over some helpful configurations I usually use in my projects—for example, a `pnpm fix` command that runs all checks and formatting at once. I also provided notes and instructions for the AI regarding the project structure so it could follow them or verify that the rules were being used correctly. Additionally, I used AI to generate boilerplate code for features, containers, views, and components, as well as several tests.

## Dev Process

Starting from scratch (writing this after Stage 2), I used AI to write about 80% of the code. I tell it what to do, and it executes it. However, I have had to push back on its structural choices, even though I provided a clear example in [project-structure.md](docs/project-structure.md). Because the project is small, the model struggles to infer the overall architecture from existing files and often invents new patterns instead. Moving forward, I need to be even more cautious, as the AI can easily drift off course, requiring me to restrict its scope.

Record after stage 5:
I'm still using AI to generate about 80% of the code (even though I wanted to switch roles and simulate 'pair programming'). I wanted to include best practices and patterns from my previous projects into this one. Most of them are unnecessary for the scale of this project, but I wanted to show that I can build a codebase from scratch that won't break in the context of a larger project. Unfortunately, this requires writing a lot of boilerplate code (e.g. the page -> container -> "master hook" -> view layering for every screen, a typed URL-state parser/serializer, a typed API error layer, and a typed test-ID factory) and creating numerous files, and AI is simply faster at that than I am. So, I decided that a better workflow for this task would be to use AI to generate the code, conduct a careful review, and fix the 20% of weirdness that it sometimes produces.
