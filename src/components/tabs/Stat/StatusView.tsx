import { useState } from 'react'
import type { CSSProperties } from 'react'
import { SpriteLoop } from '../../SpriteLoop/SpriteLoop'
import { HeadDebugPanel } from './HeadDebugPanel'
import type { HeadValues } from './HeadDebugPanel'
import headImage from '../../../assets/images/stats/head/1.png'
import legsFrame1 from '../../../assets/images/stats/body/1.png'
import legsFrame2 from '../../../assets/images/stats/body/2.png'
import legsFrame3 from '../../../assets/images/stats/body/3.png'
import legsFrame4 from '../../../assets/images/stats/body/4.png'
import legsFrame5 from '../../../assets/images/stats/body/5.png'
import legsFrame6 from '../../../assets/images/stats/body/6.png'
import legsFrame7 from '../../../assets/images/stats/body/7.png'
import legsFrame8 from '../../../assets/images/stats/body/8.png'
import gunIcon from '../../../assets/images/stats/gun.png'
import shieldIcon from '../../../assets/images/stats/shield.png'
import radiationIcon from '../../../assets/images/stats/radiation.png'
import helmetIcon from '../../../assets/images/stats/helmet.png'
import './StatusView.css'

const LEGS_FRAMES = [
  legsFrame1,
  legsFrame2,
  legsFrame3,
  legsFrame4,
  legsFrame5,
  legsFrame6,
  legsFrame7,
  legsFrame8,
]

interface ConditionItem {
  icon: string
  label: string
  value: string
}

const CONDITIONS: readonly ConditionItem[] = [
  { icon: gunIcon, label: 'Arma', value: '86/100' },
  { icon: shieldIcon, label: 'Armadura', value: '54/100' },
  { icon: radiationIcon, label: 'Resist. RAD', value: '25' },
  { icon: helmetIcon, label: 'Casco', value: '—' },
]

const HEAD_DEBUG_ENABLED =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('debug') === '1'

// Defaults: the anchoring is done in StatusView.css by putting the head's face
// centroid (x~17.64 of the 38px head canvas) on the torso centerline (x~38 of
// the 75px body canvas, measured across all 8 walk frames) and by placing the
// chin (head row 43) on body row ~7, i.e. on the shoulder line, with the neck
// tip hidden inside the torso. Starting offsets are 0/0; scale 0.8 shrinks the
// 38px face to ~30.4px, proportional to the ~38.6px mean shoulder width. The
// debug panel (?debug=1) still slides x/y/scale over that base in real time.
const HEAD_DEFAULTS: HeadValues = { x: 0, y: 0, scale: 0.8 }

export function StatusView() {
  const [head, setHead] = useState<HeadValues>(HEAD_DEFAULTS)

  const characterStyle = {
    '--status-head-offset-x': `${head.x}px`,
    '--status-head-offset-y': `${head.y}px`,
    '--status-head-scale': String(head.scale),
  } as CSSProperties

  return (
    <div className="status">
      {HEAD_DEBUG_ENABLED && <HeadDebugPanel values={head} onChange={setHead} />}
      <div className="status__character" style={characterStyle}>
        <SpriteLoop
          className="status-layer status-layer--legs"
          frames={LEGS_FRAMES}
        />
        <img
          className="status-layer status-layer--head"
          src={headImage}
          alt=""
        />
        <span className="status-mark status-mark--head">— CABEZA</span>
        <span className="status-mark status-mark--arms">— BRAZOS</span>
        <span className="status-mark status-mark--torso">— TORSO</span>
        <span className="status-mark status-mark--legs">— PIERNAS</span>
      </div>
      <div className="status__conditions">
        {CONDITIONS.map((condition) => (
          <div key={condition.label} className="status-condition">
            <img
              className="status-condition__icon"
              src={condition.icon}
              alt=""
            />
            <span className="status-condition__label">{condition.label}</span>
            <span className="status-condition__value">{condition.value}</span>
          </div>
        ))}
      </div>
      <p className="status__name">Vault Dweller</p>
    </div>
  )
}