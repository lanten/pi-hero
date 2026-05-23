## 1. Zentui Footer Status Integration

- [x] 1.1 Update `extensions/zentui/footer.ts` to read `footerData.getExtensionStatuses()` during footer render.
- [x] 1.2 Convert extension status map entries into a stable, plugin-agnostic list of single-line footer segments.
- [x] 1.3 Append extension status segments to the existing right-side footer segments after context, token, and cost labels.
- [x] 1.4 Preserve plugin-provided status text, including ANSI control sequences, while reusing existing zentui separator and truncation behavior.

## 2. Codex Usage Refresh Behavior

- [x] 2.1 Update `extensions/codex-usage.ts` so `checking...` is shown only when no cached or existing Codex usage status is available.
- [x] 2.2 Keep the previous Codex usage status visible during automatic refreshes when cached or existing status is available.
- [x] 2.3 On successful automatic refresh, replace the old Codex usage status with the latest formatted usage status.
- [x] 2.4 On failed automatic refresh after a previous valid status exists, preserve the previous status instead of replacing it with `usage error`.
- [x] 2.5 Preserve explicit command behavior for manual `/codex-status` error reporting and status updates.

## 3. Verification

- [x] 3.1 Verify zentui displays a generic extension status set through `ctx.ui.setStatus()` without plugin-specific code.
- [x] 3.2 Verify zentui displays Codex usage status provided by `codex-usage`.
- [x] 3.3 Verify clearing a plugin status removes it from the zentui footer.
- [x] 3.4 Verify automatic Codex usage refresh does not flash `checking...` after an initial status exists.
