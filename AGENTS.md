# Legacy 交接文档维护规则

本仓库本身就是交接文档，不扩展通用项目模板，也不建立独立过程台账。

1. 先读 `docs/project-overview.md` 确认逻辑项目和交接范围。
2. 易哈佛前台从 `docs/ehafo-frontend/overview.md` 进入；涉及运行环境、域名、入口或环境切换时读取 `docs/ehafo-frontend/environment-and-device/environment.md`；涉及 UA、运行容器、系统、PC 壳或平板时读取 `docs/ehafo-frontend/environment-and-device/ua-device.md`；涉及当前 MP、人机对话、内部考核或电子试卷时读取 `docs/ehafo-frontend/mp-and-subprojects.md`；涉及 A/B 时读取 `docs/ehafo-frontend/ab-testing.md`；涉及埋点接入、事件缺失或统计看板时读取 `docs/ehafo-frontend/tracking.md`；涉及页面测试、验收和高频工作流提示词时读取 `docs/ehafo-frontend/lessons.md`，其他内容再按需要读取同目录的仓库关系或问题排查。
3. `team-agent-config` 从 `docs/team-agent-config/overview.md` 进入；详细命令和实现优先回到该仓库自己的 README 与 `docs/`。
4. 小护排班读取 `docs/schedule/overview.md`；业务规则不在当前范围内。
5. 本仓重点记录如何判断、如何排查和容易踩坑的边界，不大篇幅复制源码细节；源仓已有完整说明时只写用途和文档位置。
6. 高频工作流优先写成可直接交给 Agent 的自然语言提示词，使接手人不需要先学习底层命令。
7. 只把负责人明确确认的内容写成规则；从源码推断的内容必须标为待确认问题。
8. 新内容优先合并进现有页面，只有形成独立、长期主题后才新增文件。
9. 不记录凭据、客户隐私、用户 UID、PageSpy 原文、截图、视频或生产日志。
10. PageSpy 具体操作以 `ehafo-quiz/.codex/skills/debug-with-pagespy/SKILL.md` 为入口，不在本仓复制 SOP。

验证命令：`npm run docs:build`。需要生成可离线传阅的单文件文档时运行 `npm run docs:single`，产物为 `dist/legacy-handover.md`。
