export function playSfx(source: string): void {
  void new Audio(source).play()
}