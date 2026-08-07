# 易哈佛前台：仓库与系统关系

## 主要仓库

### ehafo-quiz

- [GitHub `ehafo/ehafo-quiz`](https://github.com/ehafo/ehafo-quiz)，默认分支 `main`。
- 承载主要 H5/Web 业务，浏览器、App WebView、Harmony、微信和 PC 壳共同加载或复用其页面。开发入口、命令和约束以仓库 `AGENTS.md` 为准。

### ehafo_android_app

- [GitHub `ehafo/ehafo_android_app`](https://github.com/ehafo/ehafo_android_app)，默认分支 `master`。
- Android DCloud 壳仓，负责启动与恢复、WebView 生命周期、原生桥、离线媒体和包体行为。涉及原生能力时读取仓库 `AGENTS.md` 并核对旧版兼容。

### MP 与 subproject 源码仓

| 仓库 | 作用 |
| --- | --- |
| [GitHub `ehafo/mp-nexus`](https://github.com/ehafo/mp-nexus) | 当前 MP 管理后台，负责项目资料、版本来源、预览、上线、回退与统计 |
| [Codeup `ehafo/miniproject/machine_exam`](https://codeup.aliyun.com/ehafo/miniproject/machine_exam) | 人机对话 subproject 源码 |
| [Codeup `ehafo/miniproject/performanceAppraisal`](https://codeup.aliyun.com/ehafo/miniproject/performanceAppraisal) | 内部考核 subproject 源码 |
| [Codeup `ehafo/miniproject/epaper`](https://codeup.aliyun.com/ehafo/miniproject/epaper) | 电子试卷 subproject 源码 |
| [Codeup 独立项目 `web_course`](https://codeup.aliyun.com/ehafo/miniproject/ai_course) | AI 课程播放器源码 |

### ehafo-front-lib

- [GitHub `ehafo/ehafo-front-lib`](https://github.com/ehafo/ehafo-front-lib)。
- 前台公共方法库，普通能力、统计入口和 quiz 适配边界见[ehafo-front-lib 专页](./front-lib.md)；统计字段和排查方法见[自研统计](./tracking.md)。

三个 `miniproject` 源码仓对应现在所称的 `subproject`；`web_course` 是独立项目。代码位置、产物目录和运行时差异统一见[MP 与 subproject](./mp-and-subprojects.md)。

## 次级仓库与平台

### screenshot_server

- [Codeup `ehafo/yihafo/screenshot_server`](https://codeup.aliyun.com/ehafo/yihafo/screenshot_server)，默认分支 `master`。
- 用于把 Web 分享页渲染成图片。分享链路为 `ehafo-quiz` 写入任务、服务端截图、完成后回调；接口与队列名以两端源码为准。

### PC 打包仓

PC 端不是独立业务实现，而是由 Windows 和 macOS 两个桌面壳加载 `ehafo-quiz` 的 `https://tiku.yihafo.com/?module=v4`。Web 侧通过 UA 中的 `ehafopc` 设置 `ispc=true`，再分别调用 NW.js 的 `nw` 或 Electron preload 暴露的 `nodeRequire`。

| Codeup 仓库 | 当前定位 | 事实源 |
| --- | --- | --- |
| [`ehafo/yihafo/tikupc`](https://codeup.aliyun.com/ehafo/yihafo/tikupc) | Windows 版 NW.js 打包仓，包含 32/64 位和 Inno Setup 打包配置 | 仓库 `README.md`、`appxs/package.json`、`windows_setup/` |
| [`ehafo/app/tiku_mac`](https://codeup.aliyun.com/ehafo/app/tiku_mac)（Codeup 显示为 `app/pc_mac`） | macOS 版 Electron 打包仓；`tikupc` 分支对应易哈佛考试，`kefupc` 分支对应咨询系统 | 仓库 `README.md`、对应分支的 `main.js` 与 `package.json` |

当前 PC 端只有以上两个打包入口。确认某个用户实际使用哪一套壳时：

1. 先取得用户安装包或实际下载 URL，不只看仓库更新时间。
2. 查看进程类型、应用名和 `appId`，再在页面控制台核对 `navigator.userAgent`、`typeof nw`、`typeof nodeRequire`。
3. NW.js 应命中 `nw`，Electron 应命中 `nodeRequire`；两者都没有时只是普通 PC 浏览器。
4. 最后回到对应仓的入口、版本和打包配置复现；若要确认历史包，仍以实际安装包或下载物为准。

Web 侧兼容入口见 `ehafo-quiz/frontends/app/v5_src/static/js/core/common/pc.js`，PC 身份判断见 `ehafo-quiz/frontends/app/v5_src/window_defined.js`。修改 PC 行为时优先改 Web 公共逻辑，并至少分别验证 NW.js 和 Electron 的外链打开、下载、视频与缓存恢复。
