# dsh-karpathy-guidelines-skills

A DeepSeek Harness (DSH) plugin that ships Andrej Karpathy's four coding guidelines as a **loadable skill**. Once installed, `karpathy-guidelines` appears in the skill list and can be loaded on demand by the `skill` tool (the model may also auto-load it from its `description` when relevant).

The skill body is taken verbatim from [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) (MIT, original author forrestchang), specifically `skills/karpathy-guidelines/SKILL.md`. This package only adds the DSH registration layer.

---

## What it does / does not do

| | |
|---|---|
| **Does** | Registers the bundled `skills/karpathy-guidelines/SKILL.md` with `ctx.skills` (provider `dsh-karpathy-guidelines-skills`, rank 600 = `BUNDLED_SKILL_RANK`); reads the catalog eagerly and the body lazily |
| **Does not** | **Inject anything into the system prompt**, write into your workspaces, use the network, or require `skill-filesystem` directory scanning |
| **Runtime dependencies** | None. Plain ESM, no build step, so no `allowBuilds` entry is needed |
| **Requires** | The skills registry (`@deepseek-ai/dsh-skill`) to be present at runtime. It is on this machine's `desktop` profile (other skills list fine) |
| **Loading** | `description`-driven: the model can load it for relevant tasks, or you can call `skill({ name: "karpathy-guidelines" })` yourself |

> Difference from the older injection plugin (`dsh-plugin-karpathy-guidelines`): that one pushed a section into every system prompt; this package is an **on-demand skill** and costs nothing per turn until it is loaded.

## Install

`dsh plugin --profile <profile> add <source>`

```
# 1) local directory (development / self-test, pnpm link)
dsh plugin --profile desktop add "<Your path>\dsh-karpathy-guidelines-skills"

# 2) from npm (after publishing)
dsh plugin --profile desktop add dsh-karpathy-guidelines-skills (Not yet released)

# 3) from GitHub (the repository root must be this package)
dsh plugin --profile desktop add github:UniangMae/dsh-karpathy-guidelines-skills
```

> **Measured on this machine: no restart needed.** Right after the install, `skill({ name: "karpathy-guidelines" })` returned the SKILL.md body (2026-10-13, `desktop` profile). If the skill list does not refresh, restart DSH once — prompt-side content is assembled when an agent session starts, so a new session is what guarantees it.

## Toggle and uninstall

- Disable the `skills-karpathy-guidelines` row in the plugin list to turn it off.
- Override the whole row in your profile's `cordis.patch.yml` (later layers replace rows whole; there is no deep merge):

```yaml
- insert:
    - id: skills-karpathy-guidelines
      name: dsh-karpathy-guidelines-skills
      config: {}
```

- Uninstall:

```
dsh plugin --profile desktop remove dsh-karpathy-guidelines-skills
```

## Configuration

None (`config: {}`). The skills directory is fixed at `skills/` inside the package.

## Skill content

- File: `skills/karpathy-guidelines/SKILL.md` — **upstream verbatim, 2518 bytes, byte-identical**
- Front matter: `name: karpathy-guidelines`, `description: …`, `license: MIT`
- Four principles: Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven Execution
- To add another skill, create `skills/<kebab-case-name>/SKILL.md`.

## How to tell it worked

1. `karpathy-guidelines` shows up in the skill list.
2. `skill({ name: "karpathy-guidelines" })` returns the SKILL.md body instead of `skill "karpathy-guidelines" is unknown or no longer available`.
3. The system prompt no longer contains an injected copy of the guidelines (the older injection plugin made it appear under the heading `# Karpathy Coding Guidelines`).

## Publishing (maintainers)

Neither target needs a build step.

> New to GitHub? See [`PUBLISH_GITHUB.zh.md`](./PUBLISH_GITHUB.zh.md) (Chinese): account signup, creating the repo, drag-and-drop upload with no software installed, `git push`, the required `dsh-plugin` topic, how to verify that someone else can install it, and a troubleshooting table.

```
npm publish          # run inside this package
npm pack             # or: produce dsh-karpathy-guidelines-skills-1.0.0.tgz for offline distribution
```

For GitHub, the package must sit at the repository root (pnpm only reads the root `package.json`), then add the [`dsh-plugin` topic](https://github.com/topics/dsh-plugin).

## Attribution

- Upstream: https://github.com/multica-ai/andrej-karpathy-skills
- Pinned commit: `2c606141936f1eeef17fa3043a72095b4765b9c2`
- License: MIT, copyright the original author (forrestchang); this package is MIT too, see `LICENSE`.
