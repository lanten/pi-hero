## Context

`codex-usage` 已通过 Pi 标准扩展 API `ctx.ui.setStatus(STATUS_KEY, text)` 发布状态。Pi 默认 footer 会读取这些 extension statuses 并渲染；`zentui` 通过 `ctx.ui.setFooter()` 安装自定义 footer 后，当前只渲染 cwd/git/runtime/context/tokens/cost，没有读取 `footerData.getExtensionStatuses()`，因此其它插件状态不可见。

Pi 内部在 `ctx.ui.setStatus()` 被调用时会更新 `FooterDataProvider` 的 status map，并触发 `ui.requestRender()`。因此 zentui 不需要轮询或新增事件订阅，只要在 footer render 阶段读取 `footerData.getExtensionStatuses()`，即可拿到最新状态。

## Goals / Non-Goals

**Goals:**

- 在 zentui footer 中通用展示所有 extension statuses。
- 保持 zentui footer 的现有单行布局、宽度截断与配色体系。
- 避免 zentui 对 `codex-usage` 做特殊判断。
- 调整 `codex-usage` 自动刷新行为，使 `checking...` 只用于首次无缓存加载，后续自动刷新静默进行。
- 自动刷新失败时优先保留旧的可用 Codex 状态，减少干扰。

**Non-Goals:**

- 不移除或清理插件状态文本中的 ANSI 控制码。
- 不新增 status API、事件 API 或第三方依赖。
- 不改变 `codex-status` 命令名称和已有主要交互方式。
- 不重构 zentui footer 的整体布局或配置系统。

## Decisions

### Decision 1: zentui 在 render 阶段读取 extension statuses

在 `extensions/zentui/footer.ts` 的 footer `render(width)` 中使用 `footerData.getExtensionStatuses()` 获取状态 map，并将其转为稳定顺序的状态文本列表。

理由：

- `ctx.ui.setStatus()` 已由 Pi 内部触发重新渲染，render 阶段读取能及时获取最新值。
- 不需要新增状态缓存，避免 zentui 与 Pi 内部状态不同步。
- 对所有插件通用，兼容未来新增状态。

备选方案：

- 在 zentui 中监听特定插件事件或维护自己的 status store。该方案耦合更高，且不能通用兼容其它插件。

### Decision 2: extension statuses 合并到右侧信息区

将 extension statuses 作为 footer 右侧 segments 的后续项，与 context/tokens/cost 使用同一 separator 拼接。

示意：

```text
cwd on main node 24        12% | ↑123 ↓456 | $0.003 | codex 82% 5h 94% wk
```

理由：

- 不改变 footer 高度。
- 符合 zentui 当前单行 footer 设计。
- 可复用现有截断逻辑。

备选方案：

- 像默认 footer 一样增加单独状态行。该方案可读性更高，但会改变 zentui 的视觉密度和布局高度。

### Decision 3: zentui 不处理 ANSI，仅负责读取和排版

按照最新需求，zentui 不去除 ANSI 控制码。插件提供什么文本，zentui 就读取并合并展示；颜色优先由插件文本与 zentui 当前 render 行为共同决定。

理由：

- 保持实现简单。
- 避免误删其它插件有意提供的格式。
- 符合“zentui 中只读取就行”的约束。

### Decision 4: Codex 自动刷新静默化

`codex-usage` 的 `refreshCurrentCodexUsageStatusline()` 区分首次加载与后续刷新：

- 无缓存、无旧状态、首次加载时显示 `checking...`。
- 有缓存或已有状态时，自动刷新不再覆盖为 `checking...`。
- 自动刷新成功后替换为最新用量状态。
- 自动刷新失败时保留旧状态；首次加载失败仍可展示 `usage error` 并继续计划后续刷新。

理由：

- 避免每个 TTL 周期 footer 闪烁 `checking...`。
- 保留用户可见的最近有效用量。
- 首次加载仍有反馈，避免用户误以为功能未运行。

备选方案：

- 完全移除 `checking...`。这会降低首次加载反馈。
- 所有刷新都继续显示 `checking...`。这正是当前需要改善的问题。

## Risks / Trade-offs

- [Risk] 多个插件状态过长导致 footer 右侧信息拥挤。→ 复用 zentui 现有宽度计算与截断策略，优先保证不溢出。
- [Risk] 插件状态包含换行时破坏单行 footer。→ 实现时将每个 status 压缩为单行文本，例如把连续空白归一化为空格。
- [Risk] 自动刷新失败被静默保留旧状态，用户可能不知道数据已过期。→ 手动 `/codex-status --refresh` 仍应通知错误；后续如需要可增加过期标记，但本次不做。
- [Risk] ANSI 控制码可能影响宽度计算或视觉风格。→ 根据需求本次不清理 ANSI；若发现实际渲染问题，后续单独设计。
