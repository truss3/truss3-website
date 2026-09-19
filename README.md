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

## 部署

推送到 `main` 分支后，`.github/workflows/deploy-pages.yml` 会自动构建并发布到 GitHub Pages。

首次启用需要在仓库完成两项设置：

1. **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
2. 如需自定义域名，在 **Settings → Pages → Custom domain** 填入域名，并按提示配置 DNS：
   - 根域名：添加 `A` 记录指向 GitHub Pages 的 IP
   - 子域名（如 `www`）：添加 `CNAME` 记录指向 `<org>.github.io`

绑定自定义域名后，工作流中的 `actions/configure-pages` 会自动推导出正确的站点地址与 base 路径，无需修改代码。若还希望每次部署显式保留 `CNAME` 文件，可在 **Settings → Secrets and variables → Actions → Variables** 中新增名为 `CUSTOM_DOMAIN` 的变量，值为你的域名。

同时请更新 `apps/conversation-web/public/robots.txt` 中的 sitemap 地址为正式域名。

## CI

`.github/workflows/ci.yml` 在推送与 PR 时依次执行：格式检查 → Lint → 类型检查 → 构建。四步全部通过才视为合格提交。

## 未来扩展

新增应用时，在 `apps/` 下创建目录并在其 `package.json` 中声明 `dev` / `build` / `lint` / `typecheck` 脚本，Turborepo 会自动纳入编排，无需改动根配置。
