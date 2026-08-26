/**
 * Card screen icons that the design system set does not carry, taken verbatim
 * from Financial Core rather than redrawn.
 *
 * lock: the set's own `lock` is a padlock with three dots in the body. The card
 * screens use a padlock with a single keyhole bar, which is a different glyph.
 * Inlined with currentColor so it can be tinted, unlike the exported file.
 *
 *   Missing icon: lock (keyhole variant)
 *   Missing icon: manage
 */

export function LockGlyph({ size = 20, color = 'currentColor' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <path d="M10 0C13.4678 0 16.2791 2.81123 16.2791 6.27907V7.49091C16.49 7.50572 16.6889 7.52482 16.8759 7.54996C17.7132 7.66254 18.4181 7.90392 18.978 8.46384C19.5379 9.02377 19.7793 9.72864 19.8919 10.566C20.0018 11.3832 20 12.4252 20 13.7209C20 15.0167 20.0018 16.0587 19.8919 16.8759C19.7793 17.7132 19.5379 18.4181 18.978 18.978C18.4181 19.5379 17.7132 19.7793 16.8759 19.8919C16.0587 20.0017 15.0167 20 13.7209 20H6.27907C4.98334 20 3.94131 20.0017 3.12409 19.8919C2.28679 19.7793 1.5819 19.5379 1.02199 18.978C0.462071 18.4181 0.220678 17.7132 0.108105 16.8759C-0.00174965 16.0587 1.67293e-06 15.0167 1.67293e-06 13.7209C1.67133e-06 12.4252 -0.0017499 11.3832 0.108105 10.566C0.220679 9.72864 0.46207 9.02377 1.02199 8.46384C1.5819 7.90392 2.28679 7.66254 3.12409 7.54996C3.31114 7.52482 3.50998 7.50572 3.72093 7.49091V6.27907C3.72093 2.81123 6.53217 9.58923e-07 10 0ZM6.27907 8.83721C4.94405 8.83721 4.01293 8.83908 3.31032 8.9335C2.62775 9.02527 2.266 9.19294 2.00854 9.4504C1.75108 9.70786 1.58341 10.0696 1.49164 10.7522C1.39722 11.4548 1.39535 12.3859 1.39535 13.7209C1.39535 15.056 1.39722 15.9871 1.49164 16.6897C1.58341 17.3723 1.75108 17.734 2.00854 17.9915C2.266 18.2489 2.62775 18.4166 3.31032 18.5084C4.01293 18.6028 4.94405 18.6046 6.27907 18.6046H13.7209C15.056 18.6046 15.9871 18.6028 16.6897 18.5084C17.3723 18.4166 17.734 18.2489 17.9915 17.9915C18.2489 17.734 18.4166 17.3722 18.5084 16.6897C18.6028 15.9871 18.6046 15.056 18.6046 13.7209C18.6046 12.3859 18.6028 11.4548 18.5084 10.7522C18.4166 10.0696 18.2489 9.70786 17.9915 9.4504C17.734 9.19293 17.3723 9.02527 16.6897 8.9335C15.9871 8.83908 15.056 8.83721 13.7209 8.83721H6.27907ZM10 11.1628C10.3853 11.1628 10.6977 11.4751 10.6977 11.8605V15.5814C10.6977 15.9667 10.3853 16.2791 10 16.2791C9.61469 16.2791 9.30233 15.9667 9.30233 15.5814V11.8605C9.30233 11.4751 9.61469 11.1628 10 11.1628ZM10 1.39535C7.3028 1.39535 5.11628 3.58186 5.11628 6.27907V7.4464C5.47872 7.44308 5.866 7.44186 6.27907 7.44186H13.7209C14.134 7.44186 14.5213 7.44309 14.8837 7.4464V6.27907C14.8837 3.58186 12.6972 1.39535 10 1.39535Z" fill={color} />
    </svg>
  )
}

/**
 * The card menu's padlock pair, closed and open, from the lock and unlock
 * handoff. Stroke-based and matched to each other, so the two states share a
 * weight and a keyhole. `shackleClass` marks the shackle path so it can snap
 * shut independently of the body.
 */
