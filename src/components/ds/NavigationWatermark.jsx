/**
 * NavigationWatermark — Billease Design System
 * Source: Figma node 16:1698, file qESeTFW1GEEosrYnm4Hu3b
 *
 * Row of 10 colored 4px dots positioned at the very top of navigation headers.
 * Used as a visual DS indicator — present in all navigation/header variants by default.
 *
 * Props: none (self-contained, purely decorative)
 */

const COLORS = ['yellow', 'pink', 'green', 'black', '#f0f', '#8b4513', 'purple', 'orange', 'red', '#0ff']

export default function NavigationWatermark() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 20,
      width: 320,
      height: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 2,
      pointerEvents: 'none',
    }}>
      {COLORS.map((color, i) => (
        <div
          key={i}
          style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }}
        />
      ))}
    </div>
  )
}
