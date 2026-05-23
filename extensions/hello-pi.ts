import type {
  ExtensionAPI,
  ExtensionContext,
} from '@earendil-works/pi-coding-agent'

import { heroMessage, installDepPackages, removeDepPackages } from '../core'

export default function (pi: ExtensionAPI) {
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
  // ctx.ui.setWidget('hello-pi', [heroMessage], {
  //   placement: 'aboveEditor',
  // })
  //   ctx.ui.setHeader((tui, theme) => {
  //   return {
  //     render() {
  //       return [heroMessage]
  //     },
  //     invalidate() {},
  //   }
  // })
  ctx.ui.notify(heroMessage, 'info')
}
