/**
 * Drawer — a pattern under Motion / Overlays.
 *
 * Read from the Motion system file, node 1:4281, with the trigger rule on the
 * frame and the confirmation sticky beside it:
 *
 *   Total duration   400ms
 *   Easing           0.9, 0, 0.1, 1
 *   Drawer X         -370 to 0, and 370 is its width
 *   Screen behind    X 0 to -40, a parallax rather than a push
 *   Scrim            #000000, opacity 0 to 50%
 *   Open trigger     The top-bar control only. Edge swipe is disabled.
 *
 * The disabled edge swipe is the same decision as the flow sheet's disabled
 * drag: a gesture that collides with the system back gesture and with the tab
 * swipe region is worse than no gesture at all.
 */

import { useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import { PhoneMock, StatusBar, AndroidNavBar } from '../flows/PhoneMockShared'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note } from './docs'

// ─── Values, from node 1:4281 ────────────────────────────────────────────────

const DRAWER_MS    = 400
const DRAWER_EASE  = 'cubic-bezier(0.9, 0, 0.1, 1)'
const DRAWER_W     = 370
const PARALLAX     = 40
const SCRIM_COLOR  = '#000000'
const SCRIM_MAX    = 0.5

const PHONE_SCALE = 0.46

const CSS = `
  .dr-panel, .dr-screen, .dr-scrim { transition-duration: ${DRAWER_MS}ms; transition-timing-function: ${DRAWER_EASE}; }
  .dr-panel, .dr-screen { transition-property: transform; }
  .dr-scrim { transition-property: opacity; }
  @media (prefers-reduced-motion: reduce) {
    .dr-panel, .dr-screen, .dr-scrim { transition-duration: 1ms; }
    .dr-screen { transform: none !important; }
  }
`

const MENU = ['Account', 'Cards', 'Statements', 'Help', 'Settings']

// ─── Demo ─────────────────────────────────────────────────────────────────────

