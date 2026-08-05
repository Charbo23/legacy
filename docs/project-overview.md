# 项目概况

## 文档定位

本项目本身就是交接文档，重点记录项目范围、系统关系、问题排查方法和经验。源码细节在需要验证具体实现时再读取，不在这里整理成代码百科。

## 负责范围

### 核心项目

| 项目 | 仓库 | 主要内容 |
| --- | --- | --- |
| 易哈佛前台 | GitHub `ehafo/ehafo-quiz`，`main` | Web 业务、接口迁移、A/B、离线与弱网、跨端兼容、问题定位与验收 |
| Android App 壳 | GitHub `ehafo/ehafo_android_app`，`master` | DCloud 壳、WebView 生命周期、原生桥、离线媒体、打包环境和真机验证 |

`ehafo-quiz` 本地开发使用 `scripts/dev.sh up`，其他命令和限制以仓库内 `AGENTS.md` 为准。

### 关联事项

#### 小护排班

- Codeup `ehafo/yihafo/schedule`，默认分支 `master`。
- Vue 2 时代的 uni-app 工程，实际只发布微信小程序，没有 H5 发布链路。
- HBuilderX 版本不作限制。使用“发行 → 微信小程序”构建，上传到“小护排班”小程序，再到微信小程序官方后台完成发布。
- 交接目标是接手人能够独立修改和发布；具体业务规则不在本文档范围内。

#### screenshot_server

- Codeup `ehafo/yihafo/screenshot_server`，默认分支 `master`。
- 用于把 Web 分享页渲染成图片。`ehafo-quiz` 把生成任务写入 `poster:generate:share_img`，常驻任务调用 `/add_screenshot_task`，截图完成后回调 `App.Share.DealCommonPoster`。
- `/screenshot` 是同步入口，分享海报使用异步入口。页面通过 `window.pageLoadState` 通知截图时机。
- 部署、进程和服务器日志由架构团队负责；本文档只记录用途和业务关联。

#### iOS PageSpy

反馈用户的离线日志用于事后还原。实时调试时，由测试人员在“测试功能列表”打开 PageSpy 在线开关，再交给可操作浏览器的 Agent；必要时可通过 WebView `evalJS` 检查内嵌页面。具体操作只维护在 `ehafo-quiz/.codex/skills/debug-with-pagespy/SKILL.md`。

#### PC 端

PC 端属于边缘范围，实际 Web 业务仍在 `ehafo-quiz`，其中保留 `ispc` 分支以及 NW.js、Electron 两种外链桥接方式。

| Codeup 仓库 | 作用 |
| --- | --- |
| `ehafo/yihafo/tikupc` | 较早的 NW.js Windows、macOS 打包仓，加载 `https://tiku.yihafo.com/?module=v4` |
| `ehafo/yihafo/pcapp` | 后续 Electron 打包仓，覆盖 Windows、macOS，同样加载 v4 页面 |
| `ehafo/app/tiku_mac` | Codeup 列表显示名为 `app/pc_mac`；2025 年新增的 Electron Mac 打包仓，`tikupc` 分支对应易哈佛考试，`kefupc` 分支对应咨询系统 |

提交时间只能说明演进方向，不能证明现网已经完全替换旧壳。需要确认时，以官网当前下载链接或现网安装包为准，核对 User-Agent、进程类型、应用标识和对应仓库。

#### DCloud 应用转让

离职前由当前负责人亲自转让。关键是接手人员拥有 uni-app 构建权限，并能用自己的组织身份完成一次实际构建；后续构建人员可添加为协作者。应用清单、目标人员和凭据不写入本文档。

## 明确不包含

| 类别 | 项目 | 说明 |
| --- | --- | --- |
| 其他 App | `app-main` | 不考虑 |
| 小程序 | `tiku-v5app`、`machine_exam`、`mp_tiku` 及其他小程序 | 不考虑 |
| 非本人主责或历史系统 | `sdk`、`admin`、`ehafo_pycode`、`tiku` | 不作为交接内容 |
| 研发基础设施 | CI/CD、网关部署、定时任务等仓库 | 不作为交接内容 |

被排除的仓库可以作为核心链路的上下游证据，但不单独整理说明。
