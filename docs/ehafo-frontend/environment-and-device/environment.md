# 易哈佛前台：运行环境

本页集中说明 `ehafo-quiz` 的运行环境、入口选择和环境切换。运行载体、操作系统和设备判断见 [UA 与设备](./ua-device.md)，其他页面不再重复环境表。

## 环境与入口

| 环境 | 用途 | 主要入口 |
| --- | --- | --- |
| 本地联调 | 本机开发与前后端联调 | 当前统一入口为 `https://quiz-local.dev.ehafo.com/entry.html`；历史本地域名还包括 `ltiku`、`lquiz` |
| `dev` | 日常测试 | `https://quiz.dev.yiqizuoti.com/entry.html` |
| `preview` | 使用线上数据验收 App、微信和 Harmony | `https://tiku-v5.dev.yihafo.com/entry.<载体>.html` |
| `hotfix` | 使用测试数据验证修复 | `https://tiku-v5.dev.yihafo.com/entry-<载体>-hotfix.html` |
| `release` | 线上环境 | Web 为 `https://quiz.yiqizuoti.com/entry.html`；各载体使用对应线上入口 |

`<载体>` 为 `app`、`wx` 或 `harmony`。微信线上切换路径会先进入 `https://quiz.yihafo.com/?module=quiz`，不直接拼 `entry.wx.html`。

## 源码如何识别环境

`frontends/app/v5_src/static/js/core/common/index.js` 中的 `getCurEnv()` 按当前 URL 判断：

1. 严格模式 `getCurEnv(true)` 下，hostname 含 `ltiku`、`lquiz` 或 `local` 时返回 `local`；该判断优先于其他环境。
2. hostname 不含 `dev.` 时返回 `release`。
3. hostname 含 `dev.`、但不含 `-v5` 时返回 `dev`。
4. hostname 同时含 `dev.` 和 `-v5` 时，URL 含 `hotfix.` 返回 `hotfix`，否则返回 `preview`。

非严格模式仍把 `quiz-local.dev.ehafo.com`、`ltiku.dev.*` 和 `lquiz.dev.*` 归为 `dev`，供业务环境分支和“环境切换”页面使用；需要区分本机与远程 DEV 时必须显式调用 `getCurEnv(true)`。

## 源码如何选择入口

`getEntryFileName(targetEnv)` 与 `jumpEnv(targetEnv)` 共同决定跳转目标：

| 目标环境 | 入口选择 |
| --- | --- |
| `dev` | 固定 `entry.html` |
| `hotfix` | 微信为 `entry-wx-hotfix.html`；Harmony App 为 `entry-harmony-hotfix.html`；其余为 `entry-app-hotfix.html` |
| `preview` | 微信为 `entry.wx.html`；Harmony App 为 `entry.harmony.html`；其余为 `entry.app.html` |
| `release` | 微信先跳 `quiz.yihafo.com/?module=quiz`；其余按 `entry.app.html` 或 `entry.harmony.html` 进入线上域名 |

入口选择依赖 `ua()` 和 `os`，具体判断顺序见 [UA 与设备](./ua-device.md)。切换时会保留测试人员标记，并给 preview、hotfix、release 的直接入口追加时间戳以绕过入口缓存。

## 环境切换

测试人员标记开启后，在“我的 → 设置 → 测试功能列表 → 环境切换”选择目标环境。页面选项来自 `global_common.envMap`，点击后由 `jumpEnv()` 重建入口 URL；这不是在当前页面内切换一个 API 开关。

切换后至少核对实际 hostname、入口文件名和 `getCurEnv()` 返回值。入口选择还依赖 `ua()` 与 `os`；出现跳错入口时按 [UA 与设备](./ua-device.md)核对真实运行矩阵。
