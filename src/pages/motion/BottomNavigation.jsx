/**
 * Bottom navigation — a pattern under Motion / Navigation & transitions.
 *
 * Values from the Motion system file, node 1:4312.
 *
 * The file states the two colours as #909090 and #E72B10, which are near-misses
 * for this repo's --neutral-500 (#919191) and --icon-brand-primary (#E7161A).
 * The tokens are used here and the drift is recorded under Motion spec, rather
 * than hardcoding two values that belong to no token.
 */

import { useRef, useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import { DocSection, DocCard, P, DemoCard, RuleTable, UsageList, Note } from './docs'

// ─── Values ───────────────────────────────────────────────────────────────────

const DOWN_MS = 200          // 100% to 90%
const UP_MS   = 100          // 90% to 100%
const TOTAL   = DOWN_MS + UP_MS
const PRESSED = 0.9
const EASING  = 'cubic-bezier(0.9, 0, 0.1, 1)'

const BAR = { w: 360, h: 64, radius: 16 }

const TABS = [
  { id: 'home',   label: 'Home',         on: 'home-fill',        off: 'home-outline'        },
  { id: 'loans',  label: 'Loans',        on: 'installment-fill', off: 'installment-outline' },
  { id: 'qr',     label: 'Scan QR',      on: 'qr',               off: 'qr'                  },
  { id: 'tx',     label: 'Transactions', on: 'statement-fill',   off: 'statement-outline'   },
  { id: 'help',   label: 'Support',      on: 'chat-fill',        off: 'chat-outline'        },
]

const CSS = `
  .bn-item { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1;
             background: none; border: none; padding: 0; cursor: pointer; }
  /* Only the icon scales. The label and the bar hold still. */
  .bn-glyph { display: block; transform: scale(1); }
  .bn-item.is-down .bn-glyph { transform: scale(${PRESSED}); transition: transform ${DOWN_MS}ms ${EASING}; }
  .bn-item.is-up   .bn-glyph { transform: scale(1);          transition: transform ${UP_MS}ms ${EASING}; }
  /* Colour is never transitioned: it flips at the turn, deliberately. */
  @media (prefers-reduced-motion: reduce) {
    .bn-item.is-down .bn-glyph, .bn-item.is-up .bn-glyph { transition: none; transform: none; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function BottomNavDemo() {
  const [active, setActive] = useState('home')
  const [phase, setPhase] = useState(null)      // { id, stage }
  const timers = useRef([])

  const tap = (id) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase({ id, stage: 'is-down' })
    // The colour flips at the turn, not on the way down and not gradually.
    timers.current.push(setTimeout(() => {
      setActive(id)
      setPhase({ id, stage: 'is-up' })
    }, DOWN_MS))
    timers.current.push(setTimeout(() => setPhase(null), TOTAL))
  }

  return (
    <DemoCard label="Tap to icon">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <div style={{
          width: BAR.w, height: BAR.h, borderRadius: BAR.radius,
          backgroundColor: 'var(--bg-base)',
          boxShadow: '0px 9.555px 44.826px 0px rgba(6, 6, 6, 0.15)',
          display: 'flex', alignItems: 'center', padding: '0 8px', boxSizing: 'border-box',
          fontFamily: 'var(--ds-font-family)',
        }}>
          {TABS.map(tab => {
            const isActive = active === tab.id
            const stage = phase?.id === tab.id ? phase.stage : ''
            const colour = isActive ? 'var(--icon-brand-primary)' : 'var(--bg-strong)'
            return (
              <button key={tab.id} type="button" className={`bn-item ${stage}`} onClick={() => tap(tab.id)}>
                <span className="bn-glyph">
                  <BilleaseIcon name={isActive ? tab.on : tab.off} size="md" color={colour} />
                </span>
                <span style={{
                  fontSize: 11, lineHeight: 1.3, fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-subtle)',
                }}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)' }}>
          Tap a tab. The icon dips for 200ms, then springs back over 100ms as the colour flips.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'Switching between the app’s top-level destinations',
  'The set is fixed and small enough to sit in one bar',
  'The destination changes immediately on tap',
]

const AVOID_WHEN = [
  'The action is destructive or needs confirming',
  'The tap opens a sheet or a dialog rather than a destination',
  'The control sits outside the navigation bar',
]

const BEHAVIOR_RULES = [
  ['Only the icon moves',
   'The glyph scales. The label, the bar and the other tabs hold still, so the feedback stays on the thing that was touched.'],
  ['Down is twice as long as up',
   'It dips over 200ms and returns over 100ms. The asymmetry is the point: the press feels absorbed and the release feels quick.'],
  ['The colour flips, it does not fade',
   'The tab turns from grey to brand at the turn between the two halves, in a single frame. Tweening the colour is explicitly not the behaviour.'],
  ['Haptics on tap',
   'A haptic fires when the finger lands, at the start of the dip, not on release.'],
  ['One destination is active',
   'Tapping a tab makes it the active one and clears the previous. Tapping the already-active tab still plays the press.'],
  ['Reduced motion drops the scale',
   'The colour still changes and the destination still switches. Only the dip is removed.'],
]

const SPEC_ROWS = [
  ['Total duration',    `${TOTAL}ms`],
  ['Scale down',        `${DOWN_MS}ms, 100% to 90%`],
  ['Scale up',          `${UP_MS}ms, 90% to 100%`],
  ['Easing',            EASING],
  ['Inactive colour',   'neutral 500. The file states #909090, one step off the token’s #919191.'],
  ['Active colour',     'icon/brand-primary. The file states #E72B10, where the token is #E7161A.'],
  ['Colour change',     'Instant, at the turn between the two halves. Never tweened.'],
  ['Haptics',           'On tap, at the start of the dip'],
  ['What scales',       'The icon only'],
  ['Reduced motion',    'No scale. Colour and destination still change.'],
]

const STATE_ROWS = [
  ['Inactive',  'Outline glyph and label on neutral 500.'],
  ['Pressed',   'The icon at 90%, still in its inactive colour. 200ms.'],
  ['Active',    'The icon back at 100% in brand primary, with the filled glyph and a semibold label.'],
  ['Re-tapped', 'An already-active tab still dips and returns. The press is acknowledged even when nothing changes.'],
]

const ACCESSIBILITY_RULES = [
  ['Respect reduced motion',
   'Drop the dip. The colour change and the destination change both remain, so nothing is lost but the flourish.'],
  ['Colour is not the only signal',
   'The active tab also switches to the filled glyph and a semibold label, so the state does not rest on hue alone.'],
  ['Announce the destination',
   'The tab is a navigation control and reports its selected state. The scale is decoration and is not announced.'],
  ['Haptics are additive',
   'The haptic confirms the tap. Nothing depends on feeling it.'],
]

const ENGINEERING_ROWS = [
  ['Two transitions, not one keyframe set',
   'The dip and the return have different durations, so they are two transitions rather than one animation with a midpoint. Writing it as a single 300ms keyframe animation splits the time evenly and loses the asymmetry.'],
  ['Flip the colour at the turn',
   'Change it as the return begins, and give it no transition. If the colour is bound to the same state that drives the scale, this happens for free.'],
  ['Scale the glyph, not the button',
   'Scaling the tab scales the label with it. The transform belongs on the icon.'],
  ['Fire the haptic on press',
   'At the start of the dip, on finger down, not on the tap completing.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BottomNavigation() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <BottomNavDemo />
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
        <DocCard>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {SPEC_ROWS.map((row, i, arr) => (
                <tr key={row[0]} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 16px', verticalAlign: 'top', width: 200, fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 600, color: 'var(--text-base)', whiteSpace: 'nowrap' }}>{row[0]}</td>
                  <td style={{ padding: '10px 16px', verticalAlign: 'top', fontFamily: 'var(--font-family)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-subtle)' }}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DocCard>
        <div style={{ marginTop: 12 }}>
          <Note title="Colour drift.">
            The Motion file names two hex values that are one step off the token
            set: #909090 against neutral 500’s #919191, and #E72B10 against
            icon/brand-primary’s #E7161A. The tokens are used here. Worth
            correcting in the file so the two stop disagreeing.
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
