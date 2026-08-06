# team-agent-config：项目概况

## 项目定位

[GitHub `ehafo/team-agent-config`](https://github.com/ehafo/team-agent-config) 是团队 AI Coding 工具配置同步器，命令行工具名称为 `tac`。它维护一份团队配置源，再分发到成员本机的 Claude Code、Codex CLI 等工具，并支持个人配置覆盖和贡献内容回流。

它与易哈佛前台并列，但不承载业务页面。需要理解安装、配置结构、贡献协议或发布实现时，直接阅读源仓 [README](https://github.com/ehafo/team-agent-config#readme) 和 [`docs/`](https://github.com/ehafo/team-agent-config/tree/main/docs)。

## 接手时先记住的入口

| 目的 | 命令 |
| --- | --- |
| 初始化或同步团队配置 | `tac init`、`tac sync` |
| 判断本机是否正确落地 | `tac status`、`tac diff`、`tac doctor` |
| 查看本地配置页面 | `tac ui` |

个人 skill 回流使用 `tac contribute skill` 和 `tac propose`；项目配置同步到工作区使用 `tac project-config pull <workspace-dir>`，先加 `--dry-run` 预览影响。完整参数查源仓 README。

## 发布与文档边界

CLI 二进制和团队内容是两条独立链路，不要把发布 CLI、同步 `content/sources/` 和修改业务项目混成同一流程。同步异常先运行 `status`、`diff`、`doctor`，仍不清楚时使用 `tac sync --explain --dry-run`；敏感配置只走源仓规定的 secret 管理方式。
