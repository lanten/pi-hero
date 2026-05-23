import type { ExtensionAPI } from '@earendil-works/pi-coding-agent'

import { heroMessage } from '../core/hero'

export default function (pi: ExtensionAPI) {
  function showHello(ctx: any) {
    ctx.ui.setWidget('hello-pi', [heroMessage], {
      placement: 'aboveEditor',
    })
  }

  pi.registerCommand('hello-pi-test', {
    description: 'Verify hello-pi extension is loaded',
    handler: async (_args, ctx) => {
      showHello(ctx)
    },
  })
}
