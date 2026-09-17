import './HeadDebugPanel.css'

export interface HeadValues {
  x: number
  y: number
  scale: number
}

export interface HeadDebugPanelProps {
  values: HeadValues
  onChange: (values: HeadValues) => void
}

export function HeadDebugPanel({ values, onChange }: HeadDebugPanelProps) {
  const update = (field: keyof HeadValues, next: number) => {
    onChange({ ...values, [field]: next })
  }

  return (
    <div className="head-debug" aria-label="Ajuste de cabeza (debug)">
      <div className="head-debug__title">HEAD ADJUST</div>
      <label className="head-debug__row">
        <span className="head-debug__name">X</span>
        <input
          className="head-debug__range"
          type="range"
          min={-50}
          max={50}
          step={1}
          value={values.x}
          onChange={(e) => update('x', Number(e.target.value))}
        />
        <span className="head-debug__value">{values.x}px</span>
      </label>
      <label className="head-debug__row">
        <span className="head-debug__name">Y</span>
        <input
          className="head-debug__range"
          type="range"
          min={-50}
          max={50}
          step={1}
          value={values.y}
          onChange={(e) => update('y', Number(e.target.value))}
        />
        <span className="head-debug__value">{values.y}px</span>
      </label>
      <label className="head-debug__row">
        <span className="head-debug__name">ESC</span>
        <input
          className="head-debug__range"
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={values.scale}
          onChange={(e) => update('scale', Number(e.target.value))}
        />
        <span className="head-debug__value">{values.scale.toFixed(2)}</span>
      </label>
    </div>
  )
}