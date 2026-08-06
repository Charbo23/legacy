# 易哈佛前台：项目概况

## 项目定位

易哈佛前台是需要优先掌握的核心逻辑项目。主要业务位于 `ehafo-quiz`，并由 MP、subproject、原生壳和次级服务共同支撑；具体仓库落点见[仓库与系统关系](./repositories.md)。

## 仓库速览

先按“要改什么”找仓库，不要把所有仓库都当作同一套前台源码：

| 仓库 / 产物 | 作用 |
| --- | --- |
| [ehafo-quiz](https://github.com/ehafo/ehafo-quiz) | Web 主业务、跨端页面、MP 产物和 subproject 集成点 |
| [ehafo_android_app](https://github.com/ehafo/ehafo_android_app) | Android DCloud 壳、启动链路和原生能力 |
| [mp-nexus](https://github.com/ehafo/mp-nexus) | 当前 MP 的版本管理、预览和发布后台 |
| [machine_exam](https://codeup.aliyun.com/ehafo/miniproject/machine_exam)、[performanceAppraisal](https://codeup.aliyun.com/ehafo/miniproject/performanceAppraisal)、[epaper](https://codeup.aliyun.com/ehafo/miniproject/epaper) | 人机对话、内部考核、电子试卷 subproject 源码 |
| [web_course](https://codeup.aliyun.com/ehafo/miniproject/web_course) | AI 课程播放器源码 |
| [ehafo-front-lib](https://github.com/ehafo/ehafo-front-lib) | 前端公共库和自研统计 SDK |
| [screenshot_server](https://codeup.aliyun.com/ehafo/yihafo/screenshot_server) | 分享图片生成服务 |
| [tikupc](https://codeup.aliyun.com/ehafo/yihafo/tikupc)、[tiku_mac](https://codeup.aliyun.com/ehafo/app/tiku_mac) | Windows、macOS PC 壳打包仓 |

详细目录、产物位置和运行时边界见[仓库与系统关系](./repositories.md)。

## 按任务进入

| 当前任务 | 阅读入口 |
| --- | --- |
| 判断改哪个仓库或哪个运行载体 | [仓库与系统关系](./repositories.md) |
| 当前 MP、人机对话、内部考核、电子试卷或 AI 课程 | [MP 与 subproject](./mp-and-subprojects.md) |
| 分流、放量或收口 | [A/B 测试](./ab-testing.md) |
| 埋点接入、事件缺失或统计看板 | [自研统计](./tracking.md) |
| 用户反馈、偶现问题或跨端异常 | [问题排查](./troubleshooting.md) |
| 需求开发、页面测试与最终验收 | [测试、验收与项目经验](./lessons.md) |

## 运行载体与环境

这里先区分两个不能混淆的维度：

- **部署环境**：本地、DEV、preview、hotfix、release。
- **运行载体**：浏览器、App WebView、Harmony、微信和 PC 壳，对应不同入口文件。

测试与排查手段不属于项目组成或运行环境，统一放在问题排查和验收页面说明。

## 运行环境与入口

以下是从 `ehafo-quiz` 当前源码、构建配置和项目说明中核对出的技术环境。它说明代码如何识别和构建环境，不代表某次发布已经成功；验收时仍要核对实际入口、资源哈希和运行版本。

| 环境 | 用途 | 主要入口 | 构建形态 |
| --- | --- | --- | --- |
| 本地联调 | 本机开发与前后端联调 | `https://quiz-local.dev.ehafo.com/entry.html` | `ehafo-quiz/scripts/dev.sh up` 准备本地域名；前台走 `build:dev` |
| DEV | 日常测试 | `https://quiz.dev.yiqizuoti.com/entry.html` | `build:dev`，资源按文件展开 |
| preview | 验收 App、微信和 Harmony 渠道产物 | `https://tiku-v5.dev.yihafo.com/entry.<载体>.html` | CI `build:v52`，内容哈希产物 |
| hotfix | 修复环境验证 | 同 preview 域名，入口为 `entry-<载体>-hotfix.html` | CI `build:v52`，内容哈希产物 |
| release | 线上环境 | Web 为 `https://quiz.yiqizuoti.com/entry.html`；各渠道使用对应线上入口 | Web 仍为展开构建；App、微信和 Harmony 使用 CI `build:v52` |

载体入口中的 `<载体>` 为 `app`、`wx` 或 `harmony`。`entry.app.html` 同时服务 Android 和 iOS App WebView；它不是单独的 iOS 环境。微信线上跳转在部分运行路径中会先进入 `https://quiz.yihafo.com/?module=quiz`。

本地 `pnpm run build:prod` 是 Node 构建链的生产模式校验命令，不等同于 App、微信、Harmony 的线上 CI 发布链；后者使用 `build:v52`，且不应在普通开发 worktree 中直接运行。

## 范围边界

- 通用部署和服务器运维由对应团队负责，接手时只需掌握与前台业务相关的发布和验证节点。
- 具体业务规则按当期需求确认，不把本手册当作业务规则百科。
- 文件结构、函数说明和接口列表直接查源码；本手册用于补充跨仓关系、判断方法和经验。
