# 易哈佛前台：仓库与系统关系

## 主要仓库

### ehafo-quiz

- [GitHub `ehafo/ehafo-quiz`](https://github.com/ehafo/ehafo-quiz)，默认分支 `main`。
- 承载主要 H5/Web 业务，也是普通浏览器、App WebView、Harmony、微信和 PC 壳共同加载或复用的前台实现。
- 重点关注接口迁移、A/B、离线与弱网、跨端兼容、问题定位和验收。
- 本地开发使用 `scripts/dev.sh up`，其他命令和约束以仓库内 `AGENTS.md` 为准。

### ehafo_android_app

- [GitHub `ehafo/ehafo_android_app`](https://github.com/ehafo/ehafo_android_app)，默认分支 `master`。
- Android DCloud 壳仓，负责启动与恢复、WebView 生命周期、原生桥、离线媒体、环境和包体行为。
- Web 功能依赖原生能力时，需要同时核对这里的实现和旧版兼容。

### MP 与 subproject 源码仓

| 仓库 | 作用 |
| --- | --- |
| [GitHub `ehafo/mp-nexus`](https://github.com/ehafo/mp-nexus) | 当前 MP 管理后台，负责项目资料、版本来源、预览、上线、回退与统计 |
| [Codeup `ehafo/miniproject/machine_exam`](https://codeup.aliyun.com/ehafo/miniproject/machine_exam) | 人机对话 subproject 源码 |
| [Codeup `ehafo/miniproject/performanceAppraisal`](https://codeup.aliyun.com/ehafo/miniproject/performanceAppraisal) | 内部考核 subproject 源码 |
| [Codeup `ehafo/miniproject/epaper`](https://codeup.aliyun.com/ehafo/miniproject/epaper) | 电子试卷 subproject 源码 |
| Codeup 独立项目 `web_course` | AI 课程播放器源码；不与三个 subproject 共用运行时，构建结果复制到 `ehafo-quiz` |

三个 `miniproject` 路径是旧命名遗留；它们属于后来更名的 `subproject`。`web_course` 是独立项目，不属于这套兼容运行时。两类项目都只把编译结果放入 `ehafo-quiz`，完整关系见[MP 与 subproject](./mp-and-subprojects.md)。

## 次级仓库与平台

### screenshot_server

- [Codeup `ehafo/yihafo/screenshot_server`](https://codeup.aliyun.com/ehafo/yihafo/screenshot_server)，默认分支 `master`。
- 用于把 Web 分享页渲染成图片。`ehafo-quiz` 把任务写入 `poster:generate:share_img`，常驻任务调用 `/add_screenshot_task`，完成后回调 `App.Share.DealCommonPoster`。
- `/screenshot` 是同步入口，分享海报使用异步入口；页面通过 `window.pageLoadState` 通知截图时机。
- 本页只记录其业务用途和调用关系；部署、进程、服务器更新及日志查看由架构团队负责。

### PC 打包仓

PC 端不是独立业务实现，而是由 Windows 和 macOS 两个桌面壳加载 `ehafo-quiz` 的 `https://tiku.yihafo.com/?module=v4`。Web 侧通过 UA 中的 `ehafopc` 设置 `ispc=true`，再分别调用 NW.js 的 `nw` 或 Electron preload 暴露的 `nodeRequire`。

| Codeup 仓库 | 源码能确认的定位 | 事实源 |
| --- | --- | --- |
| [`ehafo/yihafo/tikupc`](https://codeup.aliyun.com/ehafo/yihafo/tikupc) | Windows 版 NW.js 打包仓，包含 32/64 位和 Inno Setup 打包配置；仓内保留的早期 Mac 脚本不代表当前 Mac 发布入口 | 仓库 `README.md`、`appxs/package.json`、`windows_setup/` |
| [`ehafo/app/tiku_mac`](https://codeup.aliyun.com/ehafo/app/tiku_mac)（Codeup 显示为 `app/pc_mac`） | macOS 版 Electron 打包仓；`tikupc` 分支对应易哈佛考试，`kefupc` 分支对应咨询系统 | 仓库 `README.md`、对应分支的 `main.js` 与 `package.json` |

`pcapp` 已废弃并删除，不再作为发布或问题排查入口。确认某个用户实际使用哪一套壳时：

1. 先取得用户安装包或实际下载 URL，不只看仓库更新时间。
2. 查看进程类型、应用名和 `appId`，再在页面控制台核对 `navigator.userAgent`、`typeof nw`、`typeof nodeRequire`。
3. NW.js 应命中 `nw`，Electron 应命中 `nodeRequire`；两者都没有时只是普通 PC 浏览器。
4. 最后回到对应仓的入口、版本和打包配置复现；若要确认历史包，仍以实际安装包或下载物为准。

Web 侧兼容入口见 `ehafo-quiz/frontends/app/v5_src/static/js/core/common/pc.js`，PC 身份判断见 `frontends/app/v5_src/window_defined.js`。修改 PC 行为时优先改 Web 公共逻辑，并至少分别验证 NW.js 和 Electron 的外链打开、下载、视频与缓存恢复。

## DCloud 权限边界

DCloud 应用转让、uni-app 构建权限和协作者名单属于离职交接时的外部权限事项；应用清单、目标人员和凭据在实际交接环节核对，不写入本手册。
