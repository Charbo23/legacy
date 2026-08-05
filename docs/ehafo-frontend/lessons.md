# 易哈佛前台：测试、验收与项目经验

本页只保留项目内的选择原则、提示词和踩坑入口。Playwright、ADB、PageSpy 等具体操作以源仓文档为准，不在这里复制。

## 高频工作流提示词

下面保留的是接近实际使用的短句。具体源码入口、测试层级和排查约束已经在本页及相关页面说明，不需要每次重复写进 prompt。

从 `hooks_ci.stats_prompts` 中的个人记录看，常见写法是先说“看下 / 处理 / 继续 / 修复 / 测试”这类动作，再补一个当前现象、分支、用户或验收要求；很多上下文来自连续对话、附件和已启用的 skill，而不是每次重新写一遍项目背景。后续提示词保持这个粒度即可。

| 场景 | 可直接使用的提示词 |
| --- | --- |
| 需求实现 | “看下这个问题，结合源码处理一下，完成后验证关键链路。” |
| 页面回归 | “这个改动做完跑一下项目 E2E，看看从入口到目标页面是否正常。” |
| 用户反馈 | “根据这个用户反馈查一下，先看现场日志和页面表现，定位原因并处理。” |
| 疑难问题 | “这个问题还没定位，结合现有日志继续排查，缺什么再补充观测。” |
| 端上验收 | “这个功能在微信开发者工具和真机上都验一下，重点看样式、交互和启动链路。” |
| 上线收口 | “按正常流程上线观察，3 天没问题后把 A/B 清掉并收口。” |

## 三层测试如何选择

| 层级 | 使用时机 | 事实源 |
| --- | --- | --- |
| Playwright | 普通页面、路由、请求、渲染和性能的快速回归；代码完成后的默认起点 | `ehafo-quiz/frontends/app/e2e/README.md`、`e2e/agent-protocol.md` |
| Agent 操控微信开发者工具 | 微信能力、最终样式、弹层、返回、滚动和分享交互 | 按真实用户路径操作，不用脚本调用替代最终界面验收 |
| ADB 真机 | App 启动、前后台恢复、WebView、原生桥、离线能力和疑难问题 | `ehafo-quiz/frontends/app/e2e/offline-startup-acceptance.md`、`ehafo_android_app/AGENTS.md` |

需要观察远程 WebView 现场时使用 PageSpy，具体操作只读 `ehafo-quiz/.codex/skills/debug-with-pagespy/SKILL.md`。运行时性能专项读 `frontends/app/e2e/runtime-performance-acceptance.md`。

## 验收原则

- 做题、支付、分享等关键链路必须人工操作；自动化通过不等于体验通过。
- 普通 Web 变更至少验证 iOS、Android 和微信；只有新 App 包才执行完整真机和云测矩阵。
- 样式和交互重点检查文字与安全区、弹层遮挡、返回是否先关闭弹层、路由卡顿、慢请求和重复请求。
- Playwright 的固定 smoke 只证明 E2E 底座可用，本次需求仍要按 diff 动态验收。
- 不自动触发支付、下单、提交答案、评论、删除、验证码等有副作用的操作。

## A/B

分流配置、放量、缓存影响和收口规则统一见[A/B 测试](./ab-testing.md)，本页不再重复。

## 已知坑只记入口

| 主题 | 接手时先看 |
| --- | --- |
| 环境、入口与两条构建链 | [项目概况](./overview.md#运行环境与入口)；构建细节见 `ehafo-quiz/docs/前端H5构建与CI.md` 和 `plans/handoff.md` |
| App 离线启动、缓存与恢复 | `ehafo-quiz/frontends/app/e2e/offline-startup-acceptance.md` |
| PageSpy 远程调试 | `ehafo-quiz/.codex/skills/debug-with-pagespy/SKILL.md` |
| Android 设备、安装和 ADB | `ehafo_android_app/AGENTS.md` |
| MP 与 subproject | [MP 与 subproject](./mp-and-subprojects.md) |
| PC 壳差异 | [仓库与系统关系：PC 打包仓](./repositories.md#pc-打包仓) |

DCloud 应用转让、构建权限和协作者变更属于实际离职交接时的外部权限事项，本手册只记录相关权限边界。PC Electron 仓历史中出现过明文 Apple 公证凭据，进入 Git 历史即视为泄漏，必须在 Apple 侧轮换，不能只删除当前文档。
