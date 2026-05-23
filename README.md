# Pi Hero

Pi Hero 是一个 Pi 扩展包，用于在会话开始时展示欢迎信息，并提供依赖包的安装/移除命令。

<img width="1536" height="932" alt="image" src="https://github.com/user-attachments/assets/358f6502-21c8-4386-8ed8-61da09912704" />

## 使用方式

### 1. 安装
将本仓库作为 Pi package 安装后，Pi 会根据 `package.json` 中的 `pi` 配置自动加载：

- `extensions/`
- `skills/`
- `prompts/`
- `themes/`

### 2. 启用效果
启动 Pi 并进入会话后，会自动弹出一条欢迎通知。

### 3. 可用命令
在 Pi 中可直接执行以下命令：

- `hero:install-dep-pkg`：安装依赖的 Pi package
- `hero:remove-dep-pkg`：移除依赖的 Pi package

### 4. 依赖包
当前会自动管理以下依赖：

- `context-mode`
- `pi-subagents`
- `pi-mcp-adapter`
- `pi-web-access`
- `@juicesharp/rpiv-ask-user-question`
- `@juicesharp/rpiv-todo`
