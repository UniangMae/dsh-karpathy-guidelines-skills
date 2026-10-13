# 一步步把 dsh-karpathy-guidelines-skills 发布到 GitHub

面向完全没用过 GitHub 的人。照着做即可，**不需要懂编程，也不需要构建步骤**（本包是纯 JS，没有编译）。

发布完成后，别人这样安装你的技能包：

```
dsh plugin --profile <他的profile> add github:<你的用户名>/dsh-karpathy-guidelines-skills
```

---

## 0. 先搞清楚三件事

| 问题 | 答案 |
|---|---|
| 要上传什么？ | 就是 `F:\DeepseekHarness_proj\workzone\work008_agent行为改善\dsh-karpathy-guidelines-skills\` 里的 **8 个文件**（含 `skills` 文件夹） |
| 上传到哪里？ | 一个新建的 **Public（公开）** GitHub 仓库的**根目录**（不能放在子文件夹里） |
| 为什么必须公开？ | 私有仓库别人拉不下来；`dsh plugin add github:...` 默认不带登录凭据 |

仓库根目录最终必须长这样（大小写一致）：

```
package.json          ← 必须在这里，pnpm 只读仓库根的这个文件
index.js
cordis.patch.yml
skills/
  karpathy-guidelines/
    SKILL.md
LICENSE
README.md
README.zh.md
.gitignore
PUBLISH_GITHUB.zh.md  ← 本文件，可有可无
```

> 常见的两个致命错误：① 把外层文件夹 `dsh-karpathy-guidelines-skills` 整个拖进去，导致仓库根变成 `dsh-karpathy-guidelines-skills/package.json`（多一层，装不上）；② 没上传 `skills/` 文件夹，装上后技能列表里有名字但**加载不出正文**。

---

## 路线 A：完全用网页上传（不用装任何软件，推荐第一次用）

### A1. 注册 / 登录 GitHub

1. 打开 <https://github.com/signup>
2. 依次填：邮箱 → 密码 → 用户名（Username，**这个就是别人安装命令里的 `<你的用户名>`**，只能用字母数字和短横线）→ 过一下人机验证 → 去邮箱点验证码。
3. 已有账号就直接 <https://github.com/login> 登录。

### A2. 新建仓库

1. 登录后点右上角 **`+`** → **`New repository`**（或直接打开 <https://github.com/new>）。
2. **Repository name** 填：`dsh-karpathy-guidelines-skills`（建议与包名完全一致，等号后面那串命令才不用改仓库名）。
3. **Description** 随便写，例如：`DSH plugin: Karpathy coding guidelines as a loadable skill`。
4. 选 **Public**。
5. **不要**勾 `Add a README file`、**不要**选 `.gitignore` 模板、**不要**选 license（我们包里自带 `LICENSE` 和 `.gitignore`，勾了会冲突，push 时要额外处理）。
6. 点绿色 **`Create repository`**。

### A3. 上传文件

1. 新仓库页面上有一行 `Quick setup — if you've done this kind of thing before`，点其中的 **`uploading an existing file`** 链接；
   （或者顶部 **`Add file`** → **`Upload files`**。）
2. 打开 Windows 资源管理器，进入：
   `F:\DeepseekHarness_proj\workzone\work008_agent行为改善\dsh-karpathy-guidelines-skills`
3. 先让隐藏文件可见，否则漏掉 `.gitignore`：资源管理器 → **查看** → **显示** → 勾上 **隐藏的项目**。
4. `Ctrl+A` 全选该目录下的**所有内容**（8 个文件 + `skills` 文件夹），**不要**选中外层那个 `dsh-karpathy-guidelines-skills` 目录本身。直接**拖到浏览器那个虚线框**里。
5. 等每个文件都显示上传完成（`skills/karpathy-guidelines/SKILL.md` 会自动保持层级）。
6. 页面下方 **Commit changes** 区域填一句说明，例如 `dsh-karpathy-guidelines-skills 1.0.0`，点 **`Commit changes`**。

### A4. 检查

仓库首页应该**直接**看到 `package.json`、`index.js`、`cordis.patch.yml`、`LICENSE`、`README.md`、`README.zh.md`、`skills` 文件夹。
如果看到一个文件夹 `dsh-karpathy-guidelines-skills`，说明多套了一层 → 见下面【排错 Q6】。

