export function playSfx(source: string): void {
  // Autoplay can be blocked before the first user gesture; ignore that
  // rejection instead of letting it bubble up as an unhandled promise.
  void new Audio(source).play().catch(() => {})
}