import type {
  ExtensionAPI,
  ExtensionContext,
} from '@earendil-works/pi-coding-agent'

import { heroMessage, installDepPackages } from '../core'

export default function (pi: ExtensionAPI) {
  pi.on('session_start', (_event, ctx) => {
    showHello(ctx)
  })

  pi.registerCommand('hero:install-dep-pkg', {
    description: 'Verify hello-pi extension is loaded',
    handler: async (_args, ctx) => {
      installDepPackages(ctx)
    },
  })
}

function showHello(ctx: ExtensionContext) {
  ctx.ui.setWidget('hello-pi', [heroMessage], {
    placement: 'aboveEditor',
  })
}
