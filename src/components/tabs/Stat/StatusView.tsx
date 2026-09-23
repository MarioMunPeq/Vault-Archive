import { SpriteLoop } from '../../SpriteLoop/SpriteLoop'
import './StatusView.css'

interface SpecialStat {
  id: string
  name: string
  value: number
  frames: readonly string[]
}

function framesFromGlob(modules: Record<string, string>): string[] {
  return Object.entries(modules)
    .map(([path, source]) => ({
      source,
      index: Number(path.match(/(\d+)\.[a-zA-Z]+(?:\?.*)?$/)?.[1] ?? 0),
    }))
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.source)
}

function toGreenSvgDataUri(rawSvg: string): string {
  const recolored = rawSvg.replace(/fill="#(?:FFF|FFFFFF)"/gi, 'fill="#1eff00"')
  return `data:image/svg+xml;utf8,${encodeURIComponent(recolored)}`
}

function svgFrames(modules: Record<string, string>): string[] {
  return framesFromGlob(modules).map(toGreenSvgDataUri)
}

const STRENGTH_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/strength/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const PERCEPTION_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/perception/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const ENDURANCE_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/endurance/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const CHARISMA_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/charisma/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const INTELLIGENCE_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/intelligence/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const AGILITY_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/agility/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const LUCK_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/luck/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const SPECIAL_STATS: readonly SpecialStat[] = [
  { id: 'STR', name: 'Fuerza', value: 7, frames: STRENGTH_FRAMES },
  { id: 'PER', name: 'Percepción', value: 6, frames: PERCEPTION_FRAMES },
  { id: 'END', name: 'Resistencia', value: 5, frames: ENDURANCE_FRAMES },
  { id: 'CHR', name: 'Carisma', value: 4, frames: CHARISMA_FRAMES },
  { id: 'INT', name: 'Inteligencia', value: 8, frames: INTELLIGENCE_FRAMES },
  { id: 'AGL', name: 'Agilidad', value: 6, frames: AGILITY_FRAMES },
  { id: 'LCK', name: 'Suerte', value: 5, frames: LUCK_FRAMES },
]



const GUN_ICON = `
<svg fill="#1eff00" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 511.991 511.991" xml:space="preserve">
<g>
	<g>
		<g>
			<path d="M149.152,149.333c0-30.443-3.029-66.645-25.557-104.491l-20.459-34.411C99.296,3.947,92.32,0,84.811,0
				C77.28,0,70.325,3.947,66.464,10.411l-20.48,34.411C24.117,81.6,21.152,118.293,21.152,149.333v21.333h128V149.333z"/>
			<path d="M21.156,405.346c0,7.808,2.261,15.019,5.931,21.312c-3.669,6.293-5.931,13.525-5.931,21.312v21.376
				c0,23.531,19.115,42.645,42.645,42.645h42.709c23.531,0,42.645-19.115,42.645-42.645V447.97c0-7.787-2.261-15.019-5.931-21.312
				c3.669-6.293,5.931-13.504,5.931-21.312V213.325h-128V405.346z M106.49,447.991l0.021,21.333l-42.688,0.043l-0.021-21.376H106.49
				z"/>
			<path d="M294.637,108.828l-20.48-34.411c-7.701-12.928-28.949-12.928-36.672,0l-20.48,34.432
				c-21.867,36.8-24.832,73.451-24.832,104.469l-0.043,21.333h128l0.043-21.333c0-30.421-3.029-66.645-25.536-104.469V108.828z"/>
			<path d="M191.823,405.346c0,7.808,2.261,15.019,5.931,21.312c-3.669,6.293-5.931,13.525-5.931,21.312v21.376
				c0,23.531,19.115,42.645,42.645,42.645h42.709c23.531,0,42.645-19.115,42.645-42.645V447.97c0-7.787-2.261-15.019-5.909-21.312
				c3.648-6.272,5.909-13.483,5.909-21.248l0.235-128.085h-128L191.823,405.346z M277.156,447.991l0.021,21.333l-42.688,0.043
				l-0.021-21.376H277.156z"/>
			<path d="M465.303,172.847v-0.021l-20.48-34.411c-7.701-12.928-28.949-12.928-36.672,0l-20.48,34.432
				c-21.867,36.8-24.832,73.451-24.832,104.469l-0.043,21.333h128l0.043-21.333C490.839,246.895,487.81,210.671,465.303,172.847z"/>
			<path d="M362.49,405.346c0,7.808,2.261,15.019,5.931,21.312c-3.669,6.293-5.931,13.525-5.931,21.312v21.376
				c0,23.531,19.115,42.645,42.645,42.645h42.709c23.531,0,42.645-19.115,42.645-42.645V447.97c0-7.787-2.261-14.997-5.909-21.291
				c3.648-6.293,5.909-13.483,5.909-21.248l0.171-64.107h-128L362.49,405.346z M447.823,447.991l0.021,21.333l-42.688,0.043
				l-0.021-21.376H447.823z"/>
		</g>
	</g>
</g>
</svg>`

