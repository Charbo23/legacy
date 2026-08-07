# 易哈佛前台：UA 与设备

本页集中说明 `ehafo-quiz` 如何判断运行容器、操作系统、PC 壳、App 包和平板。域名、入口和环境切换见[运行环境](./environment.md)。

## 不要只问“是什么端”

项目没有一个字段能完整表达设备。排查或写分支前至少区分下面四层：

| 层级 | 主要结果 | 事实源 | 回答的问题 |
| --- | --- | --- | --- |
| 运行容器 | `ua()` → `wx/app/other` | `core/utils/device_utils.js` | 页面在微信、App 壳还是其他容器中 |
| 操作系统 | `os`、`detail_os` | `v5_src/window_defined.js` | Harmony、Android、iOS、macOS、Windows 或其他 |
| PC 壳 | `ispc` | `v5_src/window_defined.js` | UA 是否带易哈佛 PC 壳标记 `ehafopc` |
| 设备与包 | `isipad`、`checkIsPad()`、`pkgname`、版本和桥能力 | `window_defined.js`、`device_utils.js` | 是否平板、哪个 App 包、原生能力是否存在 |

例如 PC 壳通常是 `ua() === 'other' && ispc === 'true'`；Harmony App 是 `ua() === 'app' && os === 'harmony'`。不能用 `ua()` 判断操作系统，也不能把 `ispc === 'false'` 理解成移动设备。

## `ua()`：运行容器

`ua()` 首次调用时读取小写 UA；存在 `window.plus` 时优先读取 `plus.navigator.getUserAgent()`，然后把结果缓存到 `window._runningEnvType`。

判断顺序如下：

1. UA 含 `MicroMessenger` 时返回 `wx`。
2. 否则，UA 含受支持 App 包标记时返回 `app`，并设置 `pkgname`。
3. 其余返回 `other`。

当前识别的 App 包族包括工程、品质、护理、考试教练、题库以及历史易哈佛包名；准确列表以 `device_utils.js` 的 `hasExactAppPackageInUserAgent()` 调用处为准。这里使用按分隔符切开的完整 token 匹配，避免短包名误命中更长字符串。

注意两个边界：

- `ua()` 识别的是容器，不是浏览器品牌或设备型号。
- `ua()` 的微信判断本身不排除企业微信；需要区分企业微信或微信小程序时必须使用对应的独立能力判断，不能只看 `ua() === 'wx'`。

## `os` 与设备全局字段

`initWindowDefined()` 在启动阶段直接读取 `navigator.userAgent`，初始化以下字段：

| 字段 | 当前语义 |
| --- | --- |
| `os` | `harmony/android/ios/other`；Harmony 优先于 Android，iPhone、iPad、iPod touch 及 Macintosh + AppleWebKit 进入 iOS 分支 |
| `detail_os` | 在 `os` 基础上补充 `mac/windows`，用于需要桌面系统明细的场景 |
| `ispc` | UA 含 `ehafopc` 时为字符串 `'true'`，否则为字符串 `'false'` |
| `isipad` | UA 同时含 `Macintosh` 与 `AppleWebKit` 时为字符串 `'true'` |
| `pkgname`、`version` | 从 App UA 中提取包名和版本；`ua()` 在命中 App token 后还会规范化 `pkgname` |

这些历史字段包含字符串布尔值，调用处通常使用 `ispc == 'true'`，不要擅自按 Boolean 重写。Macintosh + AppleWebKit 的规则也意味着单看 `os` 或 `isipad` 可能把桌面 Safari 与 iPad 混在一起；需要判定 PC 壳时看 `ispc`，需要桌面系统明细时同时看 `detail_os` 和能力对象。

## 微信、小程序和 PC 微信

- 微信 H5 容器由 `ua() === 'wx'` 表示。
- 微信小程序 WebView 是更窄的一层，由 `isInMiniProgram()` 检查 `window.__wxjs_environment === 'miniprogram'`；安全模式会等待 `WeixinJSBridgeReady`。quiz 的包装调用 `EhafoLib.isInMiniProgram()`。
- PC 微信由 `isPcWechat()` 检查 `WindowsWechat` 或 `MacWechat`，主要用于避免把 PC 微信误进移动设备和平板分支。

这三者不可互换：微信 H5 不一定在小程序里，PC 微信也不等于易哈佛 PC 壳。

## 平板判断

`checkIsPad()` 不是一条 UA 正则，而是按优先级组合多种信号：

1. Harmony 通过 `harmonyUtils.getDeviceType() === 'tablet'` 判断。
2. 其他端先应用 `global_common` 中的强制包含、UA 排除和 Android 特例名单。
3. UA 明示 iPad，或 App UA 呈现 Macintosh 时，判为平板。
4. 排除易哈佛 PC 壳和 PC 微信后，微信根据 `Tablet` 标记判断。
5. App 中部分 Android 标记直接判定；其余用 `plus.screen` 的物理尺寸估算，达到 7 英寸判为平板。

名单和阈值会随设备兼容情况变化，事实源是 `frontends/app/v5_src/static/dict/common/global_common.js` 与 `device_utils.js`。业务代码应调用 `checkIsPad()`，不要复制其中任意一段正则或自行维护第二份机型名单。

## App 设备信息与能力

App 内的系统版本、厂商、型号和应用版本来自两套桥：Harmony 使用 `harmonyUtils.getSystemInfo()`，Android/iOS DCloud 壳使用 `plus.runtime`、`plus.os` 和 `plus.device`。普通 Web 没有这些桥时，`getUserOsInfo()` 只从浏览器 UA 提取括号内信息。

是否支持打印、分享、定位、离线等原生能力，最终应按方法存在性和必要版本门槛判断。`ua() === 'app'` 只证明命中了 App 包标记，不证明某个桥方法一定可用。

## PC 壳判断

Windows NW.js 和 macOS Electron 都加载 `ehafo-quiz` 页面，并通过 UA 中的 `ehafopc` 使 `ispc='true'`。两套壳再通过不同能力区分：

| 运行形态 | 关键证据 |
| --- | --- |
| NW.js | `ispc === 'true'` 且存在 `nw` |
| Electron | `ispc === 'true'` 且 preload 暴露 `nodeRequire` |
| 普通桌面浏览器 | 通常 `ua() === 'other'`、`ispc === 'false'`，两种壳能力都不存在 |

确认用户实际使用哪套壳时，先取得安装包或下载 URL，再核对进程、应用名、`appId`、完整 UA 和上述能力。仓库职责与打包入口见[仓库与系统关系：PC 打包仓](../repositories.md#pc-打包仓)。

## 排查时最小采集项

在不记录用户身份和敏感数据的前提下，至少同时采集：

- 当前 URL、`getCurEnv()`、入口文件名和资源版本；
- `navigator.userAgent`，存在 Plus 时再记录 `plus.navigator.getUserAgent()`；
- `ua()`、`os`、`detail_os`、`ispc`、`isipad`、`pkgname` 与 App versionCode；
- `checkIsPad()`、`isInMiniProgram()`，以及问题所需桥方法是否存在；
- PC 场景的 `typeof nw` 与 `typeof nodeRequire`。

先用这些字段还原真实运行矩阵，再进入业务代码。只写“iPhone”“微信端”或“App 里”不足以复现跨端问题。
