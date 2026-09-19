# truss3-website

Truss3 官方站点仓库，采用 pnpm workspaces + Turborepo 管理的 monorepo 结构。

## 环境要求

| 依赖    | 版本       | 说明                                    |
| ------- | ---------- | --------------------------------------- |
| Node.js | `>= 22.12` | 见 `.node-version`，Astro 7 的硬性要求  |
| pnpm    | `>= 10`    | 见根 `package.json` 的 `packageManager` |

推荐使用 [fnm](https://github.com/Schniz/fnm) 管理 Node 版本，仓库已配置 `.node-version`，进入目录会自动切换：

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
fnm install
```

## 快速开始

```bash
pnpm install
pnpm dev
```

`pnpm dev` 会通过 Turborepo 启动所有应用的开发服务。当前只有一个站点，默认地址为 http://localhost:4321。

## 目录结构

```
.
├── apps/
│   └── conversation-web/          # 纯静态官方网站（Astro）
│       ├── public/                # 原样拷贝的静态资源
│       └── src/
│           ├── components/        # 可复用 UI 组件
│           ├── layouts/           # 页面骨架（含全局 SEO meta）
│           ├── pages/             # 文件路由，文件路径即 URL
│           └── styles/            # 全局样式与设计变量
├── packages/                      # 预留：跨应用共享的内部包
├── .github/workflows/             # CI 与部署流水线
└── turbo.json                     # 任务编排与缓存配置
```

`packages/` 当前为空。需要沉淀共享代码（UI 组件、配置、工具函数）时，在其中新建包并在应用 `package.json` 中以 `workspace:*` 引用即可，`pnpm-workspace.yaml` 已提前纳入该目录。

## 常用命令

在**仓库根目录**执行，Turborepo 会分发到所有工作区：

| 命令                | 作用                         |
| ------------------- | ---------------------------- |
| `pnpm dev`          | 启动开发服务器（热更新）     |
| `pnpm build`        | 构建生产产物到 `apps/*/dist` |
| `pnpm preview`      | 本地预览已构建的产物         |
| `pnpm lint`         | ESLint 检查                  |
| `pnpm lint:fix`     | ESLint 自动修复              |
| `pnpm typecheck`    | `astro check` 类型与模板检查 |
| `pnpm format`       | Prettier 格式化全部文件      |
| `pnpm format:check` | 仅校验格式（CI 使用）        |
| `pnpm clean`        | 清理构建产物与缓存           |

只操作单个应用时使用 `--filter`：

```bash
pnpm --filter @truss3/conversation-web dev
pnpm --filter @truss3/conversation-web build
```

## 工程规范

- **格式化**：Prettier 统一管控，配置见 `.prettierrc.json`。提交前请确保 `pnpm format:check` 通过。
- **Lint**：ESLint 10 flat config，见根目录 `eslint.config.mjs`。收敛的规则包括 `eqeqeq`、`no-var`、`prefer-const`、`no-console`、`@typescript-eslint/no-unused-vars` 等。
- **类型**：应用的 `tsconfig.json` 继承 `astro/tsconfigs/strictest`，并额外开启 `noUnusedLocals`、`exactOptionalPropertyTypes`、`verbatimModuleSyntax`。
- **TypeScript 版本锁定**：必须停留在 `6.0.x`。`typescript-eslint` 要求 `<6.1.0`，`@astrojs/check` 要求 `^5 || ^6`，升级 TS 前需先确认这两个工具已跟进。
- **EditorConfig**：统一 LF 行尾与 2 空格缩进，见 `.editorconfig`。
- **提交规范**：建议使用 [Conventional Commits](https://www.conventionalcommits.org/) 前缀（`feat:`、`fix:`、`chore:`、`docs:` 等）。

## 构建与环境变量

站点的绝对地址通过环境变量注入，不硬编码在源码中：

| 变量        | 默认值                  | 说明                                          |
| ----------- | ----------------------- | --------------------------------------------- |
| `SITE_URL`  | `http://localhost:4321` | 用于生成 canonical、sitemap、OG 的绝对 URL    |
| `BASE_PATH` | `/`                     | 站点部署在子路径时使用，如 `/truss3-website/` |

`robots.txt` 与 sitemap 均由 `SITE_URL` 动态生成，绑定自定义域名后无需手改任何文件。

## 部署到 GitHub Pages

推送到 `main` 分支后，`.github/workflows/deploy-pages.yml` 会自动构建并发布。

### 步骤 1：开启 Pages

**Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

这一步是必须的：仓库默认未开启 Pages，未开启时 `deploy-pages` 步骤会直接失败。

### 步骤 2：告诉仓库你的域名

**Settings → Secrets and variables → Actions → Variables** 新建一个变量：

| Name            | Value        |
| --------------- | ------------ |
| `CUSTOM_DOMAIN` | `truss3.com` |

只填域名，**不要带 `https://` 或结尾斜杠**。

设置后，工作流会据此推导 `SITE_URL`（`https://<domain>`）与 `BASE_PATH`（`/`），并在产物中写入 `CNAME` 文件。这样即使首次部署时 Pages 设置里还没有域名，生成的 canonical / sitemap 也是正确的。

> 若暂时不绑域名，可跳过此步，站点会以 `https://<org>.github.io/<repo>/` 的形式可访问。

### 步骤 3：配置 DNS 解析

在你的域名服务商（Cloudflare / 阿里云 / GoDaddy 等）处添加记录。

#### 情况 A：根域名（`truss3.com`）

添加 **4 条 `A` 记录**，主机记录填 `@`：

| 类型 | 主机记录 | 记录值            |
| ---- | -------- | ----------------- |
| A    | `@`      | `185.199.108.153` |
| A    | `@`      | `185.199.109.153` |
| A    | `@`      | `185.199.110.153` |
| A    | `@`      | `185.199.111.153` |

可选再添加 4 条 `AAAA` 记录（IPv6）：

| 类型 | 主机记录 | 记录值                |
| ---- | -------- | --------------------- |
| AAAA | `@`      | `2606:50c0:8000::153` |
| AAAA | `@`      | `2606:50c0:8001::153` |
| AAAA | `@`      | `2606:50c0:8002::153` |
| AAAA | `@`      | `2606:50c0:8003::153` |

> 官方建议即使配置了 IPv6，也保留 `A` 记录，因为 IPv6 普及度仍不均衡。

#### 情况 B：子域名（`www.truss3.com`）

添加 **1 条 `CNAME` 记录**：

| 类型  | 主机记录 | 记录值             |
| ----- | -------- | ------------------ |
| CNAME | `www`    | `truss3.github.io` |

> 子域名比根域名更稳定：GitHub 的服务器 IP 变更时无需改动 DNS。推荐把根域名做 301 跳转到 `www`。

#### 同时配置根域名与 `www`

两者都配置好后，GitHub 会自动在它们之间建立跳转。跳转方向取决于你在 Pages 设置里填的 Custom domain 是哪一个。

#### ⚠️ Cloudflare 用户注意

代理状态（橙色云朵）必须设为 **DNS only（灰色云朵）**。开启代理会导致 GitHub 无法签发 HTTPS 证书，站点报 525/526 错误。

### 步骤 4：在 Pages 设置中填写域名

**Settings → Pages → Custom domain** 填入域名并保存。GitHub 会做一次 DNS 检查。

若 DNS 尚未生效，这里会提示失败——不必担心，等 DNS 生效后重新保存即可。工作流中的 `CNAME` 文件也会在每次部署时自动同步该设置。

### 步骤 5：开启 HTTPS

DNS 生效后，**Settings → Pages → Enforce HTTPS** 打勾。

GitHub 会自动申请 Let's Encrypt 证书，通常几分钟内完成，最长可能需要 24 小时。证书签发前 `Enforce HTTPS` 可能是灰色不可选状态，属正常现象。

### 组织域名验证（推荐）

仓库归属 `truss3` 组织，建议做一次域名归属验证，防止域名被其他仓库抢注：

**组织 Settings → Pages → Add a domain** 填入域名，GitHub 会给出一个类似 `_github-pages-challenge-truss3` 的 TXT 记录，在你的 DNS 服务商添加后点击 **Verify** 即可。

### 排查：部署成功了但网站打不开

| 现象                    | 原因与处理                                                              |
| ----------------------- | ----------------------------------------------------------------------- |
| `deploy-pages` 步骤报错 | Pages 未开启，回到步骤 1                                                |
| 打开域名显示 404        | DNS 未生效（`dig truss3.com +short` 检查），或自定义域名未在步骤 4 保存 |
| 提示证书错误 / 525      | Cloudflare 代理未关闭，或 HTTPS 证书仍在签发中                          |
| 样式丢失、页面空白      | `BASE_PATH` 与实际部署路径不符，检查 `CUSTOM_DOMAIN` 是否设置正确       |
| 域名被提示已被占用      | 该域名已被其他 GitHub 账号或仓库绑定，需先在原处释放                    |

DNS 传播通常几分钟到 48 小时不等。修改 DNS 后，用 `dig <域名> +short` 或 `nslookup` 确认解析结果。

## CI

`.github/workflows/ci.yml` 在推送与 PR 时依次执行：格式检查 → Lint → 类型检查 → 构建。四步全部通过才视为合格提交。

## 未来扩展

新增应用时，在 `apps/` 下创建目录并在其 `package.json` 中声明 `dev` / `build` / `lint` / `typecheck` 脚本，Turborepo 会自动纳入编排，无需改动根配置。
