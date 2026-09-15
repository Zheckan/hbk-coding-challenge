# AI Note

Here will be to track where and how I used AI in the submission. Here will be general notes, on interview I can share my AI chat history and explain how I used it more in details (if needed).

## General note

Since inside a company you practice pair programming, I wanted to sort of simulate it. At the start of project where we have to do a lot manual and repetitive work, port some patterns/habits from previous projects, I used AI to help me with that. Later on, I will do work and ai would work as reviewer.

## Project setup

As said, started to bring some helpful setups that I usually use in my projects. As for example `pnpm fix` command, that will run all the checks and formatting in one command. Some notes and instructions to AI about project structure so it can follow and verify that I am following the rules. Also, I used AI to generate some boilerplate code for features, containers, views, and components. I also used AI to generate some tests and stories for components.

## Dev process

On a fresh project (right now I'm writing this after stage 2), I used AI to write 80% of the code. I tell it what to do, and it does it. But I have to fight it a bit on the project structure, even though I added a perfect example in [project-structure.md](docs/project-structure.md). Because the project is small, it cannot gather the project's structure and use it as an example, so it invents new patterns. So from now on, I'm even more careful, since the AI can easily drift in directions I don't want, forcing me to somewhat restrain its 'field of vision'.

Record after stage 5:
I'm still using AI to generate about 80% of the code (even though I wanted to switch roles and simulate 'pair programming'). I wanted to include best practices and patterns from my previous projects into this one. Most of them are unnecessary for the scale of this project, but I wanted to show that I can build a codebase from scratch that won't break in the context of a larger project. Unfortunately, this requires writing a lot of boilerplate code (e.g. the page -> container -> "master hook" -> view layering for every screen, a typed URL-state parser/serializer, a typed API error layer, and a typed test-ID factory) and creating numerous files, and AI is simply faster at that than I am. So, I decided that a better workflow for this task would be to use AI to generate the code, conduct a careful review, and fix the 20% of weirdness that it sometimes produces.
