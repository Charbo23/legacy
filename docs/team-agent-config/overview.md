# team-agent-config：项目概况

## 项目定位

[GitHub `ehafo/team-agent-config`](https://github.com/ehafo/team-agent-config) 是团队 AI Coding 工具配置同步器，命令行工具名称为 `tac`。它维护一份团队配置源，再分发到成员本机的 Claude Code、Codex CLI 等工具，并支持个人配置覆盖和贡献内容回流。

它与易哈佛前台是并列的逻辑项目，不承载具体业务页面；前台项目中的 Agent 协作方式、skills、hooks 和提示词落地，可能依赖它提供的同步能力。

## 管理内容

- Skills、Subagents、Hooks 和 Prompts。
- Claude / Codex 的 MCP servers、Settings、权限和环境配置。
- 团队配置与个人非敏感变量的分层管理；敏感值不进入 Git。
- 独立运行时目录，用于 hook 日志、统计和缓存，不污染 `~/.claude` 或 `~/.codex`。

## 接手时先记住的入口

```bash
tac init       # 首次初始化团队配置
tac sync       # 拉取并落地最新团队配置
tac doctor     # 检查 symlink、wrapper 和同步状态
tac status     # 查看当前同步状态
tac diff       # 对比团队源与本机落地差异
tac ui         # 打开本地配置页面
```

个人已有 skill 需要回流时，优先使用 `tac contribute skill` 从 Claude 或 Codex 目录生成贡献草稿，再用 `tac propose` 提交协作回流。项目配置需要同步到具体工作区时，使用 `tac project-config pull <workspace-dir>`，先用 `--dry-run` 预览影响。

## 发布与文档边界

CLI 二进制和团队内容是两条独立链路：CLI 通过版本 tag 触发 GitHub Actions 跨平台构建，团队内容通过 `content/sources/` 的变更由成员 `tac sync` 获取。不要把修改团队配置、发布 CLI 和修改业务项目混成同一条流程。

该仓库自己的 README 已包含安装、命令清单和常见场景；设计、模块实现、发布和迁移细节在其 `docs/` 与 `.knowledge_base/` 中维护。本手册只保留项目定位和接手入口，不复制完整命令百科。

## 相关边界

- `team-agent-config` 是工具基础项目，不替代具体业务仓库的 `AGENTS.md` 或项目文档。
- 同步异常先看 `tac status`、`tac diff`、`tac doctor`，需要理解分支原因时使用 `tac sync --explain --dry-run`。
- 贡献团队配置前先在本机验证，确认影响范围后再生成 PR；敏感配置使用仓库规定的 secret 管理方式，不写入文档或提交。