### A5. 加 topic（**必做**，否则没人搜得到你）

1. 在仓库首页右侧 **About** 那一栏，点 **齿轮图标 ⚙**。
2. **Topics** 里输入 `dsh-plugin`，回车，再点 **`Save changes`**。
   （也可以直接打开 `https://github.com/<你的用户名>/dsh-karpathy-guidelines-skills/topics` 编辑。）

到此发布完成。跳到【第 3 节 验证】。

---

## 路线 B：用 Git 命令行（推荐，以后更新版本方便）

### B1. 安装 Git（只需一次）

1. 下载：<https://git-scm.com/download/win>（选 `64-bit Git for Windows Setup`），一路默认下一步即可。
2. 装完后**重新打开**一个新的 PowerShell / 终端窗口，验证：

```powershell
git --version
```

能打印出版本号（例如 `git version 2.51.0.windows.1`）就成功。

### B2. 告诉 Git 你是谁（只需一次）

```powershell
git config --global user.name "你的名字或昵称"
git config --global user.email "你注册GitHub用的邮箱"
git config --global core.quotepath false
```

最后一行只是让中文路径在 `git status` 里正常显示，可选。

### B3. 在包目录里初始化并提交

逐行复制执行（注意第一行的 `cd` 必须进到**包目录**本身）：

```powershell
cd /d "F:\DeepseekHarness_proj\workzone\work008_agent行为改善\dsh-karpathy-guidelines-skills"
git init
git add .
git status
```

`git status` 里应该看到 8~9 个待提交文件（`package.json`、`index.js`、`cordis.patch.yml`、`skills/karpathy-guidelines/SKILL.md`、`LICENSE`、`README.md`、`README.zh.md`、`.gitignore`）。
**不应该**出现 `node_modules`（`.gitignore` 已排除）。

```powershell
git commit -m "dsh-karpathy-guidelines-skills 1.0.0"
git branch -M main
```

### B4. 关联你在网页上刚建的仓库并推送

先把仓库建好（同【A2】，但这次**不要**上传任何文件，建一个空仓库）。

```powershell
git remote add origin https://github.com/<你的用户名>/dsh-karpathy-guidelines-skills.git
git push -u origin main
```

推送时会要求登录：

- 正常情况下会**自动弹出浏览器窗口**让你登录 GitHub（Git for Windows 自带 Git Credential Manager），登录一次以后就不用再登。
- 如果它只给一个命令行提示要 `Username` / `Password`：`Username` 填 GitHub 用户名，`Password` **不能填账号密码**，要填 Personal Access Token：
  1. 打开 <https://github.com/settings/tokens> → **Generate new token** → **Fine-grained token**；
  2. `Repository access` 选 `All repositories`（或只选这一个仓库）；
  3. `Permissions` → `Repository permissions` → **Contents = Read and write**；
  4. 生成后**立刻复制**那串 `github_pat_...`，粘到密码位置（它只显示一次）。

### B5. 加 topic

同【A5】：仓库首页右侧 About → ⚙ → Topics 填 `dsh-plugin` → Save。

---

## 3. 验证：确认别人真的能装

### 3.1 先看仓库是否合格（网页自检）

打开 `https://github.com/<你的用户名>/dsh-karpathy-guidelines-skills`，确认：

- [ ] 仓库是 **Public**
- [ ] 根目录直接有 `package.json`，点开后里面有 `"dsh": { "bundle": { "patch": "./cordis.patch.yml" } }`
- [ ] 根目录有 `cordis.patch.yml`
- [ ] 有 `skills/karpathy-guidelines/SKILL.md`
- [ ] About 区域能看到 `dsh-plugin` 这个 topic

### 3.2 用 GitHub 源真的装一次（可选，但最可靠）

本机现在是「本地目录 link」安装。要验证线上源，先卸掉本地那份、再从 GitHub 装：

```powershell
dsh plugin --profile desktop remove dsh-karpathy-guidelines-skills
dsh plugin --profile desktop add github:<你的用户名>/dsh-karpathy-guidelines-skills
dsh plugin --profile desktop list
```

