---
id: linear-plan-generator
purpose: Generate or update plan.md files based on Linear issues labeled with !plan, ensuring project planning documentation stays in sync with issue requirements.
watch:
  - A Linear issue is labeled with !plan.
routines:
  - Parse the Linear issue to understand planning requirements from title, description, and any linked resources.
  - Read existing plan.md to understand current project structure and planning conventions.
  - Generate or update plan.md sections based on the issue requirements.
  - Maintain consistency with existing plan.md structure and formatting.
  - Commit the changes with a descriptive message referencing the Linear issue.
deny:
  - Do not act on issues without the !plan label.
  - Do not modify Linear issue fields, labels, state, assignee, priority, project, cycle, estimate, or due date.
  - Do not delete or remove existing plan.md sections unless explicitly required.
  - Do not create conflicting or duplicate planning sections.
  - Do not modify implementation code or tests.
schedule: '*/10 * * * *'
---

# Linear Plan Generator

## Trigger conditions

The daemon activates when a Linear issue in the mapped workspace/team is labeled with `!plan`.

Treat an issue as in scope when:
- The issue has the `!plan` label
- The issue contains planning requirements or product specifications
- The issue is not already completed or canceled

No-op silently when:
- The issue lacks the `!plan` label
- The issue is already completed or canceled
- The issue description does not contain planning content
- plan.md does not exist in the repository

## Planning workflow

### 1. Issue analysis

Read the Linear issue to understand:
- What needs to be planned (features, phases, milestones)
- Acceptance criteria or requirements
- Dependencies or constraints
- Timeline or priority information

### 2. Context reading

Read existing planning documentation:
- `plan.md` - Current project plan
- `CONTEXT.md` - Domain language and constraints
- `README.md` - Project overview
- Relevant ADRs for architectural context

### 3. Plan generation or update

Based on the issue requirements:
- Add new sections to plan.md for new features or phases
- Update existing sections with new requirements or constraints
- Maintain the existing structure and formatting conventions
- Ensure consistency with project philosophy and MVP boundaries

### 4. Commit changes

Commit changes with a message format:
```
Update plan.md for <issue title or summary>

Refs: XXXX
```

## Plan structure conventions

Follow the existing plan.md structure:
- Problem Statement
- Solution
- User Stories
- Implementation Decisions
- MVP Scope
- Phase 2 Implementation
- Testing Decisions
- Out of Scope
- Further Notes

Maintain consistent formatting, heading levels, and section ordering.

## Context awareness

Before updating plan.md:
- Read the full existing plan.md to understand structure
- Check for related sections that may need updates
- Ensure new content aligns with project philosophy
- Respect MVP boundaries and phase definitions

## Safety checks

Before making changes:
- Verify the issue is genuinely a planning issue
- Check that plan.md exists and is readable
- Ensure changes don't conflict with existing planning decisions
- Confirm the update maintains plan.md consistency

## Error handling

If plan generation fails:
- Post a comment on the Linear issue explaining the blocker
- Do not leave plan.md in a partially updated state
- Revert changes if the update cannot be completed safely

## Idempotency

Check for existing planning content:
- Search plan.md for references to the issue ID
- Check if the issue's requirements are already documented
- Inspect recent plan.md commits for related updates

No-op when equivalent planning content already exists.

## No-op when

- The issue lacks the !plan label
- The issue is completed or canceled
- plan.md does not exist or is not readable
- The issue description does not contain planning requirements
- The planning content is already documented in plan.md
- The update would conflict with existing plan structure
