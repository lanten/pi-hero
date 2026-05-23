import { spawn } from 'node:child_process'
import type { ExtensionCommandContext } from '@earendil-works/pi-coding-agent'

const DEP_PACKAGES = [
  '@juicesharp/rpiv-ask-user-question',
  '@juicesharp/rpiv-todo',
  'context-mode',
  'pi-mcp-adapter',
  'pi-subagents',
  'pi-web-access',
]

let operating = false

export async function installDepPackages(ctx: ExtensionCommandContext) {
  await operateDepPackages(ctx, 'install')
}

export async function removeDepPackages(ctx: ExtensionCommandContext) {
  await operateDepPackages(ctx, 'remove')
}

async function operateDepPackages(
  ctx: ExtensionCommandContext,
  action: 'install' | 'remove',
) {
  if (operating) {
    setStatus(ctx, '依赖包操作正在执行中，请稍候...')
    return
  }

  operating = true
  const failedPackages: string[] = []
  const actionText = action === 'install' ? '安装' : '移除'

  try {
    for (const packageName of DEP_PACKAGES) {
      setStatus(ctx, `正在${actionText} Pi 依赖包：${packageName}`)

      const result = await runPiPackageCommand(action, packageName)
      if (!result.ok) {
        failedPackages.push(packageName)
        setStatus(
          ctx,
          `${actionText}失败：${packageName}\n\n${result.output || '未获取到错误输出'}`,
        )
        continue
      }
    }

    if (failedPackages.length > 0) {
      setStatus(ctx, `部分依赖包${actionText}失败：${failedPackages.join(', ')}`)
      return
    }

    setStatus(ctx, `Pi 依赖包${actionText}完成，正在重新加载资源...`)
    await ctx.reload()
  } finally {
    operating = false
  }
}

function runPiPackageCommand(
  action: 'install' | 'remove',
  packageName: string,
): Promise<{ ok: boolean; output: string }> {
  return new Promise((resolve) => {
    const command = process.platform === 'win32' ? 'pi.cmd' : 'pi'
    let child: ReturnType<typeof spawn>

    try {
      child = spawn(command, [action, `npm:${packageName}`], {
        shell: process.platform === 'win32',
        // stdio: ['ignore', 'pipe', 'pipe'],
      })
    } catch (error) {
      resolve({
        ok: false,
        output: error instanceof Error ? error.message : String(error),
      })
      return
    }

    let output = ''

    child.stdout?.on('data', (chunk) => {
      output += chunk.toString()
    })

    child.stderr?.on('data', (chunk) => {
      output += chunk.toString()
    })

    child.on('error', (error) => {
      resolve({ ok: false, output: error.message })
    })

    child.on('close', (code) => {
      resolve({ ok: code === 0, output: output.trim() })
    })
  })
}

function setStatus(ctx: ExtensionCommandContext, message: string) {
  ctx.ui.setWidget('pi-hero-dep-packages', [message], {
    placement: 'aboveEditor',
  })
}