const ARMOR_ICON = `
<svg fill="#1eff00" width="800px" height="800px" viewBox="0 0 32 32" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:serif="http://www.serif.com/" xmlns:xlink="http://www.w3.org/1999/xlink">

<g id="Icon">

<path d="M25,21.5c0,-0.319 -0.152,-0.619 -0.409,-0.807c-0.258,-0.188 -0.589,-0.243 -0.893,-0.146l-7.698,2.44c-0,0 -7.698,-2.44 -7.698,-2.44c-0.304,-0.097 -0.635,-0.042 -0.893,0.146c-0.257,0.188 -0.409,0.488 -0.409,0.807l0,6c0,0.552 0.448,1 1,1l16,0c0.552,0 1,-0.448 1,-1l0,-6Zm-2,1.366l0,3.634l-14,0c0,-0 0,-3.634 0,-3.634c0,0 6.698,2.123 6.698,2.123c0.196,0.063 0.408,0.063 0.604,0l6.698,-2.123Zm-2.002,-14.31c0.02,-0.341 -0.137,-0.668 -0.414,-0.868c-0.278,-0.199 -0.638,-0.243 -0.955,-0.116l-2.5,1c-0.38,0.151 -0.629,0.519 -0.629,0.928l0,11c0,0.317 0.151,0.616 0.406,0.804c0.255,0.189 0.585,0.245 0.888,0.152l6.5,-2c0.42,-0.129 0.706,-0.517 0.706,-0.956l0,-6c0,-0.552 -0.448,-1 -1,-1c-0.892,0 -1.663,-0.246 -2.203,-0.739c-0.516,-0.472 -0.797,-1.166 -0.797,-2.02c0,-0.062 -0.005,-0.124 -0.002,-0.185Zm-8.627,-0.984c-0.317,-0.127 -0.677,-0.083 -0.955,0.116c-0.277,0.2 -0.434,0.527 -0.414,0.868c0.003,0.061 -0.002,0.123 -0.002,0.185c0,0.854 -0.281,1.548 -0.797,2.02c-0.54,0.493 -1.311,0.739 -2.203,0.739c-0.552,0 -1,0.448 -1,1l0,6c0,0.439 0.286,0.827 0.706,0.956l6.5,2c0.303,0.093 0.633,0.037 0.888,-0.152c0.255,-0.188 0.406,-0.487 0.406,-0.804l0,-11c0,-0.409 -0.249,-0.777 -0.629,-0.928l-2.5,-1Zm6.756,2.354c0.21,0.942 0.675,1.72 1.32,2.31c0.666,0.609 1.537,1.023 2.553,1.186c0,0 0,4.339 0,4.339c0,0 -4.5,1.385 -4.5,1.385c0,0 0,-8.969 0,-8.969l0.627,-0.251Zm-6.254,0l0.627,0.251c0,0 0,8.969 0,8.969c-0,0 -4.5,-1.385 -4.5,-1.385c0,0 0,-4.339 0,-4.339c1.016,-0.163 1.887,-0.577 2.553,-1.186c0.645,-0.59 1.11,-1.368 1.32,-2.31Zm-1.892,-5.23c0.058,-0.294 -0.018,-0.598 -0.208,-0.83c-0.19,-0.232 -0.473,-0.366 -0.773,-0.366c-1.611,0 -3.965,1.17 -5.569,2.638c-1.191,1.089 -1.931,2.354 -1.931,3.362c0,0.552 0.448,1 1,1l5.5,0l0.981,-0.804l1,-5Zm11.019,-1.196c-0.3,0 -0.583,0.134 -0.773,0.366c-0.19,0.232 -0.266,0.536 -0.208,0.83l1,5l0.981,0.804l5.5,0c0.552,0 1,-0.448 1,-1c-0,-1.008 -0.74,-2.273 -1.931,-3.362c-1.604,-1.468 -3.958,-2.638 -5.569,-2.638Zm-13.82,5l-3.216,0c0.222,-0.299 0.501,-0.598 0.816,-0.886c0.847,-0.775 1.944,-1.485 2.948,-1.852l-0.548,2.738Zm15.64,0l-0.548,-2.738c1.004,0.367 2.101,1.078 2.948,1.852c0.315,0.288 0.594,0.587 0.816,0.886l-3.216,0Z"/>

</g>

</svg>`

