## Code Style & Quality

- Always prioritize readable code over brevity.
- Always match existing code patterns and conventions.
- Never use TypeScript's `any` type; use `unknown` with type guards.
- Never add comments that restate what code does; only explain non-obvious intent.
- Never rewrite working code; change only what is necessary.
- Never abstract prematurely or over-engineer.
- Always extract a shared abstraction when the same logic appears three or more times.
- Always use consistent naming conventions throughout.
- Always keep functions small and focused on one task.
- Always prefer explicit code over implicit magic.
- Never use magic numbers; extract to named constants.
- Always prefer immutable operations; never mutate objects or arrays directly.
- Always split files into focused modules when they exceed 300-400 lines.
- Always minimize token output; avoid repeating unchanged code in responses.
- Never assume functions, APIs, or libraries exist; verify before using them.
- Never ignore or swallow errors; always handle or propagate them.
- Always prefer spaces for indentation.
- Always place new files in locations consistent with the existing project structure.

## Problem Solving & Debugging

- Always fail fast with descriptive, context-rich error messages.
- Always verify changes work as expected before moving on.
- Always stop and reassess after three failed attempts at the same approach.
- Always reflect on what worked and what didn't after debugging.
- Always analyze what went wrong before retrying a failed approach.
- Always checkpoint state before making destructive changes.
- Always ask the user for help after three consecutive failures on the same task.

## Testing

- IMPORTANT: Always prefer test-driven development when planning new features.
- Always test edge cases and error conditions.
- Always test behavioral outcomes rather than implementation details.
- Always run tests before committing changes.
- Always write test assertions with descriptive failure messages.
- IMPORTANT: Always follow the red-green-refactor cycle: failing test, passing code, cleanup.

## Git Workflow

- Always make Git commits in logical groups rather than one large commit.
- Never commit code with compilation failures, warnings, or errors.
- Always follow Conventional Commits format (feat:, fix:, docs:, etc.).
- Always make atomic commits that can be cherry-picked independently.

## Planning & Communication

- Always research and plan before starting implementation.
- Always present a plan summary with open questions before implementing.
- IMPORTANT: Always ask clarifying questions when requirements are ambiguous.
- Always list pros and cons when multiple approaches exist.
- Always suggest creating a specification file when planning new projects.
- Always break complex tasks into smaller subtasks.

## Documentation

- Always document why important design decisions are made.
- Never include volatile data in docs; reference how to retrieve it instead.
- Always update documentation when changing related code.
- Always write documentation in plain, direct language; never use filler, buzzwords, or marketing tone.

## Security & Safety

- IMPORTANT: Never commit secrets, API keys, or credentials to the repository.
- IMPORTANT: Always validate user input at system boundaries.
- IMPORTANT: Never hardcode credentials or sensitive configuration.
- Always sanitize output to prevent injection attacks.

## Performance

- Always cache results of expensive computations when appropriate.

## Context

### Context Window Limits

Every line in your configuration file consumes tokens from the context window. Treat your config like a performance budget.

Practical limits:

- LLMs reliably follow approximately 150-200 discrete instructions. Beyond this, adherence degrades and earlier instructions may be ignored.
- Each rule should be a single, actionable statement. If your file exceeds 200 rules, prioritize ruthlessly.

Signs of context overload:

- The model stops following rules it followed in shorter sessions.
- The model follows recent instructions but ignores ones from the beginning of the file.
- Responses become generic rather than project-specific.

Strategies for keeping configuration lean:

- Write rules only for behaviors that differ from the model's defaults. Do not tell it to do things it already does.
- Use specific, concrete instructions. "Use tabs for indentation" is actionable. "Write high-quality code" is noise.
- Group related rules into single statements. "Use strict TypeScript with no unused locals or parameters" is one instruction, not three.
- Remove rules the model follows consistently without the rule present. Many rules are training wheels that can be retired.
- Use critical markers sparingly. If everything is critical, nothing is.
- Review periodically and remove rules that have not influenced behavior. Configuration files should shrink over time.

### Directory Organization

Every top-level directory has a single clear purpose. Place new files in the directory that matches their role. Never create a new top-level directory without explicit approval.

Standard top-level directories:

- `src/` - Application source code with an entry point at the root (main.ts, lib.rs, app.py).
- `tests/` - Integration tests, end-to-end tests, and test fixtures.
- `docs/` - Documentation, specifications, and architecture decision records.
- `config/` - Environment configs, Docker files, CI/CD pipelines, and infrastructure.
- `scripts/` - Build scripts, migrations, and automation tooling.
- `public/` or `static/` - Static assets served without processing: images, fonts, favicons.

Organizing source code:

- Feature-based: Group all code for a feature together (`src/auth/` has controller, service, types). Prefer for projects with many independent features.
- Type-based: Group by role (`src/components/`, `src/hooks/`, `src/utils/`). Prefer for smaller projects.
- Do not mix both patterns at the same level.

Placing new files:

- Find an existing file with a similar role and place the new file in the same directory.
- Update barrel files (index.ts, mod.rs) when adding new public modules.

Import conventions:

- Use path aliases (`@/components/Button`) over deep relative paths when available.
- Never import from another feature's internal files; use its public barrel file.
- Keep circular dependencies at zero. Extract shared types into a common module if needed.

### Environment Variables

Environment variables control runtime configuration and secrets. Mishandling them is a common source of security incidents.

.env file patterns:

- Use .env for local development only. Never commit it to version control; add .env to .gitignore before creating the file.
- If .env was ever committed, rotate every secret it contained. Git history is permanent.
- Provide a .env.example listing every required variable with placeholders and comments.

Secrets management:

- Never hardcode secrets, API keys, or tokens in source code. Not in constants, comments, or test files.
- Never log environment variable values. Log the name and whether it is set, never the content.

Validation at startup:

- Validate all required environment variables when the application starts. Fail immediately with a clear error naming the missing variable.
- Validate format where applicable: port numbers should be numeric, URLs parseable. Catch misconfiguration at startup, not at first use.
- Provide sensible defaults for optional variables.

Common mistakes:

- Using process.env.VAR without checking for undefined, causing silent failures.
- Storing different environment secrets in the same .env file toggled by comments.
- Putting server-side secrets in frontend env vars. Frontend variables are embedded at build time and visible in the bundle.

### Naming Conventions

Consistency matters more than personal preference. All naming follows predictable patterns so files and symbols can be found by convention.

File naming:

- Source files: kebab-case. Examples: `user-profile.ts`, `auth-service.rs`.
- Components: PascalCase matching the export. Examples: `UserProfile.tsx`, `SearchModal.vue`.
- Tests: Mirror the source name with a test suffix. Examples: `user-profile.test.ts`, `auth_service_test.rs`.
- Directories: Always lowercase kebab-case. Examples: `user-management/`, `api-routes/`.

Variable and symbol naming:

- Variables and functions: camelCase. Examples: `getUserById`, `handleSubmit`.
- Classes, types, and components: PascalCase. Examples: `UserProfile`, `ApiResponse`.
- Constants: UPPER_SNAKE_CASE. Examples: `MAX_RETRY_COUNT`, `DATABASE_URL`.
- Booleans: Prefix with `is`, `has`, `can`, or `should`. Examples: `isLoading`, `hasPermission`.

Database naming:

- Tables: plural snake_case (`user_accounts`, `order_items`).
- Columns: singular snake_case (`created_at`, `is_active`).
- Foreign keys: `{referenced_table_singular}_id` (`user_id`, `order_id`).

When in doubt, match the pattern already established in the file you are editing. Never mix conventions within the same module.
