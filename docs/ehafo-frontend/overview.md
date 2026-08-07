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
| 判断运行环境、域名、入口或切换路径 | [运行环境](./environment-and-device/environment.md) |
| 判断微信、App、系统、PC 壳或平板 | [UA 与设备](./environment-and-device/ua-device.md) |
| 当前 MP、人机对话、内部考核、电子试卷或 AI 课程 | [MP 与 subproject](./mp-and-subprojects.md) |
| 判断公共方法应改 quiz 还是公共库 | [ehafo-front-lib](./front-lib.md) |
| 分流、放量或收口 | [A/B 测试](./ab-testing.md) |
| 埋点接入、事件缺失或统计看板 | [自研统计](./tracking.md) |
| 用户反馈、偶现问题或跨端异常 | [问题排查](./troubleshooting.md) |
| 需求开发、页面测试与最终验收 | [测试、验收与项目经验](./lessons.md) |

## 环境与设备

部署环境、运行容器和设备不是同一个维度，本页不展开：

- 域名、入口文件和环境切换统一见[运行环境](./environment-and-device/environment.md)。
- `ua()`、`os`、PC 壳、App 包和平板判断统一见 [UA 与设备](./environment-and-device/ua-device.md)。
