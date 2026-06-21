import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import NavigationWatermark from './NavigationWatermark'
import NavigationProgress from './NavigationProgress'

/**
 * NavHeader — Billease Design System
 * Source: Figma node 50:3459, file qESeTFW1GEEosrYnm4Hu3b
 *
 * Variants (type prop):
 *   icon-left         ← (default) back arrow + title + empty right slot
 *   title-only        centered title only, no side icons, gap 0
 *   icon-left-right   back arrow + title + close icon
 *   logo-only         back arrow + Billease logo
 *   icon-right        empty left + title + close icon
 *   help              back arrow + title + "Help" link
 *   w/progress        progress bar + close icon
 *   w/subtitle        back arrow + title + subtitle (outer is button)
 *
 * Props:
 *   type          — variant name (see above)
 *   title         — header title text
 *   subtitle      — subtitle line (w/subtitle only)
 *   showBorder    — show 1px border-bottom (default false)
 *   showWatermark — show colored dot watermark at top (default true, per Figma)
 *   showTitle     — show/hide title text (default true)
 *   progress      — NavigationProgress state: 'start' | 'mid' | 'end' (w/progress variant)
 *   onBack        — callback for back arrow press
 *   onClose       — callback for close icon press
 *   onHelp        — callback for Help link press
 */

// ─── Specs from Figma ────────────────────────────────────────────────────────
// height: 44px  |  content row: left=20px, width=320px, height=40px
// gap=8px (all variants except title-only which uses gap=0)
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
  width: 256,                        // matches Figma w-[256px] for title text
}

const SUBTITLE_TEXT = {
  fontFamily: 'var(--ds-font-family)',
  fontSize: 'var(--text-sm)',        // 13px — typography/size/sm
  fontWeight: 400,
  lineHeight: 1.5,
  color: 'var(--text-base)',
  textAlign: 'center',
  width: 256,
}

function IconSlot({ children }) {
  return <div style={ICON_SLOT}>{children}</div>
}

function EmptySlot() {
  return <div style={ICON_SLOT} />
}

function BackButton({ onBack }) {
  return (
    <IconSlot>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', padding: 0, cursor: onBack ? 'pointer' : 'default', display: 'flex' }}
      >
        <BilleaseIcon name="arrow-left" size="sm" color="var(--text-base)" />
      </button>
    </IconSlot>
  )
}

function CloseButton({ onClose }) {
  return (
    <IconSlot>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', padding: 0, cursor: onClose ? 'pointer' : 'default', display: 'flex' }}
      >
        <BilleaseIcon name="close-mini" size="sm" color="var(--text-base)" />
      </button>
    </IconSlot>
  )
}


// ─── NavHeader ────────────────────────────────────────────────────────────────

export default function NavHeader({
  type = 'icon-left',
  title = '',
  subtitle = '',
  showBorder = false,
  showWatermark = true,
  showTitle = true,
  progress = 'start',
  onBack,
  onClose,
  onHelp,
}) {
  const borderStyle = showBorder
    ? { borderBottom: '1px solid var(--border-subtle)' }
    : {}

  const TitleEl = showTitle ? (
    <div style={TITLE_SLOT}>
      <span style={TITLE_TEXT}>{title}</span>
    </div>
  ) : (
    <div style={TITLE_SLOT} />
  )

  let content
  let contentGap = 8

  if (type === 'title-only') {
    contentGap = 0
    content = <>{TitleEl}</>
  } else if (type === 'icon-left-right') {
    content = <><BackButton onBack={onBack} />{TitleEl}<CloseButton onClose={onClose} /></>
  } else if (type === 'icon-right') {
    content = <><EmptySlot />{TitleEl}<CloseButton onClose={onClose} /></>
  } else if (type === 'help') {
    content = (
      <>
        <BackButton onBack={onBack} />
        {TitleEl}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <button
            onClick={onHelp}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontFamily: 'var(--ds-font-family)', fontSize: 14, fontWeight: 600,
              color: 'var(--text-base)', lineHeight: 1.5,
              textDecoration: 'underline', textDecorationSkipInk: 'none',
            }}
          >
            Help
          </button>
        </div>
      </>
    )
  } else if (type === 'w/progress') {
    content = (
      <>
        <EmptySlot />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <NavigationProgress state={progress} />
        </div>
        <CloseButton onClose={onClose} />
      </>
    )
  } else if (type === 'w/subtitle') {
    // outer is <button> in Figma (tappable row)
    return (
      <button
        onClick={onBack}
        style={{ ...CONTAINER, ...borderStyle, cursor: onBack ? 'pointer' : 'default', display: 'block', textAlign: 'left' }}
      >
        {showWatermark && <NavigationWatermark />}
        <div style={{ ...CONTENT_ROW, gap: 8 }}>
          <BackButton onBack={undefined} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
            {showTitle && (
              <span style={{ ...TITLE_TEXT, fontSize: 'var(--text-lg)', lineHeight: 1.25 }}>{title}</span>
            )}
            <span style={SUBTITLE_TEXT}>{subtitle}</span>
          </div>
          <EmptySlot />
        </div>
      </button>
    )
  } else if (type === 'logo-only') {
    // Billease logo — image assets not in icon library, render text fallback
    content = (
      <>
        <BackButton onBack={onBack} />
        <div style={TITLE_SLOT}>
          <span style={{ fontFamily: 'var(--ds-font-family)', fontSize: 18, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1 }}>
            bill<span style={{ color: 'var(--bg-primary)' }}>ease</span>
          </span>
        </div>
        <div style={{ ...ICON_SLOT, opacity: 0 }} />
      </>
    )
  } else {
    // icon-left (default)
    content = <><BackButton onBack={onBack} />{TitleEl}<EmptySlot /></>
  }

  return (
    <div style={{ ...CONTAINER, ...borderStyle }}>
      {showWatermark && <NavigationWatermark />}
      <div style={{ ...CONTENT_ROW, gap: contentGap }}>
        {content}
      </div>
    </div>
  )
}
