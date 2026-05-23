# Pi Hero

Pi Hero 是一个 Pi 扩展包，整合并管理常用扩展包。

<img width="907" height="339" alt="image" src="https://github.com/user-attachments/assets/a7fa2dcb-84c1-46b0-aa91-59657cc29ec1" />

## 使用方式

### 安装

```bash
pi install npm:@lanten233/pi-hero
```

### 可用命令

在 Pi 中可直接执行以下命令：

- `/hero:install-dep-pkg`：安装依赖的 Pi package
- `/hero:remove-dep-pkg`：移除依赖的 Pi package

### 依赖包

当前会自动管理以下依赖：

- `context-mode`
- `pi-subagents`
- `pi-mcp-adapter`
- `pi-web-access`
- `@juicesharp/rpiv-ask-user-question`
- `@juicesharp/rpiv-todo`
