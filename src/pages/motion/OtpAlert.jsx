/**
 * OTP alert — a pattern under Motion / Feedback & status.
 *
 * Read from the Motion system file, node 1:4449, including the resolution
 * sticky on that frame:
 *
 *   Total duration   400ms
 *   Easing           0.9, 0, 0.1, 1
 *   Alert Y          -86 to 24
 *   OTP component Y  24 to 122, the text, the boxes and Resend code together
 *   Auto-dismiss     5s on screen after entry, timer fixed
 *   Exit             400ms, same easing, reversed. The OTP returns to where it was.
 *
 * This is not a toast. A toast floats over the screen and takes no space; this
 * one arrives above the field and pushes it down, so the message and the thing
 * it is about are never on top of each other.
 */

import { useEffect, useRef, useState } from 'react'
import Alert from '../../components/ds/Alert'
import OTPInput from '../../components/ds/OTPInput'
import { PhoneMock, StatusBar, AndroidNavBar } from '../flows/PhoneMockShared'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note, ReplayButton } from './docs'

// ─── Values, from node 1:4449 ────────────────────────────────────────────────

const ALERT_MS    = 400
const ALERT_EASE  = 'cubic-bezier(0.9, 0, 0.1, 1)'
const ALERT_FROM  = -86
const ALERT_TO    = 24
const OTP_FROM    = 24
const OTP_TO      = 122
const PUSH        = OTP_TO - OTP_FROM        // 98
const DWELL_MS    = 5000

const PHONE_SCALE = 0.46

const CSS = `
  .oa-alert, .oa-field { transition: transform ${ALERT_MS}ms ${ALERT_EASE}; }
  @media (prefers-reduced-motion: reduce) {
    .oa-alert, .oa-field { transition-duration: 1ms; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function OtpAlertDemo() {
  const [shown, setShown] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const show = () => {
    clearTimeout(timer.current)
    setShown(true)
    // Fixed from the moment it lands, and never extended by anything the user does.
    timer.current = setTimeout(() => setShown(false), ALERT_MS + DWELL_MS)
  }

  return (
    <DemoCard
      label="Alert over the field"
      action={<ReplayButton onClick={show} label="Show alert" />}
      stageStyle={{ padding: '28px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <PhoneMock scale={PHONE_SCALE}>
          <StatusBar />
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-base)' }}>
            {/* The alert lives above the field and comes down into place. */}
            <div
              className="oa-alert"
              style={{
                position: 'absolute', top: ALERT_TO, left: 20, right: 20,
                transform: shown ? 'none' : `translateY(${ALERT_FROM - ALERT_TO}px)`,
              }}
            >
              <Alert type="error" message="Incorrect code, please try again" />
            </div>

            {/* The field is pushed down by exactly the space the alert takes. */}
            <div
              className="oa-field"
              style={{
                position: 'absolute', top: OTP_FROM, left: 0, right: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-400)',
                transform: shown ? `translateY(${PUSH}px)` : 'none',
                fontFamily: 'var(--ds-font-family)',
              }}
            >
              <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-subtle)' }}>
                If registered, a code will be sent to the email
              </span>
              <OTPInput type="OTP-mobile" values={['', '', '', '', '', '']} focusedIndex={0} />
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-base)', textDecoration: 'underline' }}>
                Resend code
              </span>
            </div>
          </div>
          <AndroidNavBar />
        </PhoneMock>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '48ch' }}>
          The alert drops in and the field moves down {PUSH}px to make room. After
          {' '}{DWELL_MS / 1000}s it leaves and the field goes back to where it was.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'Something needs saying about the field the user is working in',
  'The message belongs beside the input rather than over the screen',
  'It can go on its own once it has been read',
]

const AVOID_WHEN = [
  'The message is about the screen rather than the field, which is a toast',
  'It must not be missed, since this dismisses itself',
  'The field itself is what should react, which is the error shake or the success state',
]

const BEHAVIOR_RULES = [
  ['It arrives above the field and makes room',
   `The alert comes from ${ALERT_FROM} to ${ALERT_TO} while the OTP component moves from ${OTP_FROM} to ${OTP_TO}. Nothing overlaps: the message takes ${PUSH}px and the field gives it.`],
  ['The field moves as one piece',
   'The instruction, the boxes and Resend code travel together. Moving only part of the group would break the spacing the field was designed with.'],
  ['Everything is one movement',
   `${ALERT_MS}ms on ${ALERT_EASE} for both. The alert arriving and the field moving are the same event.`],
  ['The dwell is fixed at five seconds',
   `It stays ${DWELL_MS / 1000}s once it has landed and then goes on its own. The timer never resets, whatever the user does in the meantime.`],
  ['Leaving puts everything back',
   'The exit is the entrance reversed, and the field returns to exactly the position it started from.'],
]

const SPEC_ROWS = [
  ['Entry duration',  `${ALERT_MS}ms`],
  ['Easing',          ALERT_EASE],
  ['Alert Y',         `${ALERT_FROM} to ${ALERT_TO}`],
  ['OTP component Y', `${OTP_FROM} to ${OTP_TO}, a ${PUSH}px push`],
  ['What moves',      'The instruction, the OTP boxes and Resend code, as one group'],
  ['Dwell',           `${DWELL_MS / 1000}s after entry, fixed, never reset by interaction`],
  ['Exit',            `${ALERT_MS}ms, same easing, reversed. The OTP returns to its original position.`],
  ['End to end',      `${(ALERT_MS + DWELL_MS + ALERT_MS) / 1000}s from trigger to gone`],
  ['Reduced motion',  'No travel. The alert appears, the field is where it needs to be, and the dwell is unchanged.'],
  ['Source',          'Motion system, node 1:4449, with the resolution sticky on that frame'],
]

const STATE_ROWS = [
  ['No alert',   `The field sits at ${OTP_FROM}.`],
  ['Arriving',   `The alert drops to ${ALERT_TO} as the field moves to ${OTP_TO}.`],
  ['Resting',    `Both in place for ${DWELL_MS / 1000}s.`],
  ['Touched',    'Nothing changes. The timer keeps running.'],
  ['Leaving',    'The alert returns above the screen and the field comes back to where it was.'],
]

const ACCESSIBILITY_RULES = [
  ['Announce the message',
   'The alert is a live status message and is announced when it appears. Five seconds is not long enough to assume it was read.'],
  ['Do not move focus',
   'The user is typing a code. The alert says something about that field and must not take focus away from it.'],
]

const ENGINEERING_ROWS = [
  ['Push, do not overlap',
   'The field moves by exactly the height the alert occupies. Floating the alert over the field instead covers the thing the message is about.'],
  ['Move the group with a transform',
   'Translate the OTP component rather than changing its layout position, so nothing inside it reflows on the way down.'],
  ['Start the timer when it lands',
   `The ${DWELL_MS / 1000}s is time on screen. Starting the clock at the trigger loses ${ALERT_MS}ms of it.`],
  ['Do not extend the timer',
   'Fixed, no reset on interaction, exactly as with the toast. Alert libraries usually reset on hover or touch and that has to be turned off.'],
  ['Return to the original position',
   'The field goes back to where it was, not to wherever the layout puts it after the alert unmounts. Those are the same only if nothing else changed.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OtpAlert() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <OtpAlertDemo />
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
          Read from the Motion system file. The frame carries a resolution
          sticky, and the values below are the resolved ones.
        </P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="Not the same as a toast.">
            A toast floats over the screen, takes no space and rests at 54. This
            arrives at {ALERT_TO}, above the field, and pushes it down. Both
            auto-dismiss on a fixed timer, but one is about the screen and the
            other is about the input directly under it.
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
