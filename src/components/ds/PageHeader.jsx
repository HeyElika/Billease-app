/**
 * PageHeader — Billease Design System
 * Source: Figma node 38:1728, file qESeTFW1GEEosrYnm4Hu3b
 *
 * The inner content row inside navigation/header. Composes a left 24px icon slot,
 * a flex-1 center area, and a right 24px icon slot.
 *
 * Used by NavHeader — each variant passes different content into the slots.
 *
 * Props:
 *   leftSlot   — React element for the left 24×24 icon slot (or null for empty)
 *   children   — center content (title, logo, progress bar, etc.)
 *   rightSlot  — React element for the right 24×24 icon slot (or null for empty)
 *   gap        — gap between the three slots in px (default 8; title-only uses 0)
 */

const ICON_SLOT = {
  width: 24,
  height: 24,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export function IconSlot({ children }) {
  return <div style={ICON_SLOT}>{children}</div>
}

export function EmptySlot() {
  return <div style={ICON_SLOT} />
}

export default function PageHeader({ leftSlot, children, rightSlot, gap = 8 }) {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      left: 20,
      width: 320,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      gap,
    }}>
      <div style={ICON_SLOT}>{leftSlot ?? null}</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
        {children}
      </div>
      <div style={ICON_SLOT}>{rightSlot ?? null}</div>
    </div>
  )
}
