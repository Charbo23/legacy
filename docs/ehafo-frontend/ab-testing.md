# 易哈佛前台：A/B 测试

A/B 用于让同一用户路径在两套可比较实现之间受控切换。本项目主要用它处理接口迁移、页面或交互替换、离线能力入口和疑难问题对照；它不是长期业务配置，也不应把多个无关改动绑在同一个 key 上。

## 配置和代码入口

1. 代码侧以 `getAbTestDivision(key)` 为统一入口；需要分流的功能在初始化或实际使用前调用，并明确 A、B 各自的完整行为。
2. 配置由 `Common.Common.getSysConfigs` 的 `profile=home_core` 返回，前端消费 `ret.data.ab_test_data`。
3. 当前代码支持的分流规则：`directA` / `directB` 指定用户优先；`type=1` 固定 A；`type=2` 固定 B；`type=3` 按 UID 后两位区间；`type=4` 按当前考试 `cid` 列表。没有命中配置或取配置失败时回到 A。
4. 分流结果缓存在 `window.abTestDivisionList`，配置副本还会写入 `sessionStorage.ab_test_config`；普通请求会附带 `__abtest_result`，用于关联现场分组。

配置页：[生产环境](https://admin.ehafo.com/abtest_settings.php)、[DEV 环境](https://admin.dev.ehafo.com/abtest_settings.php)。惯用 key 为 `YYYYMMDDHHmm`。开启 B 后长期不删除会产生提醒；确实要长期保留时，需改为长期保留并写明原因。“测试功能列表”是端内调试入口，不是 A/B 配置页。

## 两种分流方式

| 方式 | 使用位置 | 注意点 |
| --- | --- | --- |
| 函数内分流 | `getAbTestDivision(key)` 后在同一调用链选择 A/B 实现 | 适合接口、局部功能和运行时行为；两组必须保持输入、缓存和副作用兼容 |
| 页面入口分流 | `route.config.js` 的 `abTestKey + abTestRes.A/B` | 构建时两个入口都会生成；收口时不仅删配置，还要清理路由对象和双份页面资源 |

## 使用过程

1. 定义要验证的单一假设、key、A/B 结果口径、回退行为和观测指标。
2. 增加分流调用和两套实现，先用直接指定用户或固定 B 在 DEV 验证，再确认请求、缓存、日志和页面都能区分分组。
3. 功能进入待上线后即可全量切到 B；通常观察 3 天后进入收口，但 3 天只是常用建议，不是强制门槛，实际以业务指标、数据表现和负责人判断为准。
4. 收口时删除分组、实验参数和双分支调用；保留 B 文件，用 B 内容覆盖 A，再把调用统一指回 A。
5. 清理后重新搜索 key、A/B 文件名和服务端分组字段，并走一次真实用户路径，避免只删配置却留下不可达代码。

## 注意事项

- A/B 只证明分流，不证明 B 的业务正确性；做题、支付、分享等关键链路仍需真实验收。
- A/B 共享缓存、数据库、队列或会提交答案、清空进度、创建订单等改变状态的请求时，必须验证 A 写 B 读、B 写 A 读、重试和幂等。
- 用户切换、退出登录和离线恢复会影响本地分流缓存；分组与预期不符时先核对当前 UID、`cid`、缓存和实际 `__abtest_result`，不要先改代码强制分组。
- 接口迁移同时检查字段、错误语义、超时重试和网关切换；新旧端不能因为只覆盖 B 而让旧版报错。
- 一轮只改变一个关键变量，否则问题消失后仍无法判断是哪项修改生效。

## 事实源

| 内容 | 位置 |
| --- | --- |
| 配置获取与分流算法 | `ehafo-quiz/frontends/app/v5_src/static/js/core/common/index.js`：`getAbTestConfig`、`getAbTestDivision` |
| 分流缓存初始值 | `ehafo-quiz/frontends/app/v5_src/variable_defined.js`：`window.abTestDivisionList` |
| 请求携带分组结果 | `ehafo-quiz/frontends/app/v5_src/static/js/core/utils/network_utils.js`：`__abtest_result` |
| 页面级 A/B 构建 | `ehafo-quiz/frontends/app/v5_src/route.config.js`、`ehafo-quiz/scripts/ci_src/v5/route_conf.ts` |
