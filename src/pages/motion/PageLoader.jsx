/**
 * Page loader — a pattern under Motion / Loader.
 *
 * Everything here is read out of public/motion/page-loader.json, the file the
 * page offers for download. The demo plays that same file rather than a
 * rebuild of it, so the two cannot disagree.
 *
 * Values quoted below are in composition units: the file is 1500 x 1125 and
 * scales as a whole, so the ratios hold at any rendered size.
 */

import { useState } from 'react'
import { LOTTIE_PAGE_LOADER } from '../../data/motion'
import { PhoneMock, StatusBar, AndroidNavBar } from '../flows/PhoneMockShared'
import LottiePlayer from './LottiePlayer'
import {
  DocSection, DocCard, CardHeader, P, DemoCard, RuleTable, UsageList, Note,
  ReplayButton, DownloadButton,
} from './docs'

// ─── Values, all read from the file ──────────────────────────────────────────

const FPS         = 30
const FRAMES      = 33
const LOOP_MS     = Math.round((FRAMES / FPS) * 1000)   // 1100
const DOT_DIA     = 83.42                               // composition units
const DOT_GAP     = 174.6                               // centre to centre, averaged
const TRAVEL      = 74.3                                // averaged over the three dots
const ART_W_PCT   = 28.8                                // artwork width as a share of the composition
const ART_H_PCT   = 14.2

// The demo renders the composition at 250 x 188, which puts the row of dots at
// about 72px wide inside the phone screen.
const DEMO_COMP_W = 250
const DEMO_COMP_H = 188
const PHONE_SCALE = 0.5

// ─── Demo ─────────────────────────────────────────────────────────────────────

function PageLoaderDemo() {
  const [run, setRun] = useState(0)

  return (
    <DemoCard
      label="Page load"
      action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
      stageStyle={{ padding: '32px 28px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <PhoneMock scale={PHONE_SCALE}>
          <StatusBar />
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--canvas-alt)',
          }}>
            <LottiePlayer
              key={run}
              src={LOTTIE_PAGE_LOADER}
              width={DEMO_COMP_W}
              height={DEMO_COMP_H}
              label="Page loading"
            />
          </div>
          <AndroidNavBar />
        </PhoneMock>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '46ch' }}>
          The screen holds nothing but the loader. It repeats every {LOOP_MS}ms
          and stops when the data arrives, not on a timer.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'A whole screen is waiting on a fetch or a render',
  'There is no known content shape to stand in for',
  'The wait replaces the screen rather than sitting inside it',
  'The screen is entered fresh, so there is nothing on it yet to keep',
]

const AVOID_WHEN = [
  'The shape of the incoming content is known, which is the skeleton loader',
  'Only one region or one control is working, which is the inline spinner',
  'Content is already on screen and is being refreshed underneath the user',
  'The wait is short enough that the loader would appear and vanish in a blink',
]

const BEHAVIOR_RULES = [
  ['It loops until the data arrives',
   'There is no fixed duration. The loader is removed by the fetch or the render completing, never by a timer running out.'],
  ['It owns the screen',
   'Nothing else sits on the screen while it runs. No partial content, no header that will move when the real one loads.'],
  ['One asset everywhere',
   'Every surface plays page-loader.json. Rebuilding the bounce natively will drift from the file, because the positions are keyed frame by frame rather than described by a curve.'],
  ['The loop is seamless',
   'Frame 33 lands back on frame 0, so the repeat has no visible join. Nothing needs to fade or restart between cycles.'],
  ['Size is proportional',
   'Spacing and travel are set against the diameter of the dot, so scaling the composition scales the whole thing correctly. Never resize one part of it.'],
  ['It never reports progress',
   'The animation is the same whatever is happening behind it. If the wait has a measurable percentage, this is the wrong pattern.'],
  ['A failure removes it',
   'When the fetch fails the loader goes and the screen shows its error state. It must never be left looping over a request that has already come back.'],
]

const SPEC_ROWS = [
  ['Loop length',      `${LOOP_MS}ms, ${FRAMES} frames at ${FPS}fps, repeating`],
  ['Dismissal',        'On the data arriving. Not timed.'],
  ['Elements',         'Three dots, named Left, Middle and Right in the file'],
  ['Dot colour',       'bg/secondary, #265CE5'],
  ['Dot diameter',     `${DOT_DIA} composition units, 5.6% of the composition width`],
  ['Spacing',          `${DOT_GAP} units centre to centre, 2.1x the diameter of a dot`],
  ['Travel',           `${TRAVEL} units, 0.9x the diameter of a dot`],
  ['Timing',           'Position is keyed on every frame. There is no easing curve to quote: the rise and fall is baked into the file.'],
  ['Phase',            'The dots reach the top of their travel at 0ms (Middle), 267ms (Right) and 833ms (Left). Left and Right are in antiphase: one is at the top exactly as the other reaches the bottom.'],
  ['Hold',             'Right holds at the top of its arc for three frames, 100ms, while Left holds at the bottom. The other turns take a single frame.'],
  ['Reduced motion',   'The loader keeps running. It is the only signal that the screen is working, and at 0.9 cycles per second it is nowhere near a flash risk.'],
]

