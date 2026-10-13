// dsh-karpathy-guidelines-skills plugin entry.
//
// The skill body under skills/ is the upstream multica-ai/andrej-karpathy-skills
// SKILL.md verbatim (MIT — see LICENSE and README). This file is the only dsh
// adaptation layer: it registers the bundled skill with the dsh skills registry,
// so the `skill` tool can list and load it. Nothing is injected into the system
// prompt.
//
// The provider pattern (scan a package-relative skills directory, expose catalog
// metadata eagerly and the SKILL.md body lazily) mirrors the bundled-skill
// provider used by dsh-mattpocock-skills, which is verified working on this
// machine.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Plugin name; must match the `name` field in package.json. */
export const name = 'dsh-karpathy-guidelines-skills'

/** Provider identity reported to the skills registry for every candidate. */
const PROVIDER = 'dsh-karpathy-guidelines-skills'

/**
 * dsh's documented rank for packaged skill providers (`BUNDLED_SKILL_RANK` in
 * @deepseek-ai/dsh-skill). Kept as a literal so this package needs no runtime
 * dependency.
 */
const RANK = 600

/** Package-relative skills root: skills/<skill-name>/SKILL.md. */
const SKILLS_BASE = fileURLToPath(new URL('./skills/', import.meta.url))

/** Upstream skills carry no invocation restrictions; both surfaces are open. */
const INVOCATION = { modelInvocable: true, userInvocable: true }

/**
 * Read the `description:` line from a SKILL.md YAML front matter block, falling
 * back to the first non-heading paragraph, then to a generic string.
 *
 * @param body - the full SKILL.md text
 */
function describe(body) {
  const frontMatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(body)
  if (frontMatter) {
    const line = frontMatter[1].split(/\r?\n/).find((entry) => entry.startsWith('description:'))
    if (line) return line.slice('description:'.length).trim()
  }
  const paragraph = body.split(/\r?\n/).find((line) => line.trim() && !line.startsWith('#'))
  return paragraph ? paragraph.trim() : `${PROVIDER} skill`
}

/**
 * Enumerate bundled skills as registry candidates.
 *
 * Scans `skills/<skill-name>/SKILL.md` (one directory level — the layout this
 * package ships). Only directories containing a SKILL.md contribute.
 */
function listBundledSkills() {
  const skills = []
  let entries
  try {
    entries = readdirSync(SKILLS_BASE, { withFileTypes: true })
  } catch (error) {
    // A package whose skills dir is missing is broken; surface the reason
    // instead of booting the registry with a silently empty catalog.
    console.warn(`[${PROVIDER}] cannot scan ${SKILLS_BASE}: ${error.message}`)
    return skills
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const directory = join(SKILLS_BASE, entry.name)
    const locator = join(directory, 'SKILL.md')
    if (!existsSync(locator)) continue
    let body
    try {
      body = readFileSync(locator, 'utf8')
    } catch (error) {
      // One unreadable SKILL.md must not take down the whole catalog.
      console.warn(`[${PROVIDER}] skipping unreadable skill ${entry.name}: ${error.message}`)
      continue
    }
    skills.push({
      name: entry.name,
      description: describe(body),
      invocation: INVOCATION,
      provider: PROVIDER,
      source: 'bundled',
      rank: RANK,
      resourceBase: { kind: 'directory', path: directory },
      locator,
    })
  }
  return skills
}

/**
 * Register the bundled skill with the dsh skills registry.
 *
 * `ctx.inject(['skills'], ...)` waits for the skills service instead of
 * hard-depending on it, so this plugin still loads in a composition where the
 * registry is absent. Only catalog metadata is read at boot; the SKILL.md body
 * is read on demand by the provider's `get()`.
 *
 * @param ctx - plugin context handed to `apply()`
 */
export function apply(ctx) {
  ctx.inject(['skills'], (skillCtx) => {
    const candidates = listBundledSkills()
    if (candidates.length === 0) {
      console.warn(`[${PROVIDER}] no bundled skills found under skills/ — catalog will be empty`)
      return
    }
    const provider = {
      name: PROVIDER,
      list: () => Promise.resolve(candidates),
      async get(candidate) {
        try {
          return { ...candidate, content: readFileSync(candidate.locator, 'utf8') }
        } catch {
          // undefined is the registry's not-found contract.
          return undefined
        }
      },
    }
    skillCtx.skills.registerProvider(() => provider)
  })
}
