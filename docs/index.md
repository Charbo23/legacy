---
layout: home

hero:
  name: 项目接手手册
  text: 从证据到结论
  tagline: 不背源码细节，找到项目事实源，用现有工具完成开发、排查与验收
  actions:
    - theme: brand
      text: 查看问题排查
      link: /ehafo-frontend/troubleshooting
    - theme: alt
      text: 查看项目地图
      link: /project-overview

features:
  - title: 疑难问题排查
    details: 从用户现场、运行版本和分段证据建立可判决的证据链，无法定位时再增加有区分力的观测。
  - title: 项目内高频工作流
    details: 直接用自然语言交给 Agent，由 Agent 自行读取源码事实源、完成修改并按风险选择真实验收路径。
  - title: 逻辑项目地图
    details: 只在需要定位责任边界时查看仓库和系统关系；具体实现、构建步骤与完整踩坑说明回到源仓。
---

## 建议阅读顺序

首次接手先读[项目地图](/project-overview)，确认当前工作属于哪个逻辑项目。

易哈佛前台从[项目概况](/ehafo-frontend/overview)和[仓库与系统关系](/ehafo-frontend/repositories)开始；涉及 MP、人机对话、内部考核或电子试卷时进入[MP 与 subproject](/ehafo-frontend/mp-and-subprojects)。收到线上反馈时进入[问题排查](/ehafo-frontend/troubleshooting)；准备上线或验收时核对[测试、验收与项目经验](/ehafo-frontend/lessons)。使用团队 AI 工具配置时阅读[team-agent-config](/team-agent-config/overview)。小护排班只在涉及该项目时阅读[项目概况与发布](/schedule/overview)。
