# PRism distribution research

Checked 2026-10-23. Sources below are the maintainers' repositories and current host documentation.

## Recommendation

Publish the existing `skills/prism-review/SKILL.md` through the GitHub repository first. Put `npx skills add peterpapas/prism-review` in the README, then verify a project and a user install in both Codex and Claude Code. The [Skills CLI](https://www.skills.sh/docs/cli) accepts `owner/repo` and configures agent skill folders without PRism publishing its own npm package. PRism's task-scoped, instruction-only workflow fits a standalone skill: [Claude Code](https://code.claude.com/docs/en/plugins) and [OpenAI](https://developers.openai.com/plugins/build/skills) both say skills can work without plugins or MCP servers. Add host plugins later if marketplace discovery, managed rollout, or a bundled capability proves useful.

The package to consider later is a **CLI with a concrete job** (for example, pinned-version installation, fixture verification, or a local read-only PR runner). An npm package that merely carries `SKILL.md` adds a release channel without changing how Codex or Claude Code invokes PRism. OpenAI's [plugin packaging docs](https://developers.openai.com/plugins/build/plugins) do allow an npm package as a Codex marketplace source, but that is optional, not a prerequisite for a skill.

## What the examples actually ship

| Project | Easy install path | Why it also has more packaging |
| --- | --- | --- |
| [Caveman](https://github.com/JuliusBrussee/caveman/blob/main/README.md) | Claude Code: `/plugin marketplace add JuliusBrussee/caveman`, then `/plugin install caveman@caveman`. Its [install guide](https://github.com/JuliusBrussee/caveman/blob/main/docs/technical/install-and-update.md) also offers `npx -y github:JuliusBrussee/caveman` with agent detection and `--only claude` / `--only codex`; its [skill guide](https://github.com/JuliusBrussee/caveman/blob/main/docs/technical/skills-hooks-and-plugins.md) documents `npx skills add JuliusBrussee/caveman`. | Caveman also has hooks, a separate local runtime, and an [`@caveman-ai/cli` npm package](https://github.com/JuliusBrussee/caveman/blob/main/docs/technical/install-and-update.md). The npm CLI serves that runtime; it is not required just to install a response skill. |
| [Ponytail](https://github.com/DietrichGebert/ponytail/blob/main/README.md) | Claude Code: `/plugin marketplace add DietrichGebert/ponytail`, then `/plugin install ponytail@ponytail`. Codex: `codex plugin marketplace add DietrichGebert/ponytail`, then `codex plugin add ponytail@ponytail`. Its [install guide](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md) also offers `npx skills add DietrichGebert/ponytail`. | Ponytail packages multiple skills, commands, and session hooks to make its rules persistent. The [npm package](https://github.com/DietrichGebert/ponytail/blob/main/package.json) exports its OpenCode plugin; `npx skills add` installs the skill files, and Ponytail says that path alone does not add its always-on rules. |

The transferable pattern is a GitHub-hosted skill as the common core, with host-specific adapters only where behavior needs them. PRism does not need session hooks to gate a review on request. This is an inference from PRism's current [skill contract](../skills/prism-review/SKILL.md) and the cited distribution models.

## Host install routes

| Host | Plain skill | Plugin route, if later warranted |
| --- | --- | --- |
| Codex | Put `prism-review/SKILL.md` under repo `.agents/skills/` or user `~/.agents/skills/`; [current Codex docs](https://learn.chatgpt.com/docs/build-skills) list these locations. The Skills CLI can copy from GitHub. | [OpenAI docs](https://developers.openai.com/plugins/build/plugins) specify `codex plugin marketplace add owner/repo`, a marketplace catalog, and a plugin manifest. A skill-only plugin is supported. The desktop plugin browser installs from a configured marketplace. |
| Claude Code | Put `prism-review/SKILL.md` under repo `.claude/skills/` or user `~/.claude/skills/`; [Claude's skill docs](https://code.claude.com/docs/en/skills) explain both scopes. The Skills CLI can copy from GitHub. | A repo marketplace uses `.claude-plugin/marketplace.json`, and a plugin may have `.claude-plugin/plugin.json`; [Claude docs](https://code.claude.com/docs/en/plugin-marketplaces) describe the two-step marketplace add/install flow and validation. |

**Documentation correction:** PRism's README now names `.agents/skills/` and `~/.agents/skills/` for Codex, matching the [current Codex documentation](https://learn.chatgpt.com/docs/build-skills).

## Practical rollout

1. The README now shows one command prominently and keeps manual install instructions as a fallback. On 2026-10-23, `npx --yes skills add peterpapas/prism-review --list` discovered `prism-review` from GitHub; a temporary project install with `-a claude-code -a codex --copy -y` produced both agents' skill files.
2. Verify the installed skill can be invoked in clean Codex and Claude Code profiles. Also verify it does not activate for unrelated requests and still reports read-only limits. The [host docs](https://developers.openai.com/plugins/build/skills) recommend testing direct, indirect, and non-trigger requests.
3. If users want plugin browsing or managed updates, add a skills-only Claude marketplace and Codex marketplace. Validate the manifests and install from a clean profile before announcing those routes. [Claude](https://code.claude.com/docs/en/plugins) describes plugins as a way to package multiple components and versioned releases; [OpenAI](https://developers.openai.com/plugins/build/plugins) documents local marketplace authoring and installation.

Discovery and a temporary project install are verified. Global installation and use in clean agent profiles have not yet been tested. No PRism marketplace entries currently exist.
