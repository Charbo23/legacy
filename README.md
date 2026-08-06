# 项目接手手册

本仓库直接面向接手人员，重点记录项目特有的判断方法、疑难问题排查、验收边界和可直接交给 Agent 的高频工作流提示词。仓库关系只用于帮助找到事实源；具体实现、构建步骤和完整踩坑说明应维护在源仓，本仓只提供必要入口。

## 建议阅读顺序

1. [项目地图](docs/project-overview.md)
2. [易哈佛前台](docs/ehafo-frontend/overview.md)
3. [易哈佛前台：问题排查](docs/ehafo-frontend/troubleshooting.md)
4. [team-agent-config](docs/team-agent-config/overview.md)
5. 专项需要时再读 [MP 与 subproject](docs/ehafo-frontend/mp-and-subprojects.md) 或[小护排班](docs/schedule/overview.md)

## 本地预览

```bash
npm ci
npm run docs:dev
```

构建验证：`npm run docs:build`。文档中不记录密码、Token、客户隐私或生产日志原文。

需要离线传阅或归档时，运行 `npm run docs:single`，生成汇总全部正式页面的 `dist/legacy-handover.md`。该文件保留 Mermaid 源码、文档内目录和锚点，可直接交给 Markdown 编辑器或 Agent 使用，不需要启动文档站。
