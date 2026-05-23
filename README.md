# Pi Hero

Pi Hero 是一个 Pi 扩展包，整合并管理常用扩展包。

<img width="1536" height="932" alt="image" src="https://github.com/user-attachments/assets/358f6502-21c8-4386-8ed8-61da09912704" />

## 使用方式

### 安装

```bash
pi install npm:@lanten233/pi-hero
```

### 可用命令

在 Pi 中可直接执行以下命令：

- `hero:install-dep-pkg`：安装依赖的 Pi package
- `hero:remove-dep-pkg`：移除依赖的 Pi package

### 依赖包

当前会自动管理以下依赖：

- `context-mode`
- `pi-subagents`
- `pi-mcp-adapter`
- `pi-web-access`
- `@juicesharp/rpiv-ask-user-question`
- `@juicesharp/rpiv-todo`
