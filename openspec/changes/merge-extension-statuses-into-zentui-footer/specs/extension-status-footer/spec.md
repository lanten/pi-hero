## ADDED Requirements

### Requirement: Zentui footer displays extension statuses
The zentui footer SHALL display status text provided by plugins through Pi's extension status API.

#### Scenario: Plugin status is visible in zentui footer
- **WHEN** a plugin calls `ctx.ui.setStatus()` with a non-empty status text
- **THEN** the zentui footer displays that status text as part of its rendered footer content

#### Scenario: Multiple plugin statuses are visible
- **WHEN** multiple plugins set extension statuses with distinct keys
- **THEN** the zentui footer displays all available status texts in a stable order

#### Scenario: Plugin status is cleared
- **WHEN** a plugin clears its status by calling `ctx.ui.setStatus()` with `undefined`
- **THEN** the zentui footer no longer displays that plugin's status text

### Requirement: Zentui footer remains plugin-agnostic
The zentui footer SHALL read extension statuses generically and MUST NOT special-case Codex usage status keys or any other plugin-specific status keys.

#### Scenario: Unknown plugin status is displayed
- **WHEN** an arbitrary plugin sets a status using any key
- **THEN** the zentui footer displays the status text without requiring plugin-specific code

### Requirement: Zentui footer preserves plugin status text content
The zentui footer SHALL preserve plugin-provided status text content while fitting it into the existing footer layout.

#### Scenario: Status text contains ANSI formatting
- **WHEN** a plugin status contains ANSI control sequences
- **THEN** the zentui footer passes the status text through without stripping those sequences

#### Scenario: Status text contains line breaks
- **WHEN** a plugin status contains line breaks or repeated whitespace
- **THEN** the zentui footer renders the status as a single-line footer segment

### Requirement: Codex usage automatic refresh is quiet after initial load
The Codex usage status provider SHALL avoid replacing an existing status with `checking...` during automatic refreshes after an initial status or cache is available.

#### Scenario: First load shows checking status
- **WHEN** a Codex model session starts and no cached usage report is available
- **THEN** the Codex usage status may display `checking...` while the first usage query is in progress

#### Scenario: Automatic refresh keeps previous status while querying
- **WHEN** a Codex usage status already exists and an automatic refresh starts
- **THEN** the previous status remains visible while the refresh query is in progress

#### Scenario: Successful automatic refresh updates status
- **WHEN** an automatic Codex usage refresh succeeds
- **THEN** the Codex usage status is replaced with the latest formatted usage status

#### Scenario: Failed automatic refresh preserves existing status
- **WHEN** an automatic Codex usage refresh fails after a previous valid status exists
- **THEN** the previous Codex usage status remains visible instead of being replaced by `usage error`
