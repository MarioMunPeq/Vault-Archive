const ICON_SOURCES = import.meta.glob<string>('../../../assets/icons/items/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(ICON_SOURCES).map(([path, source]) => [
    path.replace(/^.*\/([^/]+)\.svg$/, '$1'),
    source,
  ]),
)

function innerSvg(rawSvg: string): string {
  const match = rawSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/i)
  return match ? match[1] : ''
}

export interface ItemIconProps {
  icon: string
  className?: string
}

export function ItemIcon({ icon, className }: ItemIconProps) {
  const source = ICONS[icon]
  if (!source) return null

  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: innerSvg(source) }}
    />
  )
}