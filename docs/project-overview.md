# 项目地图

本页只用于确认需要接手的逻辑项目及入口。首次接手应完整掌握易哈佛前台；`team-agent-config` 作为团队 AI 工具配置项目按工具协作需要进入；小护排班按专项需要进入。具体实现和操作步骤以源仓为准，本手册重点补充无法只靠阅读源码快速获得的判断方法、疑难排查和验收经验。

## 逻辑项目

| 逻辑项目 | 优先级 | 交接范围 |
| --- | --- | --- |
| [易哈佛前台](./ehafo-frontend/overview.md) | 核心 | H5/Web 前台、当前 MP、由早期 MP 演化出的 subproject、AI 课程播放器产物、多端运行环境、Android 壳、分享截图与 PC 壳关联、跨端排障与验收 |
| [team-agent-config](./team-agent-config/overview.md) | 工具基础 | 团队 AI Coding 工具配置同步、个人工具落地和配置贡献回流 |
| [小护排班](./schedule/overview.md) | 专项 | 微信小程序源码修改、构建和发布 |

易哈佛前台涉及多个源码仓和运行载体，职责与调用关系统一见[仓库与系统关系](./ehafo-frontend/repositories.md)，本页不重复展开。
