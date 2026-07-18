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
