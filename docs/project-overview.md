# 项目地图

本页只用于确认需要接手的逻辑项目及入口。首次接手应完整掌握易哈佛前台；小护排班按专项需要进入。具体实现和操作步骤以源仓为准，本手册重点补充无法只靠阅读源码快速获得的判断方法、疑难排查和验收经验。

## 逻辑项目

| 逻辑项目 | 优先级 | 交接范围 |
| --- | --- | --- |
| [易哈佛前台](./ehafo-frontend/overview.md) | 核心 | H5/Web 前台、当前 MP、由早期 MP 演化出的 subproject、AI 课程播放器产物、多端运行环境、Android 壳、分享截图与 PC 壳关联、跨端排障与验收 |
| [小护排班](./schedule/overview.md) | 专项 | 微信小程序源码修改、构建和发布 |

易哈佛前台不是单一仓库：[ehafo-quiz](https://github.com/ehafo/ehafo-quiz) 承载主要业务和独立前端产物，[mp-nexus](https://github.com/ehafo/mp-nexus) 管理当前 MP，人机对话、内部考核和电子试卷由独立 subproject 源码仓维护，[ehafo_android_app](https://github.com/ehafo/ehafo_android_app)、[screenshot_server](https://codeup.aliyun.com/ehafo/yihafo/screenshot_server) 和各 PC 打包仓分别解决不同终端或支撑场景。各仓库的业务关系和使用方式以对应项目页及源仓事实为准，部署运维仍由对应团队负责。

## 无需接手的范围

| 类别 | 项目 | 说明 |
| --- | --- | --- |
| 其他 App | `app-main` | 不在接手范围内 |
| 其他小程序 | `tiku-v5app`、`mp_tiku` 及其他微信小程序 | 不在接手范围内；`machine_exam` 不是这里所指的微信小程序，已作为 subproject 纳入易哈佛前台 |
| 其他业务或历史系统 | `sdk`、`admin`、`ehafo_pycode`、`tiku` | 无需作为主责项目接手 |
| 研发基础设施 | CI/CD、网关部署、定时任务等仓库 | 无需接手，由对应团队负责 |

排查跨系统问题时仍可把这些仓库作为上下游证据，但无需系统学习或维护其独立文档。
