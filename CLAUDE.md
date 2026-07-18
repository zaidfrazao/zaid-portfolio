# CLAUDE.md

This file provides guidance to Claude Code when working with this project.

## Project Overview

**zaid-portfolio**: Personal portfolio site

## Project Documentation

Key project documents are stored in the `docs/` folder:

- `docs/PRD.md` - Product requirements document
- `docs/BRAND_GUIDE.md` - Brand and UX guidelines
- `docs/TESTING_STRATEGY.md` - Testing approach and strategy

## Configuration

Project settings are in `.claude/project.yaml`. This includes:

- Build commands and tooling
- Git branch conventions
- Lakar workflow statuses
- Team configuration

## Testing Screenshots

Screenshots captured during testing (e.g. Playwright visual checks in `/zao:test-task`)
are **transient artifacts**, never committed. Rules:

- **Location:** write every testing screenshot into `test-screenshots/` at the repo
  root — nowhere else (not the repo root, not `docs/`, not `src/`). The folder is
  gitignored.
- **Cleanup:** delete the screenshots (empty or remove `test-screenshots/`) as soon as
  the visual check that produced them is finished.
- **Finish gate:** before completing a task (`/zao:finish-task`, and when wrapping up
  `/zao:test-task`), verify `test-screenshots/` is empty or absent. A task must not be
  finished while testing screenshots still exist on disk.

## Slash Commands

### Project Setup (`/fra:` commands)

- `/fra:status` - Check project setup progress
- `/fra:prd` - Define product requirements
- `/fra:brand` - Define brand and UX guidelines
- `/fra:testing` - Define testing strategy
- `/fra:setup-pm` - Create the project-management structure
- `/fra:save` - Commit and push changes

### Development (`/zao:` commands) — branch + PR workflow

- `/zao:workflow` - View the development workflow
- `/zao:begin-task TSK-XXX` - Start working on a task (creates a branch)
- `/zao:implement-task` - Build the planned task
- `/zao:test-task` - Run tests and checks
- `/zao:submit-task` - Create PR for review
- `/zao:finish-task` - Merge and complete task
- `/zao:check-status` - Check current task status
