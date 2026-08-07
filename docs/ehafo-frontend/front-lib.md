# 易哈佛前台：ehafo-front-lib

[ehafo-front-lib](https://github.com/ehafo/ehafo-front-lib) 是前台公共方法库。它不是业务仓，也不替代 `ehafo-quiz` 的页面适配层；现有公共实现集中在这里，但新增方法默认仍先落在 quiz，只有明确需要跨项目复用或需要统一修复时才下沉到公共库。

## 先判断改哪个仓库

在 `ehafo-quiz` 中，绝大多数业务代码调用的是旧式全局函数，例如 `dateFormat`、`loadFile`、`local_get`、`checkIsCDNImg`，而不是直接导入公共库。对应关系如下：

| quiz 适配层 | 主要包装内容 | 修改判断 |
| --- | --- | --- |
| `frontends/app/v5_src/static/js/core/utils/common_utils.js` | 判空、字符串、URL、DOM、异步、校验、剪贴板、动态加载、图片/视频辅助等 | 先判断是否只是旧全局函数适配；公共算法需要跨项目复用时才改公共库 |
| `core/utils/date_utils.js` | 日期格式化、倒计时、时长格式化 | 业务计时状态仍在 quiz，通用计算才属于公共库 |
| `core/utils/storage_utils.js` | 过期存储、页面 session 备份，以及 `advancedStorageUtils` 的初始化和兼容降级 | 存储键名、账号隔离和清理规则属于 quiz；存储抽象属于公共库 |
| `core/utils/device_utils.js` | UA、设备和运行载体判断；部分原生能力转接 | 载体业务分支在 quiz；可复用的设备能力才改公共库 |
| `static/js/webp_utils.js` | WebP 能力检测、CDN 图片转换和 HTML 图片转换 | 图片业务策略在 quiz，WebP 算法在公共库 |
| `core/utils/ai_chat_utils.js` | AI 流式输出工具的项目入口 | 对话页面和接口协议在 quiz，通用流式处理才改公共库 |
| `core/common/router_events.js`、`core/common/index.js` | 滑动返回、地区处理、题目标记和小程序环境判断等少量公共调用 | 先查公共函数是否已有实现，避免在页面脚本重复实现 |

## 公共库实际包含的能力

源码入口在 `ehafo-front-lib/src/`，当前可以按下面几组理解：

| 模块 | 能力范围 | quiz 中的使用方式 |
| --- | --- | --- |
| `src/common/` | 通用对象/字符串、URL、DOM、AI 流式输出、滑动返回 | 由 `core/utils` 和 `core/common` 包装为历史全局函数 |
| `src/date/` | 日期、倒计时和时间格式化 | 由 `date_utils.js` 暴露旧调用方式 |
| `src/device/` | UA、设备、微信小程序和部分运行环境判断 | 由 `device_utils.js` 适配到现有 `ua()` 等函数 |
| `src/media/` | 图片、视频辅助和 WebP 转换 | `webp_utils.js` 直接转接，媒体页面再组合业务逻辑 |
| `src/storage/` | 基础过期存储和基于 localForage 的高级存储 | `storage_utils.js` 根据载体选择 IndexedDB 或 localStorage，并保留降级路径 |
| `src/request/` | `TrackRequest` 使用的基础 XHR 封装 | 只属于统计 SDK 内部；前台普通接口仍使用 quiz 自己的 `jqrequest` |
| `src/track/` | `TrackBase` 事件采集、`TrackRequest` 请求和批量上报 | 通过独立的 `EhafoLibTrack` 入口加载；quiz 的 `new_track/track-sdk-v2.js` 是项目适配和扩展层 |
| `src/harmony/` | 鸿蒙原生能力封装 | 通过独立的 `EhafoLibHarmony` 入口加载，再由 `static/js/libs/harmony_utils.js` 接入 |

完整 UMD 构建由 `rollup.config.mjs` 生成：普通能力使用 `EhafoLib`，统计使用 `EhafoLibTrack`，鸿蒙能力使用 `EhafoLibHarmony`。`ehafo-quiz/frontends/app/entry.tpl.html` 中声明了对应的 CDN 资源和加载顺序。

## 统计是独立入口

自研统计虽然位于这个公共库，但不要把统计实现和普通公共方法混在一起理解：

1. `ehafo-front-lib/src/track/` 提供通用采集与发送能力。
2. `ehafo-quiz/frontends/app/v5_src/static/js/libs/new_track/track-sdk-v2.js` 在 `TrackBase` 上增加前台项目规则。
3. `ehafo-quiz/frontends/app/v5_src/static/js/libs/common_track_report.js` 负责加载 SDK、设置统计接口、公共字段和离线静默策略。
4. 事件字段、项目适配和具体调用仍以[自研统计](./tracking.md)为准。

因此，统计事件缺失通常先查 quiz 的适配层和调用位置；只有采集或请求机制本身有问题时，才回到 `ehafo-front-lib/src/track/`。

## 容易误判的边界

- **不要看到一个旧全局函数就直接改公共库。** 先沿着 quiz 的包装函数查调用者；很多函数只是为了兼容历史命名，业务行为完全在 quiz 中。
- **不要因为它叫“公共库”就把新方法都下沉。** 如果方法只服务 ehafo-quiz，或者需要依赖 quiz 的路由、登录、接口和业务状态，通常留在 quiz；只有稳定的跨项目能力才考虑进入公共库。
- **不要把 `EhafoLib`、`EhafoLibTrack`、`EhafoLibHarmony` 当作同一个脚本。** 它们是不同构建入口，缺少对应入口时，普通公共方法可用并不代表统计或鸿蒙能力可用。
- **公共库加载失败会影响启动。** 部分 quiz 包装函数有本地降级，部分只输出“公共库方法未定义”；排查白屏、首屏异常或按需加载失败时，先确认 CDN 资源和 `entry.tpl.html` 的顺序。
- **修改公共库要同时考虑发布产物。** quiz 使用的是公共库构建后的 UMD 文件，不会自动读取 `ehafo-front-lib/src`；公共库改动必须构建并更新实际 CDN 产物后，前台才会命中。
- **公共库 API 文档不是业务事实源。** 参数和实现以当前源码为准，前台的账号、路由、缓存、接口和兼容策略仍以 `ehafo-quiz` 为准。

## 修改前的最短路径

可以直接让 Agent 按下面的方式处理：

> “先查这个调用在 ehafo-quiz 的适配层和公共库实现，判断是项目业务逻辑、历史兼容包装，还是确实应该下沉到 ehafo-front-lib；只改应负责的仓库，并验证普通 Web、App 和微信受影响的路径。”
