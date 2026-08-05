# 项目接手手册

本仓库直接面向接手人员，重点记录项目特有的判断方法、疑难问题排查、验收边界和可直接交给 Agent 的高频工作流提示词。仓库关系只用于帮助找到事实源；具体实现、构建步骤和完整踩坑说明应维护在源仓，本仓只提供必要入口。

## 建议阅读顺序

1. [项目地图](docs/project-overview.md)
2. [易哈佛前台](docs/ehafo-frontend/overview.md)
3. [易哈佛前台：问题排查](docs/ehafo-frontend/troubleshooting.md)
4. 专项需要时再读 [MP 与 subproject](docs/ehafo-frontend/mp-and-subprojects.md) 或[小护排班](docs/schedule/overview.md)

## 本地预览

```bash
npm ci
npm run docs:dev
```

构建验证：`npm run docs:build`。文档中不记录密码、Token、客户隐私或生产日志原文。
