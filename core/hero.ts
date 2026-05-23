const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'

const rgbStops = [
  [195, 232, 141], // green
  [137, 221, 255], // cyan
  [130, 170, 255], // blue
  [199, 146, 234], // purple
  [255, 203, 107], // amber
] as const

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}

function colorAt(t: number) {
  const n = rgbStops.length - 1
  const x = Math.min(n - 1e-9, Math.max(0, t * n))
  const i = Math.floor(x)
  const p = x - i

  const [r1, g1, b1] = rgbStops[i]
  const [r2, g2, b2] = rgbStops[i + 1]

  return `\x1b[38;2;${lerp(r1, r2, p)};${lerp(g1, g2, p)};${lerp(b1, b2, p)}m`
}

function gradientLine(line: string) {
  const chars = [...line]
  const width = Math.max(1, chars.length - 1)

  return (
    chars
      .map((ch, i) => {
        if (ch === ' ') return ch
        return `${colorAt(i / width)}${ch}`
      })
      .join('') + RESET
  )
}

const rawLogo = [
  '█████████╗        ██╗  ██╗███████╗██████╗  ██████╗',
  '███╔══███║        ██║  ██║██╔════╝██╔══██╗██╔═══██╗',
  '█████████║   ███╗ ███████║█████╗  ██████╔╝██║   ██║',
  '███╔═════███╗╚══╝ ██╔══██║██╔══╝  ██╔══██╗██║   ██║',
  '███║     ███║     ██║  ██║███████╗██║  ██║╚██████╔╝',
  '╚══╝     ╚══╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝',
]

function makeHeroLogo() {
  return (
    '\n' +
    BOLD +
    rawLogo.map(gradientLine).join('\n') +
    RESET +
    `\n\n\x1b[38;2;195;232;141m⚡ PI.Agent${RESET} \x1b[90m· HERO mode · terminal coding harness${RESET}`
  )
}

export const heroMessage = makeHeroLogo()
