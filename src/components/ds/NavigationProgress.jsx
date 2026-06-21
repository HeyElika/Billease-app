/**
 * NavigationProgress — Billease Design System
 * Source: Figma node 8728:4918, file qESeTFW1GEEosrYnm4Hu3b
 *
 * A horizontal progress bar used inside navigation/header w/progress variant.
 * Shows where the user is in a multi-step flow.
 *
 * Props:
 *   state  — 'start' | 'mid' | 'end'  (default: 'start')
 */

const TRACK_W = 90
const TRACK_H = 4
const RADIUS = 100

export default function NavigationProgress({ state = 'start' }) {
  const isEnd = state === 'end'

  return (
    <div style={{
      width: TRACK_W,
      height: TRACK_H,
      borderRadius: RADIUS,
      backgroundColor: isEnd ? 'var(--bg-secondary)' : 'var(--bg-sunken)',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {!isEnd && (
        <div style={{
          width: state === 'mid' ? 60 : 30,
          height: TRACK_H,
          borderRadius: RADIUS,
          backgroundColor: 'var(--bg-secondary)',
        }} />
      )}
    </div>
  )
}
