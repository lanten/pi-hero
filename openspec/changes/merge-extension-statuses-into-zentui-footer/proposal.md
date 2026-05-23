## Why

`codex-usage` 通过 `ctx.ui.setStatus()` 提供 Codex 用量状态，但 `zentui` 安装自定义 footer 后没有读取 Pi 的 extension status 数据，导致默认 footer 中可见的状态信息在 zentui 中不可见。
同时，Codex 用量自动刷新时会反复显示 `checking...`，造成 footer 闪烁和不必要的视觉干扰。

## What Changes

- `zentui` footer 通用读取 `footerData.getExtensionStatuses()`，将所有插件通过 `ctx.ui.setStatus()` 提供的状态合并展示到现有 footer 中。
- `zentui` 不硬编码 `codex-usage`，保持对其它插件状态信息的兼容。
- `zentui` 只读取和排版 extension statuses，不额外清理或移除插件状态文本中的 ANSI 控制码。
- 调整 `codex-usage` 状态刷新逻辑：首次加载且无可用缓存时可显示 `checking...`；后续自动刷新保持静默，成功后替换为新状态，失败时尽量保留旧状态。
- 保持现有命令和 footer API 不变，不引入新依赖。

## Capabilities

### New Capabilities
- `extension-status-footer`: zentui 自定义 footer 应展示其它插件通过 Pi extension status API 提供的状态信息，并支持 Codex 用量状态的低干扰刷新体验。

### Modified Capabilities

## Impact

- Affected code:
  - `extensions/zentui/footer.ts`
  - `extensions/codex-usage.ts`
- Affected behavior:
  - zentui footer 会展示所有 extension statuses。
  - Codex 用量自动刷新不再反复显示 `checking...`。
- APIs/dependencies:
  - 使用现有 `footerData.getExtensionStatuses()` 和 `ctx.ui.setStatus()` API。
  - 不新增第三方依赖。
