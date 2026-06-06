import { gray } from 'picocolors'
import { spawn } from 'node:child_process'
import type { ExtensionCommandContext } from '@earendil-works/pi-coding-agent'

const DEP_PACKAGES = [
  '@juicesharp/rpiv-ask-user-question',
  '@juicesharp/rpiv-todo',
  // '@gotgenes/pi-permission-system',
  'context-mode', // MCP 上下文优化
  'pi-mcp-adapter', // MCP 适配器
  '@marckrenn/pi-sub-bar',
  'pi-subagents',
  'pi-smart-fetch',
  'pi-zentui',
]

let operating = false

export async function installDepPackages(ctx: ExtensionCommandContext) {
  await operateDepPackages(ctx, 'install')
}

export async function removeDepPackages(ctx: ExtensionCommandContext) {
  await operateDepPackages(ctx, 'remove')
}

async function operateDepPackages(ctx: ExtensionCommandContext, action: 'install' | 'remove') {
  if (operating) {
    setStatus(ctx, 'Please waiting...')
    return
  }

  operating = true
  const failedPackages: string[] = []

  try {
    for (const packageName of DEP_PACKAGES) {
      setStatus(ctx, `${action} pi-package: ${packageName}`)

      const result = await runPiPackageCommand(action, packageName)
      if (!result.ok) {
        failedPackages.push(packageName)
        setStatus(ctx, `${action} failed: ${packageName}\n\n${result.output || 'No output'}`)
        continue
      }
    }

    if (failedPackages.length > 0) {
      setStatus(ctx, `Some dependency packages failed to ${action}: ${failedPackages.join(', ')}`)
      return
    }

    setStatus(ctx, `Pi dependency packages ${action} completed. Reloading resources...`)
    await ctx.reload()
  } finally {
    operating = false
  }
}

function runPiPackageCommand(action: 'install' | 'remove', packageName: string): Promise<{ ok: boolean; output: string }> {
  return new Promise((resolve) => {
    const command = process.platform === 'win32' ? 'pi.cmd' : 'pi'
    let child: ReturnType<typeof spawn>

    try {
      child = spawn(command, [action, `npm:${packageName}`], {
        shell: process.platform === 'win32',
        stdio: ['ignore', 'pipe', 'pipe'],
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
  ctx.ui.setWidget('pi-hero-dep-packages', [gray(message)], {
    placement: 'aboveEditor',
  })
}
