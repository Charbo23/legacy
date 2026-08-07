# 易哈佛前台：测试、验收与项目经验

本页只保留项目内的选择原则、提示词和踩坑入口。Playwright、ADB、PageSpy 等具体操作以源仓文档为准，不在这里复制。

## 高频工作流提示词

实际使用时通常只需说明动作、现象和验收要求；项目背景由 Agent 从仓库 `AGENTS.md`、本手册和当前对话获取，不必把完整流程重复写进 prompt。

| 场景 | 可直接使用的提示词 |
| --- | --- |
| 需求实现 | “看下这个问题，结合源码处理一下，完成后验证关键链路。” |
| 页面回归 | “这个改动做完跑一下项目 E2E，看看从入口到目标页面是否正常。” |
| 用户反馈 | “用户反馈 xxx，截图如图 xxx，日志地址 xxx，分析定位原因并处理。” |
| 疑难问题 | “这个问题还没定位，结合现有日志继续排查，缺什么再补充观测。” |
| 端上验收 | “这个功能在微信开发者工具和真机上都验一下，重点看样式、交互和启动链路。” |
| 上线收口 | “上线后做一次线上回归测试；如果涉及数据，再结合线上数据库核对是否正常。” |

## Agent 开发工作流

| 阶段 | 项目内做法 | 容易踩坑 |
| --- | --- | --- |
| 定位 | 先按[运行环境](./environment-and-device/environment.md)和 [UA 与设备](./environment-and-device/ua-device.md)确认真实运行矩阵，再从[仓库关系](./repositories.md)找到源码仓；MP、SP 和 `web_course` 先看[专页](./mp-and-subprojects.md) | 在主仓编译产物上直接改代码，或把环境、运行容器、系统和设备混成一个“端” |
| 理解 | 让 Agent 先读目标仓 `AGENTS.md`、相关 README 和同类实现，只把本手册作为跨仓关系入口 | 把手册中的概括当成最新函数或构建参数，跳过源仓事实源 |
| 实现 | 修改源码并保持旧版 App 和其他载体可用；涉及 A/B 时从开始就约定收口方式 | 只验证当前端或 B 分支，遗漏旧版、缓存、重试和网关切换 |
| 快速验证 | 先跑与 diff 对应的 E2E 或最小测试，再按[三层测试](#三层测试如何选择)升级到微信工具或 ADB | 只跑固定 smoke，或用浏览器结果代替微信能力和真机启动验收 |
| 交付检查 | 核对真实入口、资源哈希和 `git diff`，恢复临时 session、调试配置和测试数据 | 代码已提交或 CI 成功就认为用户已命中新版本；把临时配置留进提交 |
| 疑难问题 | 交给 Agent 按[问题排查](./troubleshooting.md)合并现场与日志，缺证据时只补有区分力的观测 | 没有证据就连续猜修，或同时改重试、缓存、超时和网关导致无法判因 |

## 三层测试如何选择

| 层级 | 使用时机 | 事实源 |
| --- | --- | --- |
| Playwright | 普通页面、路由、请求、渲染和性能的快速回归；代码完成后的默认起点 | `ehafo-quiz/frontends/app/e2e/README.md`、`ehafo-quiz/frontends/app/e2e/agent-protocol.md` |
| Agent 操控微信开发者工具 | 微信能力、最终样式、弹层、返回、滚动和分享交互 | 按真实用户路径操作，不用脚本调用替代最终界面验收 |
| ADB 真机 | App 启动、前后台恢复、WebView、原生桥、离线能力和疑难问题 | `ehafo-quiz/frontends/app/e2e/offline-startup-acceptance.md`、`ehafo_android_app/AGENTS.md` |

需要观察远程 WebView 现场时使用 PageSpy，具体操作只读 `ehafo-quiz/.codex/skills/debug-with-pagespy/SKILL.md`。运行时性能专项读 `ehafo-quiz/frontends/app/e2e/runtime-performance-acceptance.md`。

## 验收原则

- 做题、支付、分享等关键链路必须人工操作；自动化通过不等于体验通过。
- 普通 Web 变更至少验证 iOS、Android 和微信；只有新 App 包才执行完整真机和云测矩阵。
- 样式和交互重点检查文字与安全区、弹层遮挡、返回是否先关闭弹层、路由卡顿、慢请求和重复请求。
- Playwright 的固定 smoke 只证明 E2E 底座可用，本次需求仍要按 diff 动态验收。
- 不自动触发支付、下单、提交答案、评论、删除、验证码等有副作用的操作。

## 已知坑只记入口

| 主题 | 接手时先看 |
| --- | --- |
| 运行环境与入口 | [运行环境](./environment-and-device/environment.md) |
| 前端构建链 | `ehafo-quiz/docs/前端H5构建与CI.md` 和 `ehafo-quiz/plans/handoff.md` |
| UA、系统、PC 壳和平板 | [UA 与设备](./environment-and-device/ua-device.md) |
| App 离线启动、缓存与恢复 | `ehafo-quiz/frontends/app/e2e/offline-startup-acceptance.md` |
| PageSpy 远程调试 | `ehafo-quiz/.codex/skills/debug-with-pagespy/SKILL.md` |
| Android 设备、安装和 ADB | `ehafo_android_app/AGENTS.md` |
| MP 与 subproject | [MP 与 subproject](./mp-and-subprojects.md) |
| A/B 放量和收口 | [A/B 测试](./ab-testing.md) |
| PC 壳差异 | [UA 与设备：PC 壳判断](./environment-and-device/ua-device.md#pc-壳判断)；打包仓见[仓库与系统关系](./repositories.md#pc-打包仓) |