export function PadlockClosed({ size = 20, shackleClass, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      /* The shackle snap lifts the arch above y=0. Without this the viewport
         clips it flat, and the 250ms delay holds it there before it moves. */
      style={{ display: 'block', overflow: 'visible' }}
    >
      <path d="M2 16c0 -2.8284 0 -4.2426 0.87868 -5.1213C3.75736 10 5.17157 10 8 10h8c2.8284 0 4.2426 0 5.1213 0.8787C22 11.7574 22 13.1716 22 16s0 4.2426 -0.8787 5.1213C20.2426 22 18.8284 22 16 22H8c-2.82843 0 -4.24264 0 -5.12132 -0.8787C2 20.2426 2 18.8284 2 16Z" />
      <path d="M12 14v4" strokeLinecap="round" />
      <path className={shackleClass} d="M6 10V8c0 -3.31371 2.68629 -6 6 -6 3.3137 0 6 2.68629 6 6v2" strokeLinecap="round" />
    </svg>
  )
}

export function PadlockOpen({ size = 20, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <path d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z" />
      <path d="M6 10V8C6 4.68629 8.68629 2 12 2C13.777 2 15.3736 2.7725 16.4722 4" strokeLinecap="round" />
      <path d="M12 14V18" strokeLinecap="round" />
    </svg>
  )
}

/**
 * The locked treatment. The card blurs behind a light veil and keeps its own
 * colour, so the lock and label take that card's on-surface tokens. A dark
 * scrim is deliberately not used: it would force white on every face, and the
 * light virtual face needs icon/base and text/base.
 */
const SURFACES = {
  dark:  { icon: 'var(--icon-on-dark)', text: 'var(--text-on-dark)', veil: 'rgba(0,0,0,0.10)' },
  light: { icon: 'var(--icon-base)',    text: 'var(--text-base)',    veil: 'rgba(255,255,255,0.10)' },
}

export function LockedFace({ surface = 'dark' }) {
  const tone = SURFACES[surface] ?? SURFACES.dark
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 'var(--radius-lg)',
      backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      backgroundColor: tone.veil,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 'var(--space-200)', fontFamily: 'var(--ds-font-family)',
    }}>
      <LockGlyph size={24} color={tone.icon} />
      <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: tone.text }}>Card locked</span>
    </div>
  )
}

/**
 * LockToggleGlyph — the menu icon swapping between the two padlocks.
 *
 * Which glyph shows follows the design: the icon names the action, not the
 * state. An unlocked card offers Lock and shows the closed padlock; a locked
 * card offers Unlock and shows the open one.
 *
 * The swap is deliberately asymmetric. The leaving glyph snaps away, the
 * arriving one waits 80ms then springs in.
 */
const TOGGLE_CSS = `
  .be-lock-toggle { position: relative; display: inline-block; }
  .be-lock-toggle > svg { position: absolute; top: 0; left: 0; transform-origin: 50% 65%; }
  .be-lock-toggle .be-lock-closed {
    opacity: 1; transform: none;
    transition: opacity 110ms linear 80ms, transform 260ms cubic-bezier(0.34, 1.4, 0.64, 1) 80ms;
  }
  .be-lock-toggle .be-lock-open {
    opacity: 0; transform: rotate(10deg) scale(0.78);
    transition: opacity 90ms linear, transform 140ms cubic-bezier(0.3, 0, 0.8, 0.15);
  }
  .be-lock-toggle.is-locked .be-lock-closed {
    opacity: 0; transform: rotate(-10deg) scale(0.78);
    transition: opacity 90ms linear, transform 140ms cubic-bezier(0.3, 0, 0.8, 0.15);
  }
  .be-lock-toggle.is-locked .be-lock-open {
    opacity: 1; transform: none;
    transition: opacity 110ms linear 80ms, transform 260ms cubic-bezier(0.34, 1.4, 0.64, 1) 80ms;
  }
  @media (prefers-reduced-motion: reduce) {
    .be-lock-toggle > svg { transition-duration: 1ms !important; transition-delay: 0s !important; }
  }
`

export function LockToggleGlyph({ locked, size = 20 }) {
  return (
    <span
      className={`be-lock-toggle${locked ? ' is-locked' : ''}`}
      style={{ width: size, height: size }}
    >
      <style>{TOGGLE_CSS}</style>
      <PadlockClosed size={size} className="be-lock-closed" />
      <PadlockOpen size={size} className="be-lock-open" />
    </span>
  )
}
