# 易哈佛前台：MP 与 subproject

本页只保留代码位置、访问路径和容易误判的边界。页面字段、接口和构建参数以源仓当前源码为准。`web_course` 虽然也落在 `subproject/app` 下，但它是另一套独立产物，本页单独说明。

## 先区分入口

- **当前 MP**：由 `launchMiniproject` 打开，默认路径为 `.../mp/{projectId}/`；版本和项目资料由 `mp-nexus` 管理。
- **subproject（SP）**：人机对话、内部考核和电子试卷由 `launchSubproject` 打开，默认路径为 `.../v5/subproject/app/{projectId}/`。这是历史 MP 体系的子应用，不要按当前 MP 的目录和资源规则处理。

## 代码位置

| 内容 | 位置 |
| --- | --- |
| MP / SP 启动函数 | `ehafo-quiz/frontends/app/v5_src/static/js/core/common/index.js`：`launchMiniproject`、`launchSubproject` |
| 主仓直接入口 | `frontends/app/v5_src/static/js/app.js` 中的 `miniproject_id`、`subproject_id` 分支 |
| SP 目录约定 | `frontends/app/v5_src/subproject/README.md` |
| 人机对话产物 | `frontends/app/v5_src/subproject/app/machine_exam/` |
| 内部考核产物 | `frontends/app/v5_src/subproject/app/performanceAppraisal/` |
| 电子试卷产物 | `frontends/app/v5_src/subproject/app/epaper/` |
| AI 课程播放器产物 | `frontends/app/v5_src/subproject/app/web_course/` |
| AI 课程父页集成 | `frontends/app/v5_src/static/js/shop/videos.js`：`WebCoursePlayer`、`webCoursePlayFn` |
| 主仓测试入口 | `frontends/app/v5_src/quiz/public/mp_test_list.html` |

## SP 访问与资源

`launchSubproject(projectId, extra)` 会先补目录结尾 `/`，再拼接合法 `sessionid` 和 `_v`。三个重点项目的额外参数不同：

- `machine_exam`：会拼接 `cid`、`examid`、`subject_id` 和考试名称，并在 App 侧锁定横屏。
- `performanceAppraisal`：分享直达时使用 `#/pages/participant/participant`，其他页面由子应用自身路由处理。
- `epaper`：会拼接 `cid`、`scopeTime`，返回时还要配合主仓的 `mini_epaper_back` 处理。

SP 的入口 HTML 是各自构建产物，不走主仓普通页面的 `common_init.html` / `base.js` 资源链。当前三个入口实际情况：

- 三个入口仍引用线上 `/miniproject/core/index.js` 兼容运行时并使用 `mpUtils`。这份运行时由部署产物提供，不在当前 `subproject` 源码目录维护；不要因为目录名已经改成 `subproject` 就替换它。
- 各项目自己的 `assets/index-*.js`、CSS 和页面 chunk 由独立源码仓构建后落入对应 `subproject/app/{projectId}/`。
- `performanceAppraisal` 还额外加载 `static/mp_service/performanceAppraisal.js`，其服务名使用 `mpUtils`，这也是现有产物仍引用旧 `/miniproject/core/index.js` 的重要原因。不要自行替换 core 路径；修改前必须同时核对运行时、业务服务和入口产物。
- 三个独立源码仓通过 uni-app 构建，再把构建结果复制到 `ehafo-quiz/frontends/app/v5_src/subproject/app/`；主仓静态产物是否更新是独立检查点。

## web_course 例外

`web_course` 仍在使用，但不是第四个普通 SP。它来自 Codeup 的独立源码项目，当前编译产物可确认是 Vite + Vue 3 单页应用，包含自己的 Vue Router、Pinia、播放器组件和 KaTeX 资源，不引用 quiz 的公共运行时或 utils。

quiz 的 `shop/videos.js` 在 AI 课程路径中创建 iframe，访问 `v5/subproject/app/web_course/index.html`；父页和播放器通过 `web_course_*` `postMessage` 事件传递初始化数据、播放状态、进度、全屏和错误信息。更新时应在独立源码项目完成构建，再用完整编译结果覆盖 `subproject/app/web_course/`，不能直接修改压缩后的 chunk，也不能套用三个 SP 的 uni-app 或兼容运行时处理方式。

## 常见踩坑

| 现象 | 先查什么 |
| --- | --- |
| SP 打开后匿名或版本没更新 | 最终 URL 是否保留结尾 `/`、`sessionid`、`_v`；目录地址被 301 时 query 可能丢失 |
| 独立仓已改但页面不变 | 独立源码构建产物和 `ehafo-quiz/subproject/app/{projectId}` 是否同时更新，不能只看其中一个仓库 |
| 三个 SP 一起异常 | 核对线上 `/miniproject/core/index.js` 是否可用，再查域名、登录、父子 WebView 通信和返回处理；不要去已清理的主仓目录寻找运行时源码 |
| 人机对话布局或返回异常 | `launchSubproject` 的横屏锁定、`machine_finish` 回传和恢复竖屏 |
| 内部考核分享打不开 | 是否带 `share_exam_id`，以及是否命中 participant hash 路由 |
| 电子试卷新页面不生效 | `App.Epaper.IndexInfo`、设备条件、新旧实现分流和 `mini_epaper_back` |
| 把 SP 当 MP 调试 | 不要套用 MP 的 `base.js`、目录、登录和版本缓存判断；先看入口 HTML 的实际 script 列表和 core 路径 |
| AI 课程播放器空白或卡住 | 先看 iframe 是否加载 `web_course/index.html`、是否收到 `web_course_init`、父页是否发送初始化数据，再判断独立产物还是父页集成问题 |

构建同步方式已确认：三个 SP 在独立仓用 uni-app 构建后复制到主仓对应目录；`web_course` 在自己的项目中构建后复制完整产物。人工构建参数、复制后的提交顺序仍以当次变更和源仓说明为准；遇到产物不一致时，以入口 HTML、静态文件哈希和真实 WebView 请求为准继续追踪。
