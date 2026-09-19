/**
 * SliderDots — Billease Design System
 * Source: Figma node 190:3413 (slider-dots), file qESeTFW1GEEosrYnm4Hu3b
 * Variants: mode=on-dark|on-light × size=md|sm × state=active|inactive
 *
 * Figma specs:
 *   md                   8x8, sm 6x6, radius-full
 *   on-dark   active     bg/base (white)          inactive alpha-white 20%
 *   on-light  active     bg/secondary #265ce5     inactive bg/selected #bfd1ff
 */

const SIZES = { md: 8, sm: 6 }

const FILLS = {
  'on-dark':  { active: 'var(--bg-base)',      inactive: 'var(--alpha-white-20)' },
  'on-light': { active: 'var(--bg-secondary)', inactive: 'var(--bg-selected)'    },
}

export function SliderDot({ mode = 'on-dark', size = 'md', state = 'inactive' }) {
  const box = SIZES[size] ?? SIZES.md
  const fill = FILLS[mode] ?? FILLS['on-dark']

  return (
    <div style={{
      width: box,
      height: box,
      borderRadius: 'var(--radius-full)',
      overflow: 'hidden',
      flexShrink: 0,
      backgroundColor: state === 'active' ? fill.active : fill.inactive,
    }} />
  )
}

/** The dot row as used under a carousel. */
export default function SliderDots({ mode = 'on-dark', size = 'md', count = 4, activeIndex = 0 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
      {Array.from({ length: count }, (_, i) => (
        <SliderDot key={i} mode={mode} size={size} state={i === activeIndex ? 'active' : 'inactive'} />
      ))}
    </div>
  )
}
