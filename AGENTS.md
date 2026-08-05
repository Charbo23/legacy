# Legacy 交接文档维护规则

本仓库本身就是交接文档，不扩展通用项目模板，也不建立独立过程台账。

1. 先读 `docs/project-overview.md` 确认范围和系统关系。
2. 涉及故障定位与调试手段时，读 `docs/troubleshooting.md`。
3. 涉及 A/B、兼容性、验收或历史实践时，读 `docs/lessons.md`。
4. 只把负责人明确确认的内容写成规则；从源码推断的内容必须标为待确认问题。
5. 新内容优先合并进现有页面，只有形成独立、长期主题后才新增文件。
6. 不记录凭据、客户隐私、用户 UID、PageSpy 原文、截图、视频或生产日志。
7. PageSpy 具体操作以 `ehafo-quiz/.codex/skills/debug-with-pagespy/SKILL.md` 为入口，不在本仓复制 SOP。

验证命令：`npm run docs:build`。