const RAD_ICON = `
<svg fill="#1eff00" width="800px" height="800px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
<title>radiation</title>
<path d="M23.27 2.321c-0.108-0.064-0.238-0.102-0.378-0.102-0.262 0-0.493 0.135-0.627 0.34l-0.002 0.003-5.675 8.772c-0.078-0.012-0.156-0.020-0.235-0.027-0.085-0.008-0.169-0.012-0.254-0.015-0.034-0.001-0.066-0.010-0.101-0.010s-0.066 0.009-0.101 0.010c-0.085 0.002-0.168 0.006-0.253 0.015-0.077 0.007-0.154 0.014-0.23 0.026l-5.678-8.771c-0.135-0.208-0.366-0.344-0.629-0.344-0.14 0-0.271 0.038-0.382 0.105l0.003-0.002c-4.426 2.413-7.379 7.032-7.379 12.341 0 0.15 0.002 0.3 0.007 0.45l-0.001-0.022c0 0.001 0 0.002 0 0.003 0 0.401 0.315 0.728 0.71 0.749l0.002 0 10.438 0.528c0.029 0.074 0.058 0.147 0.091 0.219 0.034 0.075 0.071 0.147 0.11 0.218 0.017 0.032 0.027 0.067 0.045 0.099 0.022 0.037 0.052 0.067 0.074 0.104 0.041 0.066 0.082 0.131 0.127 0.194 0.044 0.062 0.088 0.123 0.136 0.182l-4.759 9.304c-0.052 0.099-0.082 0.217-0.082 0.341 0 0.277 0.151 0.519 0.375 0.649l0.004 0.002c2.105 1.283 4.644 2.057 7.361 2.096l0.011 0c2.728-0.039 5.266-0.813 7.437-2.133l-0.065 0.037c0.228-0.131 0.379-0.373 0.379-0.651 0-0.125-0.030-0.242-0.084-0.345l0.002 0.004-4.761-9.3c0.051-0.063 0.098-0.128 0.145-0.195 0.040-0.056 0.076-0.114 0.113-0.173 0.026-0.041 0.059-0.074 0.083-0.116 0.019-0.032 0.027-0.067 0.045-0.1 0.040-0.075 0.078-0.15 0.113-0.227 0.031-0.068 0.058-0.136 0.085-0.206l10.441-0.531c0.397-0.021 0.711-0.349 0.711-0.749 0-0.001 0-0.002 0-0.003v0c0.004-0.127 0.006-0.277 0.006-0.427 0-5.309-2.953-9.929-7.306-12.305l-0.073-0.037zM16.727 12.928c0.147 0.056 0.273 0.119 0.391 0.193l-0.009-0.005c0.497 0.289 0.865 0.755 1.019 1.311l0.004 0.015c0.026 0.087 0.048 0.193 0.062 0.301l0.001 0.011c0.012 0.083 0.018 0.18 0.018 0.277s-0.007 0.194-0.019 0.288l0.001-0.011c-0.015 0.119-0.038 0.224-0.067 0.327l0.004-0.016c-0.079 0.291-0.209 0.544-0.38 0.763l0.003-0.005c-0.119 0.154-0.252 0.288-0.401 0.403l-0.005 0.004c-0.068 0.053-0.145 0.106-0.226 0.154l-0.010 0.006c-0.239 0.14-0.52 0.239-0.819 0.279l-0.011 0.001c-0.087 0.012-0.187 0.019-0.289 0.019h-0c-0.207-0.001-0.407-0.031-0.597-0.085l0.016 0.004c-0.201-0.056-0.376-0.131-0.538-0.226l0.011 0.006c-0.087-0.052-0.161-0.102-0.232-0.157l0.005 0.004c-0.082-0.063-0.154-0.126-0.222-0.195l-0-0c-0.333-0.334-0.56-0.773-0.626-1.264l-0.001-0.011c-0.012-0.086-0.019-0.186-0.019-0.288v-0c0.002-0.411 0.113-0.795 0.307-1.126l-0.006 0.011c0.052-0.087 0.102-0.161 0.157-0.232l-0.004 0.005c0.267-0.336 0.616-0.597 1.016-0.755l0.016-0.006c0.214-0.093 0.464-0.147 0.726-0.147s0.512 0.054 0.739 0.152l-0.012-0.005zM8.875 3.989l5.108 7.891c-0.052 0.033-0.102 0.067-0.151 0.103-0.073 0.052-0.144 0.106-0.213 0.163-0.067 0.055-0.13 0.112-0.193 0.172-0.049 0.046-0.096 0.094-0.142 0.143-0.057 0.061-0.113 0.122-0.167 0.187-0.058 0.070-0.113 0.141-0.165 0.215-0.044 0.062-0.084 0.126-0.124 0.19-0.023 0.037-0.053 0.067-0.074 0.104-0.018 0.031-0.026 0.064-0.043 0.095-0.040 0.074-0.078 0.148-0.113 0.224s-0.065 0.153-0.095 0.232c-0.031 0.082-0.059 0.163-0.085 0.246-0.011 0.036-0.030 0.069-0.040 0.105-0.009 0.034-0.009 0.069-0.017 0.103-0.019 0.079-0.035 0.159-0.048 0.24-0.015 0.090-0.028 0.18-0.037 0.271-0.006 0.061-0.014 0.121-0.017 0.182l-9.384-0.475c0.055-4.404 2.424-8.242 5.945-10.361l0.055-0.031zM9.999 26.723l4.28-8.366c0.053 0.027 0.109 0.050 0.163 0.075 0.093 0.042 0.213 0.088 0.336 0.128l0.026 0.007c0.059 0.020 0.113 0.048 0.173 0.065 0.050 0.014 0.099 0.023 0.149 0.035 0.235 0.060 0.506 0.098 0.785 0.105l0.005 0c0.026 0.001 0.052 0.010 0.078 0.010l0.006-0.001 0.006 0.001c0.028 0 0.056-0.011 0.084-0.011 0.281-0.007 0.549-0.045 0.806-0.109l-0.026 0.005c0.051-0.012 0.102-0.021 0.152-0.036 0.063-0.018 0.12-0.047 0.182-0.068 0.144-0.046 0.259-0.090 0.371-0.139l-0.024 0.009c0.056-0.025 0.112-0.048 0.166-0.075l4.282 8.364c-1.727 0.986-3.796 1.567-6 1.567s-4.273-0.581-6.061-1.599l0.061 0.032zM19.738 14.859c-0.003-0.061-0.007-0.121-0.013-0.182-0.009-0.095-0.022-0.188-0.039-0.281-0.014-0.079-0.029-0.157-0.048-0.234-0.016-0.066-0.033-0.131-0.052-0.196-0.027-0.091-0.058-0.18-0.092-0.269-0.028-0.073-0.056-0.144-0.088-0.214-0.031-0.069-0.066-0.136-0.102-0.204-0.021-0.040-0.033-0.083-0.055-0.122-0.024-0.042-0.058-0.076-0.083-0.116-0.037-0.058-0.072-0.115-0.112-0.171-0.049-0.070-0.102-0.137-0.157-0.204-0.060-0.073-0.122-0.143-0.186-0.211-0.042-0.044-0.084-0.087-0.128-0.129-0.062-0.059-0.125-0.116-0.192-0.171-0.074-0.061-0.149-0.119-0.228-0.175-0.047-0.033-0.094-0.065-0.143-0.097l5.105-7.893c3.577 2.149 5.946 5.988 6 10.384l0 0.008z"></path>
</svg>`

