/**
 * App launch — a pattern under Motion / Navigation & transitions.
 *
 * Read from the Motion system file, node 1:4060 ("App launch // post security
 * animation"), including the sequencing note and the iOS resolution sticky:
 *
 *   Total duration   1500ms, easing 0.9, 0, 0.1, 1
 *   Sequencing       One transition. Every element starts at 0 and ends at
 *                    1500, sharing the curve. There are no per-element delays.
 *   Blue box         Height 709 to 210
 *   Logo             Y 353 to 243, masking as it goes
 *   Top bar          Y -168 to 42
 *   Tabs             Y -60 to 90
 *   Available limit  Y 752 to 138
 *   Balance bar      Scale width 0% to 100%
 *   Below the frame  Evenly spaced 200 apart, landing at 24
 *   Bottom nav       Y 824 to 649
 *   Trigger          Once background loading completes
 *
 * The bottom-to-top sequence people perceive is emergent from how far each
 * element travels, not from staggered starts. That is the whole point of the
 * frame, and the thing most likely to be rebuilt wrong.
 */

import { useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import { PhoneMock, StatusBar, AndroidNavBar } from '../flows/PhoneMockShared'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note, ReplayButton } from './docs'

// ─── Values, from node 1:4060 ────────────────────────────────────────────────

const LAUNCH_MS   = 1500
const LAUNCH_EASE = 'cubic-bezier(0.9, 0, 0.1, 1)'
const BOX_FROM    = 709
const BOX_TO      = 210
const LOGO_FROM   = 353
const LOGO_TO     = 243
const TOPBAR_FROM = -168
const TOPBAR_TO   = 42
const TABS_FROM   = -60
const TABS_TO     = 90
const LIMIT_FROM  = 752
const LIMIT_TO    = 138
const NAV_FROM    = 824
const NAV_TO      = 649

const PHONE_SCALE = 0.46

