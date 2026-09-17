import type { CSSProperties } from 'react'
import { useFrameSequence } from '../../../hooks/useFrameSequence'
import './StatusView.css'
import headImage from '../../../assets/images/stats/head/1.png'
import bodyFrame1 from '../../../assets/images/stats/body/1.png'
import bodyFrame2 from '../../../assets/images/stats/body/2.png'
import bodyFrame3 from '../../../assets/images/stats/body/3.png'
import bodyFrame4 from '../../../assets/images/stats/body/4.png'
import bodyFrame5 from '../../../assets/images/stats/body/5.png'
import bodyFrame6 from '../../../assets/images/stats/body/6.png'
import bodyFrame7 from '../../../assets/images/stats/body/7.png'
import bodyFrame8 from '../../../assets/images/stats/body/8.png'
import gunIcon from '../../../assets/images/stats/gun.png'
import shieldIcon from '../../../assets/images/stats/shield.png'
import radiationIcon from '../../../assets/images/stats/radiation.png'
import helmetIcon from '../../../assets/images/stats/helmet.png'

const BODY_FRAMES = [
  bodyFrame1,
  bodyFrame2,
  bodyFrame3,
  bodyFrame4,
  bodyFrame5,
  bodyFrame6,
  bodyFrame7,
  bodyFrame8,
]

/*
 * Head/body composition, derived from the real PNG alpha channels (threshold
 * 16), not tuned by eye.
 *
 * The figure is drawn in one native coordinate space: body/1..8 are 75x109 and
 * head/1 is 38x51 at the SAME scale (two crops of one artwork, so the head is
 * used at 1:1, never rescaled). Evidence: the neck's cut width matches on both
 * halves at 1:1 (head tip 7px == body stub ~7px at the socket); at any other
 * scale the cut widths disagree and the neck pinches.
 *
 * Anchors:
 *  - Head: the neck tip is the bottom-most painted row (y=50), centred at
 *    x=17.67. Head/1's canvas is 38px wide; positioning it by left/centroid
 *    instead of this neck point is what shifted the head per frame.
 *  - Body: the neck socket is the row where the shoulders start (first row with
 *    more than a few painted pixels), centred on the neck strip. The body
 *    canvas never moves; only the socket shifts a couple of pixels as the
 *    figures bob, so the head follows it.
 *
 * For every body frame the head is placed so its neck tip lands on that
 * frame's socket: headLeft = socket.x - neck.x,
 * headTop = overhang + socket.y - neck.y. The offset is stored per frame
 * (HEAD_FRAME_OFFSETS) and exposed to CSS as custom properties.
 */
const HEAD_CANVAS = { w: 38, h: 51 }
const BODY_CANVAS = { w: 75, h: 109 }
const HEAD_NECK = { x: 17.67, y: 50 }

// Measured neck socket (x = neck-strip centre, y = first shoulder row) for
// each body frame, in body-canvas pixels.
const BODY_NECK_SOCKETS: readonly { x: number; y: number }[] = [
  { x: 46.5, y: 3 }, // body/1
  { x: 46.5, y: 4 }, // body/2
  { x: 45.33, y: 5 }, // body/3
  { x: 46.26, y: 5 }, // body/4
  { x: 46.13, y: 4 }, // body/5
  { x: 46.0, y: 4 }, // body/6
  { x: 46.88, y: 4 }, // body/7
  { x: 47.0, y: 4 }, // body/8
]

// With the neck tip on the socket the head rises (neck.y - socket.y) px above
// the body top; reserve the highest socket (the smallest y) plus 1px margin.
const OVERHANG =
  HEAD_NECK.y - Math.min(...BODY_NECK_SOCKETS.map((s) => s.y)) + 1 // 48
const FIGURE = { w: BODY_CANVAS.w, h: OVERHANG + BODY_CANVAS.h } // 75x157

interface HeadOffset {
  x: number
  y: number
}

const HEAD_FRAME_OFFSETS: readonly HeadOffset[] = BODY_NECK_SOCKETS.map(
  (socket) => ({
    x: socket.x - HEAD_NECK.x,
    y: OVERHANG + socket.y - HEAD_NECK.y,
  }),
)

function headStyleFor(frame: number) {
  const offset = HEAD_FRAME_OFFSETS[frame] ?? HEAD_FRAME_OFFSETS[0]
  return {
    '--status-head-left': `${(offset.x / FIGURE.w) * 100}%`,
    '--status-head-top': `${(offset.y / FIGURE.h) * 100}%`,
    '--status-head-width': `${(HEAD_CANVAS.w / FIGURE.w) * 100}%`,
    '--status-head-height': `${(HEAD_CANVAS.h / FIGURE.h) * 100}%`,
  }
}

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

export function StatusView() {
  const bodyFrame = useFrameSequence(BODY_FRAMES.length, {
    intervalMs: 150,
    loop: true,
  })

  return (
    <div className="status">
      <div className="status__character">
        <img
          className="status-layer status-layer--body"
          src={BODY_FRAMES[bodyFrame]}
          alt=""
        />
        <img
          className="status-layer status-layer--head"
          src={headImage}
          alt=""
          style={headStyleFor(bodyFrame) as CSSProperties}
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