const HELMET_ICON = `
<svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="800px" height="800px" viewBox="0 0 512 512"  xml:space="preserve">
<style type="text/css">
<![CDATA[
	.st0{fill:#1eff00;}
]]>
</style>
<g>
	<path class="st0" d="M490.462,316.323c-0.5-0.5-1.328-1.203-2.469-2.141c4.297-17.672,6.563-36.141,6.563-55.109
		c0-128.75-104.375-233.141-233.125-233.141c-123.625,0-224.797,96.266-232.609,217.938c-0.141,1.969-0.234,3.938-0.297,5.891
		c-1.813,3.781-3.672,7.719-4.313,7.938c-28.875,10.594-36.516,38.172,2.734,38.172h4.25H261.43
		c21.672,0,46.031,38.563,84.516,57.266c30.672,14.891,63.703,22.5,113.86,22.5c22.469,0,41.906-2.047,51.109-15.344
		C515.915,353.057,502.728,328.588,490.462,316.323z"/>
	<path class="st0" d="M273.258,379.588c-11.578,23.734-28.938,53.704-51.656,79.235c-6.016,6.766-5.406,17.109,1.344,23.109
		c6.766,6,17.109,5.406,23.109-1.359c25.984-29.266,44.734-62.156,57.203-87.844c5.844-12.063,10.266-22.531,13.359-30.313
		c-9.969-6.578-19.969-14.25-27.313-20.172C286.852,348.948,281.524,362.667,273.258,379.588z"/>
</g>
</svg>`

