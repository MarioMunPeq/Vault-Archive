/**
 * Fits the Pip-Boy screen to the viewport by computing a single runtime
 * --screen-scale: the design space (--screen-width x --screen-height in
 * variables.css) is scaled up to fill as much of the viewport as possible
 * (the button, gap and paddings below the screen share the same scaling
 * budget, so the whole assembly grows proportionally).
 */

function applyScreenScale() {
  if (typeof window === 'undefined') {
    return
  }
  const cs = getComputedStyle(document.documentElement)
  const value = (name: string, fallback: number) => {
    const parsed = parseFloat(cs.getPropertyValue(name))
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
  }

  const screenWidth = value('--screen-width', 700)
  const screenHeight = value('--screen-height', 420)
  const appGap = value('--app-gap', 20)
  const buttonSize = value('--power-button-size', 48)
  const appPadding = value('--app-padding', 8)

  // Total design-space height including button + gap + vertical padding.
  const totalDesignHeight = screenHeight + appGap + buttonSize + appPadding * 2

  const scale = Math.max(
    0.5,
    Math.min(
      (window.innerWidth * 0.96) / screenWidth,
      (window.innerHeight * 0.98) / totalDesignHeight,
    ),
  )

  document.documentElement.style.setProperty('--screen-scale', String(scale))
}

export function useScreenScale() {
  applyScreenScale()
}