function DrawerDemo() {
  const [open, setOpen] = useState(false)

  return (
    <DemoCard label="Opening the drawer" stageStyle={{ padding: '28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <PhoneMock scale={PHONE_SCALE}>
          <StatusBar />
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--canvas-default)' }}>
            {/* The screen behind parallaxes; it is not pushed aside. */}
            <div
              className="dr-screen"
              style={{ position: 'absolute', inset: 0, transform: open ? `translateX(-${PARALLAX}px)` : 'none' }}
            >
              <div style={{
                height: 44, display: 'flex', alignItems: 'center', gap: 'var(--space-300)',
                padding: '0 var(--space-400)', backgroundColor: 'var(--bg-secondary)',
                fontFamily: 'var(--ds-font-family)',
              }}>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="Open menu"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
                >
                  <BilleaseIcon name="burger-menu" size="md" color="var(--icon-on-dark)" />
                </button>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-on-dark)' }}>Welcome</span>
              </div>
              <div style={{ padding: 'var(--space-500)', fontFamily: 'var(--ds-font-family)', color: 'var(--text-subtle)', fontSize: 'var(--text-md)' }}>
                The top-bar control is the only way in. An edge swipe does nothing.
              </div>
            </div>

            <div
              className="dr-scrim"
              style={{
                position: 'absolute', inset: 0, backgroundColor: SCRIM_COLOR,
                opacity: open ? SCRIM_MAX : 0, pointerEvents: open ? 'auto' : 'none',
              }}
              onClick={() => setOpen(false)}
            />

            <div
              className="dr-panel"
              style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, width: DRAWER_W,
                transform: open ? 'none' : `translateX(-${DRAWER_W}px)`,
                backgroundColor: 'var(--bg-base)',
                display: 'flex', flexDirection: 'column', gap: 'var(--space-300)',
                padding: 'var(--space-400)', boxSizing: 'border-box',
                fontFamily: 'var(--ds-font-family)',
                boxShadow: '4px 0 24px rgba(0, 0, 0, 0.16)',
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignSelf: 'flex-start' }}
              >
                <BilleaseIcon name="close" size="md" color="var(--icon-base)" />
              </button>
              {MENU.map(item => (
                <span key={item} style={{ fontSize: 'var(--text-lg)', color: 'var(--text-base)', padding: 'var(--space-200) 0' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <AndroidNavBar />
        </PhoneMock>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '48ch' }}>
          The drawer comes in from the left as the screen behind drifts {PARALLAX}px the
          same way. Only the top-bar control opens it.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'Holding navigation that is needed occasionally rather than constantly',
  'The destinations do not belong in the bottom bar',
  'The screen behind is being left for a moment, not replaced',
]

const AVOID_WHEN = [
  'The destinations are the app’s main ones, which belong in the bottom navigation',
  'A choice has to be made before continuing, which is a dialog',
  'The content is about the screen behind it, which is a sheet',
]

const BEHAVIOR_RULES = [
  ['It comes in from the left edge',
   `The panel travels its own width, ${DRAWER_W}px, from off the left edge to nothing, over ${DRAWER_MS}ms.`],
  ['The screen behind parallaxes, it is not pushed',
   `It drifts ${PARALLAX}px in the same direction, a tenth of the drawer's travel. Moving it the full distance would make this a screen transition; moving it not at all would leave the drawer looking pasted on.`],
  ['The top-bar control is the only way in',
   'Edge swipe to open is disabled on both platforms, deliberately: it collides with the system back gesture and with the tab swipe region, and a gesture that sometimes does the wrong thing is worse than one that does not exist.'],
  ['The scrim says the rest is unavailable',
   `${SCRIM_COLOR} to ${SCRIM_MAX * 100}%, arriving with the panel.`],
  ['Closing is the opening reversed',
   'The panel returns to the left, the screen behind comes back to its place and the scrim clears, on the same duration and curve.'],
]

const SPEC_ROWS = [
  ['Total duration',  `${DRAWER_MS}ms`],
  ['Easing',          DRAWER_EASE],
  ['Drawer X',        `-${DRAWER_W} to 0`],
  ['Drawer width',    `${DRAWER_W}`],
  ['Screen behind',   `X 0 to -${PARALLAX}`],
  ['Scrim',           `${SCRIM_COLOR}, opacity 0 to ${SCRIM_MAX * 100}%`],
  ['Open trigger',    'The top-bar control only. Edge swipe to open is disabled on both platforms.'],
  ['Reduced motion',  'No travel and no parallax. The drawer and the scrim change state in place.'],
  ['Source',          'Motion system, node 1:4281, with the trigger rule and confirmation sticky on that frame'],
]

const STATE_ROWS = [
  ['Closed',   'No panel, no scrim. The screen behind is at rest.'],
  ['Opening',  `The panel crosses its ${DRAWER_W}px as the screen drifts ${PARALLAX}px and the scrim reaches ${SCRIM_MAX * 100}%.`],
  ['Open',     'The panel is in place over a dimmed, slightly shifted screen.'],
  ['Edge swipe', 'Nothing. The gesture is not a trigger here.'],
  ['Closing',  'All three return together on the same duration and curve.'],
]

const ACCESSIBILITY_RULES = [
  ['The screen behind is not reachable',
   'While the drawer is open, what is under the scrim is out of the tab order.'],
  ['Opening is a control, not a gesture',
   'Since edge swipe is disabled, the top-bar control is the only route in and must always be present and labelled.'],
  ['Focus moves in and comes back',
   'Focus enters the drawer when it opens and returns to the control that opened it when it closes.'],
]

const ENGINEERING_ROWS = [
  ['Turn the platform edge gesture off',
   'Both platforms offer edge-swipe-to-open on a drawer. It has to be disabled rather than left to compete with the back gesture and the tab swipe region.'],
  ['Parallax the screen, do not translate the layout',
   'Move the screen behind with a transform so nothing reflows. Changing its position or width relays out the whole screen on every frame.'],
  ['One state, three animations',
   'The panel, the parallax and the scrim are driven by the same open state on the same duration and curve, or they arrive at different moments.'],
  ['370 is the width, not a coincidence',
   'The travel and the width are the same number because the panel starts exactly its own width off screen. Bind them, so a wider drawer still starts fully off screen.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DrawerDocs() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <DrawerDemo />
      </DocSection>

      <DocSection id="usage" title="When to use">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <UsageList label="Use when" items={USE_WHEN} tone="use" />
          <UsageList label="Do not use when" items={AVOID_WHEN} tone="avoid" />
        </div>
      </DocSection>

      <DocSection id="behavior" title="Behavior">
        <RuleTable rows={BEHAVIOR_RULES} labelWidth={260} />
      </DocSection>

      <DocSection id="spec" title="Motion spec">
        <P>Read from the Motion system file.</P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="Not settled in the file.">
            The file specifies how the drawer opens and says nothing about how it
            closes. The demo closes on the scrim and on a control inside the
            panel, which is the platform convention, but neither is documented
            behaviour yet.
          </Note>
        </div>
      </DocSection>

      <DocSection id="states" title="States">
        <RuleTable rows={STATE_ROWS} labelWidth={200} />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <RuleTable rows={ACCESSIBILITY_RULES} labelWidth={260} />
      </DocSection>

      <DocSection id="engineering" title="Engineering reference">
        <P>
          The values the spec table leaves out, and the places this is most
          likely to be built wrong.
        </P>
        <RuleTable rows={ENGINEERING_ROWS} labelWidth={240} />
      </DocSection>
    </>
  )
}
