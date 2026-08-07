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
| [web_course](https://codeup.aliyun.com/ehafo/miniproject/ai_course) | AI 课程播放器源码 |
| [ehafo-front-lib](https://github.com/ehafo/ehafo-front-lib) | 前台公共方法库；统计入口和边界见[ehafo-front-lib 专页](./front-lib.md)与[自研统计](./tracking.md) |
| [screenshot_server](https://codeup.aliyun.com/ehafo/yihafo/screenshot_server) | 分享图片生成服务 |
| [tikupc](https://codeup.aliyun.com/ehafo/yihafo/tikupc)、[tiku_mac](https://codeup.aliyun.com/ehafo/app/tiku_mac) | Windows、macOS PC 壳打包仓 |

详细目录、产物位置和运行时边界见[仓库与系统关系](./repositories.md)。

## 按任务进入

| 当前任务 | 阅读入口 |
| --- | --- |
| 判断改哪个仓库或哪个运行载体 | [仓库与系统关系](./repositories.md) |
| 当前 MP、人机对话、内部考核、电子试卷或 AI 课程 | [MP 与 subproject](./mp-and-subprojects.md) |
| 判断公共方法应改 quiz 还是公共库 | [ehafo-front-lib](./front-lib.md) |
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

## 构建触发与环境切换

- DEV 环境由 `dev` 分支推送自动构建。
- preview 和 hotfix 都由 `main` 分支推送自动构建；两者的区别不在构建分支，而在连接的数据库：hotfix 连接测试环境数据库，preview（验收环境）连接线上数据库。
- App、微信或 Harmony 需要切换实际访问环境时，在端内进入“我的 → 设置 → 测试功能列表”，使用“环境切换”。不要只根据 URL 判断当前数据环境。

本地联调的前置条件、启动参数和项目内已有说明，以 `ehafo-quiz` 仓库的 `AGENTS.md`、README、`scripts/dev.sh`，以及 `docs/前端H5构建与CI.md`、`plans/handoff.md` 为准；本手册只保留入口，不复制源仓命令。

本地 `pnpm run build:prod` 是 Node 构建链的生产模式校验命令，不等同于 App、微信、Harmony 的线上 CI 发布链；后者使用 `build:v52`，且不应在普通开发 worktree 中直接运行。

## 部署与缓存确认

部署状态可从以下入口核对：

- [CI 任务列表](https://ci-logs.dinice.cn/tasks)：确认构建任务、分支和结果。
- [内网服务部署日志](https://ci-logs.dinice.cn/deploys)：确认产物是否已部署到目标环境。
- [发布与回滚记录](https://ops.dinice.cn/#releases)：确认当前发布版本和可回滚版本。

缓存是否更新通常不需要额外查服务端缓存：让 Agent 访问目标站点并拉取入口或静态资源，核对引用文件名中的版本号或内容 hash；hash 已变化才能证明页面实际命中了新产物。