装好后在一个**新会话**里让模型执行 `skill({ name: "karpathy-guidelines" })`，能返回正文即成功。
（如果想立刻切回本地开发模式：再 `remove` 一次，然后 `add "F:\DeepseekHarness_proj\workzone\work008_agent行为改善\dsh-karpathy-guidelines-skills"`。）

### 3.3 告诉别人怎么装

把这一句发给他（把 `<你的用户名>` 换掉）：

```
dsh plugin --profile desktop add github:<你的用户名>/dsh-karpathy-guidelines-skills
```

---

## 4. 以后要改内容 / 发新版本

1. 改文件（例如直接编辑 `skills/karpathy-guidelines/SKILL.md`）。
2. 把 `package.json` 里的 `"version": "1.0.0"` 往上加，例如 `1.1.0`（版本号只能变大，不能重复）。
3. 路线 A 用户：在仓库页面点开要改的文件 → 铅笔图标 ✏ 编辑 → Commit changes。
   路线 B 用户：

```powershell
cd /d "F:\DeepseekHarness_proj\workzone\work008_agent行为改善\dsh-karpathy-guidelines-skills"
git add .
git commit -m "1.1.0: 更新说明"
git push
```

4. 别人更新：先 `remove` 再 `add github:...`（pnpm 可能缓存旧版本，`remove`+`add` 最省心）。

---

## 5. 可选：顺手发到 npm（这样别人可以只写包名安装）

需要先有 npm 账号（<https://www.npmjs.com/signup>）：

```powershell
cd /d "F:\DeepseekHarness_proj\workzone\work008_agent行为改善\dsh-karpathy-guidelines-skills"
npm login
npm publish
```

发布后别人就能用：`dsh plugin --profile desktop add dsh-karpathy-guidelines-skills`。
想只生成离线压缩包给别人，用 `npm pack`，得到 `dsh-karpathy-guidelines-skills-1.0.0.tgz`，别人 `add "路径\...tgz"` 即可。
（`package.json` 里可顺手补上 `"repository": "https://github.com/<你的用户名>/dsh-karpathy-guidelines-skills"`，非必需。）

---

## 6. 排错速查

| 现象 | 原因 / 解决 |
|---|---|
| `git : 无法将“git”项识别为 cmdlet...` | 没装 Git，或装完没重开终端 → 走【B1】 |
| `fatal: not a git repository` | 当前目录不对 → 先 `cd /d "包目录"` |
| `remote origin already exists` | 已配过 → `git remote set-url origin https://github.com/<你>/<仓库>.git` |
| `Authentication failed` | 密码位置要填 PAT（【B4】），不是 GitHub 登录密码 |
| `! [rejected] main -> main (fetch first)` | 网页上已经有文件（比如建仓库时勾了 README）→ 先 `git pull --rebase origin main`，再 `git push` |
| `git push` 一直卡住/超时 | 网络问题 → 改用**路线 A 网页上传**，或给 git 配代理：`git config --global http.proxy http://127.0.0.1:端口` |
| 仓库里多了一层文件夹 | 上传时把外层目录也拖进去了 → 进那个文件夹逐个删掉，重新按【A3】只拖里面内容 |
| 仓库是 Private，别人装不上 | 仓库 Settings → General → 最下面 Danger Zone → Change visibility → Public |
| 别人装时报找不到 `package.json` | `package.json` 不在仓库根（同上，多了一层） |
| 装上了，技能列表有名字，但加载是空的 | `skills/karpathy-guidelines/SKILL.md` 没上传，或名字被改成非 kebab-case |
| `git status` 里中文文件名显示成 `\344\270\255` | 执行 `git config --global core.quotepath false` |

---

## 7. 收尾清单

- [ ] 仓库是 Public，根目录直接有 `package.json` / `index.js` / `cordis.patch.yml` / `skills/`
- [ ] 已加 `dsh-plugin` topic
- [ ] 用 `dsh plugin --profile desktop add github:<你>/dsh-karpathy-guidelines-skills` 实测装成功
- [ ] `skill({ name: "karpathy-guidelines" })` 返回正文
- [ ] 上游归属保留：`LICENSE`（MIT，forrestchang）+ README 里的来源链接
