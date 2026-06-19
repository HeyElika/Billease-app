import BilleaseIcon from '../../assets/icons/BilleaseIcon'

/**
 * NavHeader — Billease Design System
 * Source: Figma node 50:3459, file qESeTFW1GEEosrYnm4Hu3b
 *
 * Variants (type prop):
 *   icon-left         ← (default) back arrow + title + empty right slot
 *   title-only        centered title only
 *   icon-left-right   back arrow + title + close icon  ⚠ close icon missing from library
 *   logo-only         back arrow + Billease logo        ⚠ logo asset not in icon library
 *   icon-right        empty left + title + close icon   ⚠ close icon missing from library
 *   help              back arrow + title + "Help" link
 *   w/progress        progress bar + close icon         ⚠ close icon missing from library
 *   w/subtitle        back arrow + title + subtitle
 *
 * ⚠ MISSING: A close/X icon is not in the Billease icon library.
 *   Variants that require it (icon-left-right, icon-right, w/progress) render a
 *   MissingIcon placeholder until the icon is added.
 */

// ─── Specs from Figma ────────────────────────────────────────────────────────
// height: 44px  |  content area: left=20px, width=320px, height=40px, gap=8px
// title: var(--text-base), var(--text-xl)=20px, weight 600, lineHeight 1.25
// icon slot: 24×24  |  icon inside: size sm (20px), padded 2px

const CONTAINER = {
  position: 'relative',
  height: 44,
  width: '100%',
  backgroundColor: 'var(--bg-base)',
  flexShrink: 0,
}

const CONTENT_ROW = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: 20,
  width: 320,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

const ICON_SLOT = {
  width: 24,
  height: 24,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const TITLE_SLOT = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 0,
}

const TITLE_TEXT = {
  fontFamily: 'var(--ds-font-family)',
  fontSize: 'var(--text-xl)',       // 20px — typography/size/xl
  fontWeight: 600,                   // typography/weight/semibold
  lineHeight: 1.25,
  color: 'var(--text-base)',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
}

const SUBTITLE_TEXT = {
  fontFamily: 'var(--ds-font-family)',
  fontSize: 'var(--text-sm)',        // 13px — typography/size/sm
  fontWeight: 400,
  lineHeight: 1.5,
  color: 'var(--text-subtle)',
  textAlign: 'center',
}

function IconSlot({ children }) {
  return <div style={ICON_SLOT}>{children}</div>
}

function EmptySlot() {
  return <div style={{ ...ICON_SLOT, opacity: 0 }} />
}

// Placeholder shown for icons not yet in the library
function MissingIcon() {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: 4,
      backgroundColor: 'var(--bg-error-subtle)',
      border: '1px solid var(--border-error)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, color: 'var(--text-error)', fontWeight: 700,
    }}>
      ?
    </div>
  )
}

// ─── NavHeader ────────────────────────────────────────────────────────────────

export default function NavHeader({
  type = 'icon-left',          // see variants above
  title = '',
  subtitle = '',               // used by w/subtitle
  showBorder = false,
  onBack,
  onClose,
}) {
  const borderStyle = showBorder
    ? { borderBottom: '1px solid var(--border-subtle)' }
    : {}

  const BackIcon = (
    <IconSlot>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', padding: 0, cursor: onBack ? 'pointer' : 'default', display: 'flex' }}
      >
        <BilleaseIcon name="arrow-left" size="sm" color="var(--text-base)" />
      </button>
    </IconSlot>
  )

  // ⚠ Close icon not in library — renders a missing-icon badge
  const CloseIcon = (
    <IconSlot>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', padding: 0, cursor: onClose ? 'pointer' : 'default', display: 'flex' }}
      >
        <MissingIcon />
      </button>
    </IconSlot>
  )

  const Title = (
    <div style={TITLE_SLOT}>
      <span style={TITLE_TEXT}>{title}</span>
    </div>
  )

  let content

  if (type === 'title-only') {
    content = <>{Title}</>
  } else if (type === 'icon-left-right') {
    content = <>{BackIcon}{Title}{CloseIcon}</>
  } else if (type === 'icon-right') {
    content = <>{EmptySlot()}{Title}{CloseIcon}</>
  } else if (type === 'help') {
    content = (
      <>
        {BackIcon}
        {Title}
        <div style={{ ...ICON_SLOT, width: 'auto' }}>
          <button style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: 'var(--ds-font-family)', fontSize: 'var(--text-md)', fontWeight: 600,
            color: 'var(--text-base)', lineHeight: 1.5, textDecoration: 'underline',
          }}>
            Help
          </button>
        </div>
      </>
    )
  } else if (type === 'w/progress') {
    // progress bar: outer 90px, inner 30px (1/3 = start)
    content = (
      <>
        <EmptySlot />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 90, height: 4, backgroundColor: 'var(--bg-sunken)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ width: 30, height: 4, backgroundColor: 'var(--bg-secondary)', borderRadius: 100 }} />
          </div>
        </div>
        {CloseIcon}
      </>
    )
  } else if (type === 'w/subtitle') {
    content = (
      <>
        {BackIcon}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
          <span style={{ ...TITLE_TEXT, fontSize: 'var(--text-lg)', lineHeight: 1.25 }}>{title}</span>
          <span style={SUBTITLE_TEXT}>{subtitle}</span>
        </div>
        <EmptySlot />
      </>
    )
  } else if (type === 'logo-only') {
    // ⚠ Billease logo asset not in icon library — render brand text fallback
    content = (
      <>
        {BackIcon}
        <div style={{ ...TITLE_SLOT }}>
          <span style={{ fontFamily: 'var(--ds-font-family)', fontSize: 18, fontWeight: 700, color: 'var(--text-base)' }}>
            bill<span style={{ color: 'var(--bg-primary)' }}>ease</span>
          </span>
        </div>
        <EmptySlot />
      </>
    )
  } else {
    // icon-left (default)
    content = <>{BackIcon}{Title}<EmptySlot /></>
  }

  return (
    <div style={{ ...CONTAINER, ...borderStyle }}>
      <div style={CONTENT_ROW}>
        {content}
      </div>
    </div>
  )
}