const CSS = `
  @keyframes al-box    { from { height: ${BOX_FROM}px; }            to { height: ${BOX_TO}px; } }
  @keyframes al-logo   { from { transform: translateY(${LOGO_FROM - LOGO_TO}px); } to { transform: none; } }
  @keyframes al-top    { from { transform: translateY(${TOPBAR_FROM - TOPBAR_TO}px); } to { transform: none; } }
  @keyframes al-tabs   { from { transform: translateY(${TABS_FROM - TABS_TO}px); } to { transform: none; } }
  @keyframes al-limit  { from { transform: translateY(${LIMIT_FROM - LIMIT_TO}px); } to { transform: none; } }
  @keyframes al-nav    { from { transform: translateY(${NAV_FROM - NAV_TO}px); } to { transform: none; } }
  @keyframes al-bar    { from { transform: scaleX(0); } to { transform: scaleX(1); } }

  /* One block: same duration, same curve, no delays anywhere. */
  .al { animation-duration: ${LAUNCH_MS}ms; animation-timing-function: ${LAUNCH_EASE}; animation-fill-mode: both; }
  .al-box   { animation-name: al-box; }
  .al-logo  { animation-name: al-logo; }
  .al-top   { animation-name: al-top; }
  .al-tabs  { animation-name: al-tabs; }
  .al-limit { animation-name: al-limit; }
  .al-nav   { animation-name: al-nav; }
  .al-bar   { animation-name: al-bar; transform-origin: 0 50%; }

  @media (prefers-reduced-motion: reduce) {
    .al { animation-duration: 1ms; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function LaunchDemo() {
  const [run, setRun] = useState(1)

  return (
    <DemoCard
      label="Post security"
      action={<ReplayButton onClick={() => setRun(n => n + 1)} label="Launch" />}
      stageStyle={{ padding: '28px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <PhoneMock scale={PHONE_SCALE}>
          <StatusBar />
          <div key={run} style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--canvas-default)' }}>
            {/* The blue box is the security screen collapsing into the header. */}
            <div className="al al-box" style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'var(--bg-secondary)' }} />

            <div className="al al-logo" style={{
              position: 'absolute', top: LOGO_TO, left: 0, right: 0, textAlign: 'center',
              fontFamily: 'var(--ds-font-family)', fontSize: 28, fontWeight: 700, color: 'var(--text-on-dark)',
            }}>
              billease
            </div>

            <div className="al al-top" style={{
              position: 'absolute', top: TOPBAR_TO, left: 0, right: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 var(--space-400)', fontFamily: 'var(--ds-font-family)',
            }}>
              <BilleaseIcon name="burger-menu" size="md" color="var(--icon-on-dark)" />
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-on-dark)' }}>Welcome</span>
              <BilleaseIcon name="notification" size="md" color="var(--icon-on-dark)" />
            </div>

            <div className="al al-tabs" style={{
              position: 'absolute', top: TABS_TO, left: 0, right: 0,
              display: 'flex', gap: 'var(--space-500)', padding: '0 var(--space-400)',
              fontFamily: 'var(--ds-font-family)', fontSize: 'var(--text-md)', color: 'var(--text-on-dark)',
            }}>
              <span style={{ fontWeight: 600 }}>Loans</span>
              <span style={{ opacity: 0.6 }}>Credit line</span>
            </div>

            <div className="al al-limit" style={{
              position: 'absolute', top: LIMIT_TO, left: 20, right: 20,
              backgroundColor: 'var(--bg-base)', borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-400)', display: 'flex', flexDirection: 'column', gap: 'var(--space-300)',
              fontFamily: 'var(--ds-font-family)', boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
            }}>
              <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-subtle)' }}>Available limit</span>
              <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-base)' }}>₱25,000.00</span>
              <span style={{ height: 6, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-sunken)', overflow: 'hidden' }}>
                <span className="al al-bar" style={{ display: 'block', height: '100%', width: '60%', backgroundColor: 'var(--bg-secondary)' }} />
              </span>
            </div>

            <div className="al al-nav" style={{
              position: 'absolute', top: NAV_TO, left: 0, right: 0,
              display: 'flex', justifyContent: 'space-around', padding: 'var(--space-300) 0',
              backgroundColor: 'var(--bg-base)', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
            }}>
              {['home-fill', 'installment-outline', 'qr', 'statement-outline', 'chat-outline'].map(n => (
                <BilleaseIcon key={n} name={n} size="md" color="var(--icon-subtle)" />
              ))}
            </div>
          </div>
          <AndroidNavBar />
        </PhoneMock>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '50ch' }}>
          Everything starts together and lands together. What looks like a
          bottom-to-top sequence is just how far each piece had to come.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'The app has finished loading behind a security screen and is handing over to the home page',
  'Everything the user is about to see arrives at once, from one state to another',
]

const AVOID_WHEN = [
  'Content is still loading, which is the page loader or a skeleton',
  'The user navigated somewhere, which is step forward and back',
  'Only part of the screen is changing, which is a smaller pattern',
]

const BEHAVIOR_RULES = [
  ['It is one transition, not a sequence',
   `Every element starts at 0 and finishes at ${LAUNCH_MS}ms on the same curve. There are no per-element delays anywhere in this animation.`],
  ['The order you see is emergent',
   'The bottom-to-top feeling comes from travel distance: the bottom navigation crosses 175 while the available limit card crosses 614, so they move at visibly different speeds and appear to arrive in turn. Adding real delays on top of that doubles an effect that is already there.'],
  ['The security screen becomes the header',
   `The blue box does not leave. It collapses from ${BOX_FROM} to ${BOX_TO}, ending as the header the home page sits under, with the logo masking as it rises.`],
  ['It waits for the data, then plays once',
   'The trigger is background loading completing, so the home page never animates in and then has to change. It plays once and is not repeated on return to the screen.'],
  ['The balance bar grows from nothing',
   'Scale width 0 to 100% inside the card that is itself arriving, so the number and its bar settle together.'],
]

const SPEC_ROWS = [
  ['Total duration',   `${LAUNCH_MS}ms`],
  ['Easing',           LAUNCH_EASE],
  ['Sequencing',       'One transition, no offsets. Every element runs the full window.'],
  ['Blue box',         `Height ${BOX_FROM} to ${BOX_TO}`],
  ['Logo',             `Y ${LOGO_FROM} to ${LOGO_TO}, masking as it moves`],
  ['Top bar',          `Y ${TOPBAR_FROM} to ${TOPBAR_TO}`],
  ['Tabs',             `Y ${TABS_FROM} to ${TABS_TO}`],
  ['Available limit',  `Y ${LIMIT_FROM} to ${LIMIT_TO}`],
  ['Balance bar',      'Scale width 0% to 100%'],
  ['Below the card',   'Evenly spaced 200 apart, landing at 24'],
  ['Bottom navigation', `Y ${NAV_FROM} to ${NAV_TO}`],
  ['Trigger',          'Background loading completing'],
  ['Reduced motion',   'The home page appears without the travel. The blue screen still hands over to it.'],
  ['Source',           'Motion system, node 1:4060, with the sequencing note and iOS sticky on that frame'],
]

const STATE_ROWS = [
  ['Security',  'Full blue screen with the logo centred, while the app loads behind it.'],
  ['Handover',  `Everything moves at once for ${LAUNCH_MS}ms: the box collapses, the logo rises, the page arrives from above and below.`],
  ['Home',      'The blue box is the header, the card is in place and the bar is full.'],
  ['Returning', 'Nothing. This is a launch animation, not a screen entrance.'],
]

const ACCESSIBILITY_RULES = [
  ['Nothing waits for the animation',
   'The home page is interactive as it arrives, not after 1500ms. A launch animation must never be a gate.'],
  ['Reduced motion goes straight there',
   'The handover still happens, without the travel. A second and a half of movement is exactly what reduced motion is for.'],
  ['Announce the screen, not the motion',
   'What is announced is that the home page is ready. The travel carries nothing an assistive technology needs.'],
]

const ENGINEERING_ROWS = [
  ['One animation block, not a timeline',
   'All of these values belong to a single transition. Building it as a staggered sequence is the documented mistake: the file says so explicitly, and the perceived order is already produced by the distances.'],
  ['Distance is the only thing that differs',
   'Every element shares the duration and the curve. If two elements need to feel differently paced, that comes from where they start, not from when.'],
  ['The box changes height, the rest translate',
   'Only the blue box animates its size. Everything else moves, so nothing else reflows during a 1500ms animation.'],
  ['Do not start it early',
   'It fires when loading completes. Playing it against a screen whose data has not arrived means animating in placeholders and then swapping them.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AppLaunch() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <LaunchDemo />
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
        <P>
          Read from the Motion system file. Positions are in the frame the values
          were written against.
        </P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="No stagger. Really.">
            The sticky resolves this explicitly: one Smart Animate transition,
            every element starting at 0 and ending at {LAUNCH_MS}ms, shared
            easing, no per-element delays. The bottom-to-top sequence is emergent
            from travel distance. Adding delays on top produces a launch that
            feels twice as slow as the one that was designed.
          </Note>
        </div>
        <div style={{ marginTop: 12 }}>
          <Note title="What the demo stands in for.">
            The logo here is set in the DS typeface rather than the wordmark
            asset, and the mask on it is not reproduced. Everything that moves
            uses the values above.
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