interface ConditionItem {
  icon: string
  label: string
  value: string
}

const CONDITIONS: readonly ConditionItem[] = [
  { icon: GUN_ICON, label: 'AMMO', value: '100%' },
  { icon: ARMOR_ICON, label: 'ARMOR', value: '54/100' },
  { icon: RAD_ICON, label: 'RADIATION', value: '25' },
  { icon: HELMET_ICON, label: 'HELMET', value: '—' },
]

export function StatusView() {
  return (
    <div className="status">
      <div className="status__content-block">
        <header className="status__header">
          <div className="status__identity">
            <p className="status__name">Mario Muñoz Pequeño</p>
            <p className="status__class">CLASS: Software Developer</p>
          </div>
        </header>

        <main className="status__main">
        <section className="status__special" aria-label="Atributos S.P.E.C.I.A.L.">
          <h2 className="status__special-title">S.P.E.C.I.A.L.</h2>
          <div className="special-grid">
            {/* Left column: STR, PER, END */}
            <div className="special-col special-col--left">
              {['STR', 'PER', 'END'].map((id) => {
                const stat = SPECIAL_STATS.find(s => s.id === id)!
                return (
                  <div
                    key={id}
                    className="special-cell"
                    role="button"
                    tabIndex={0}
                    aria-label={`${stat.name}, ${stat.value}`}
                  >
                    <span className="special-cell__sigla">{stat.id}</span>
                    <SpriteLoop
                      className="special-cell__icon"
                      frames={stat.frames}
                    />
                    <span className="special-cell__value">{stat.value}</span>
                  </div>
                )
              })}
            </div>

            {/* Center column: CHR */}
            <div className="special-col special-col--center">
              {(() => {
                const stat = SPECIAL_STATS.find(s => s.id === 'CHR')!
                return (
                  <div
                    key="CHR"
                    className="special-cell"
                    role="button"
                    tabIndex={0}
                    aria-label={`${stat.name}, ${stat.value}`}
                  >
                    <span className="special-cell__sigla">{stat.id}</span>
                    <SpriteLoop
                      className="special-cell__icon"
                      frames={stat.frames}
                    />
                    <span className="special-cell__value">{stat.value}</span>
                  </div>
                )
              })()}
            </div>

            {/* Right column: INT, AGL, LCK */}
            <div className="special-col special-col--right">
              {['INT', 'AGL', 'LCK'].map((id) => {
                const stat = SPECIAL_STATS.find(s => s.id === id)!
                return (
                  <div
                    key={id}
                    className="special-cell"
                    role="button"
                    tabIndex={0}
                    aria-label={`${stat.name}, ${stat.value}`}
                  >
                    <span className="special-cell__sigla">{stat.id}</span>
                    <SpriteLoop
                      className="special-cell__icon"
                      frames={stat.frames}
                    />
                    <span className="special-cell__value">{stat.value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <div className="status__conditions-bar">
          {CONDITIONS.map((condition) => (
            <div key={condition.label} className="status-condition">
              <span
                className="status-condition__icon"
                dangerouslySetInnerHTML={{ __html: condition.icon }}
              />
              <div className="status-condition__info">
                <span className="status-condition__label">{condition.label}</span>
                <span className="status-condition__value">{condition.value}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      </div>

      <footer className="status__footer">
        <div className="status__stats">
          <div className="status__stat">
            <span className="status__stat-label">HP</span>
            <span className="status__stat-value">115/115</span>
          </div>
          <div className="status__stat">
            <span className="status__stat-label">LEVEL</span>
            <span className="status__stat-value">24</span>
          </div>
          <div className="status__stat">
            <span className="status__stat-label">AP</span>
            <span className="status__stat-value">90/90</span>
          </div>
        </div>
      </footer>
    </div>
  )
}