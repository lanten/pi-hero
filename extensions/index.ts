import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent'

import { heroMessage, installDepPackages, removeDepPackages } from '../core'
import { codexUsage } from './codex-usage'

export default function (pi: ExtensionAPI) {
  codexUsage(pi)

  pi.on('session_start', (_event, ctx) => {
    setTimeout(() => {
      showHello(ctx)
    }, 50)
  })

  pi.registerCommand('hero:install-dep-pkg', {
    description: 'Install Pi Hero dependency packages',
    handler: async (_args, ctx) => {
      await installDepPackages(ctx)
    },
  })

  pi.registerCommand('hero:remove-dep-pkg', {
    description: 'Remove Pi Hero dependency packages',
    handler: async (_args, ctx) => {
      await removeDepPackages(ctx)
    },
  })
}

function showHello(ctx: ExtensionContext) {
  ctx.ui.notify(heroMessage, 'info')
}