const STATE_ROWS = [
  ['Entering',  'The screen is empty and the loader is centred on it. It starts at frame 0 rather than joining a cycle already in progress.'],
  ['Looping',   `A ${LOOP_MS}ms cycle repeating for as long as the request is open.`],
  ['Resolved',  'The loader is removed and the screen renders. The loop is not allowed to finish first.'],
  ['Failed',    'The loader is removed and the screen shows its error state.'],
  ['Cancelled', 'The user leaving the screen destroys the animation. It must not be left playing off screen.'],
]

const ACCESSIBILITY_RULES = [
  ['Announce the wait, not the animation',
   'The region carries a live status with a text label such as Loading. The dots themselves are decorative and are hidden from assistive technology.'],
  ['Mark the region busy',
   'Set the busy state on the region being loaded and clear it when the content arrives, so the change is announced once rather than on every loop.'],
  ['Reduced motion keeps it',
   'This is the only thing telling the user the app is working, so it keeps running. If a product decides to freeze it, it has to put text in its place.'],
  ['No flash risk',
   'One cycle per 1100ms, and nothing in the file changes opacity abruptly. It stays far below the three flashes per second threshold.'],
]

const ENGINEERING_ROWS = [
  ['The box is not the artwork',
   `The composition is 1500 x 1125 but the dots only fill ${ART_W_PCT}% of its width and ${ART_H_PCT}% of its height. A 72px row of dots needs a 250px composition box. Size against the artwork, not the frame.`],
  ['The artwork is not exactly centred',
   'It sits about 1.7% left of centre and 0.8% above it. Centring the composition box is close enough for a full screen, but do not expect optical centring inside a tight container.'],
  ['Loop the player, do not remount it',
   'Set the player to loop and leave it alone. Restarting it on every render resets the cycle and shows as a stutter.'],
  ['Destroy it on unmount',
   'An animation left running after its screen has gone keeps a timer alive. Destroy it when the loader is removed.'],
  ['Do not rebuild it in CSS',
   'The positions are keyed on every frame, so there is no curve to translate. Any CSS version is an approximation that will drift from the file.'],
  ['Decide the minimum display time in product',
   'The file does not settle whether a loader that appears for 80ms should be held longer to avoid a flash. That is a product decision and it belongs in the screen, not in the asset.'],
]

const LOTTIE_ROWS = [
  ['File',           'page-loader.json'],
  ['Composition',    `1500 x 1125, ${FPS}fps, ${FRAMES} frames`],
  ['Loop',           `${LOOP_MS}ms, seamless`],
  ['Layers',         'Three, named Left, Middle and Right'],
  ['Renderer',       'SVG. No expressions, so the light build of the player is enough.'],
  ['Colour',         'bg/secondary #265CE5, on the dots only. Nothing in the file paints a background.'],
  ['Version',        'Lottie 5.12.2'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PageLoader() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <PageLoaderDemo />
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
          Read out of the file. Sizes are in composition units, which scale as a
          whole, so the ratios hold whatever size the loader is rendered at.
        </P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="No easing to quote.">
            Every frame of the dot movement is keyed, so the file carries no
            curve to name. That is why the asset is the specification here: the
            timing cannot be written down as a duration and an easing and then
            rebuilt.
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

        <div style={{ height: 32 }} />
        <DocCard>
          <CardHeader
            label="Lottie asset"
            action={<DownloadButton href={LOTTIE_PAGE_LOADER} name="page-loader.json" />}
          />
          <RuleTable rows={LOTTIE_ROWS} labelWidth={220} bare />
        </DocCard>

        <div style={{ marginTop: 12 }}>
          <Note title="Worth tightening at source.">
            The artwork uses a little under a third of the width it ships in.
            Re-exporting the composition cropped to the dots would make the box
            the same size as what you see, and would remove the offset from
            centre. Until that happens, size the box against the artwork.
          </Note>
        </div>
      </DocSection>
    </>
  )
}
