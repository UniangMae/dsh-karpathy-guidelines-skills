# dsh-karpathy-guidelines-skills

DeepSeek Harness（DSH）插件：把 Andrej Karpathy 的四条编码行为准则做成一个**技能（skill）**，随包自带。装上后在技能列表里能看到 `karpathy-guidelines`，由 `skill` 工具按需加载（相关任务时模型也会按 description 自动调用）。

内容取自 [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)（MIT，原作者 forrestchang）里的 `skills/karpathy-guidelines/SKILL.md`，本包只加了 DSH 的注册层。

---

## 它做什么、不做什么

| | |
|---|---|
| **做** | 把包内 `skills/karpathy-guidelines/SKILL.md` 作为「随包技能」注册到 `ctx.skills`（provider 名 `dsh-karpathy-guidelines-skills`，rank 600 = `BUNDLED_SKILL_RANK`），只读目录、按需读正文 |
| **不做** | **不注入系统提示词**、不往工作区写文件、不联网、不要求 `skill-filesystem` 扫描目录 |
| **依赖** | 无运行时依赖。纯 ESM，没有构建步骤，所以不需要 `allowBuilds` |
| **需要** | 运行中要有 skills 注册表（`@deepseek-ai/dsh-skill`）。本机 desktop profile 已有（其它技能能列出即为证） |
| **加载方式** | `description` 驱动：相关任务时模型可自动调用，也可以手动 `skill({ name: "karpathy-guidelines" })` |

> 与旧的注入版（`dsh-plugin-karpathy-guidelines`）的区别：旧版每一轮都往系统提示词里塞一段；本包是**按需加载的技能**，不再占用每轮提示词。

## 安装

命令形式：`dsh plugin --profile <你的profile名> add <来源>`

**方式 1 —— 本地目录**（开发 / 自测，pnpm link）

```
dsh plugin --profile desktop add "F:\DeepseekHarness_proj\workzone\work008_agent行为改善\dsh-karpathy-guidelines-skills"
```

**方式 2 —— npm 公开包**（发布之后）

```
dsh plugin --profile desktop add dsh-karpathy-guidelines-skills
```

**方式 3 —— GitHub 仓库**（仓库根目录必须就是本目录内容）

```
dsh plugin --profile desktop add github:<你的GitHub用户名>/dsh-karpathy-guidelines-skills
```

本包没有 `prepare`/构建步骤，pnpm 不需要构建授权，**不用**改 `allowBuilds`。

> **本机实测：装完不用重启就生效。** 安装完成后 `skill({ name: "karpathy-guidelines" })` 立刻返回了 SKILL.md 正文（2026-10-13，desktop profile）。如果技能列表一时没刷新出来，重启一次 DSH 即可 —— 与提示词相关的内容是在 agent 会话开始时组装的，新会话才一定可见。

## 开关与卸载

- **临时关掉**：在插件列表里禁用 `skills-karpathy-guidelines` 这一行。
- **永久改行为**：在你 profile 的 `cordis.patch.yml` 里按行整体覆盖（后加载的层按行替换，不做深合并）：

```yaml
- insert:
    - id: skills-karpathy-guidelines
      name: dsh-karpathy-guidelines-skills
      config: {}
```

- **卸载**：

```
dsh plugin --profile desktop remove dsh-karpathy-guidelines-skills
```

子命令名在不同版本可能是 `rm` / `uninstall`，以 `dsh plugin --help` 为准。

## 配置

本包**没有配置项**（`config: {}`）。技能目录固定为包内 `skills/`。

## 技能内容

- 文件：`skills/karpathy-guidelines/SKILL.md`（**上游原样，2518 字节，逐字节一致**）
- frontmatter：`name: karpathy-guidelines`、`description: ...`、`license: MIT`
- 四条准则：Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven Execution
- 要改内容就直接改这个文件；要加技能就在 `skills/` 下再建一个 `<技能名>/SKILL.md`（技能名必须 kebab-case）

## 怎么算装成功了

1. 技能列表里出现 `karpathy-guidelines`。
2. `skill({ name: "karpathy-guidelines" })` 返回 SKILL.md 正文，而不再是 `skill "karpathy-guidelines" is unknown or no longer available`。
3. 系统提示词里**不再**出现被注入的那份指南（旧注入版会以 `# Karpathy Coding Guidelines` 开头出现）。

## 发布（给维护者）

两种发布目标都不需要构建步骤。

> 没用过 GitHub？看 [`PUBLISH_GITHUB.zh.md`](./PUBLISH_GITHUB.zh.md)：从注册账号、建仓库、网页拖拽上传（完全不用装软件）到 `git push`、加 `dsh-plugin` topic、验证别人能否安装，逐步说明 + 报错速查。

**npm**

```
npm publish          # 在本包目录里执行
npm pack             # 或者：生成 dsh-karpathy-guidelines-skills-1.0.0.tgz 用于离线分发
```

**GitHub —— 包必须放在仓库根目录**

```
git init
git add .
git commit -m "dsh-karpathy-guidelines-skills 1.0.0"
git remote add origin https://github.com/<你的GitHub用户名>/dsh-karpathy-guidelines-skills.git
git push -u origin main
```

推完后给仓库加上 [`dsh-plugin` topic](https://github.com/topics/dsh-plugin)，别人才找得到。如果仓库根不是本包内容（比如包在子目录里），`github:<你>/<仓库>` 就装不上——pnpm 只读仓库根的 `package.json`。

## 归属与版本

- 上游：https://github.com/multica-ai/andrej-karpathy-skills
- 取用版本：commit `2c606141936f1eeef17fa3043a72095b4765b9c2`
- 许可：MIT，版权归原作者（forrestchang）；本包同样以 MIT 发布，见 `LICENSE`

## 验证状态

- 结构照抄本机已实测可用的技能型 bundle `dsh-mattpocock-skills`：同样的 `package.json` → `dsh.bundle.patch` → `cordis.patch.yml` 插入一行 → `ctx.inject(['skills'], …)` + `ctx.skills.registerProvider(() => provider)`；候选字段（`name` / `description` / `invocation` / `provider` / `source: 'bundled'` / `rank: 600` / `resourceBase` / `locator`）与 `get()` 的 `{ ...candidate, content }` 返回契约也一致。
- 本机实测（2026-10-13，desktop profile）：装上后 `skill({ name: "karpathy-guidelines" })` 返回 SKILL.md 正文，解析到的目录就是本包内的 `skills/karpathy-guidelines/`，**无需重启**。同一次探测里 `skill({ name: "tdd" })`、`skill({ name: "code-review" })`（来自 `dsh-mattpocock-skills`）也正常，说明技能工具本身可用。
