/**
 * Motion taxonomy — the left-hand navigation for the Motion section.
 *
 * Categorised from the Motion system Figma file. Patterns are grouped by the
 * surface a designer or engineer is building, since that is how they arrive at
 * this page ("I am building a bottom sheet, what is its motion?"), rather than
 * by an abstract motion purpose.
 *
 * Route shape: /motion/:categoryId/:patternId
 *
 * Adding a motion type: add a category or pattern here, then register its page
 * component in src/pages/motion/registry.js. A pattern with no registered
 * component still appears in the navigation and shows what is known about it,
 * so the taxonomy can run ahead of the documentation.
 */

export const MOTION_FILE_KEY = 'A4uFHah9JZUPVpYhCIkKpi'

/** Lottie JSON files live in Drive, not in the repo. */
export const MOTION_ASSETS_URL =
  'https://drive.google.com/drive/folders/1tVTpDWv4D2J3GO-Cy8DGNy78QS3vw5qn?usp=sharing'

export function figmaUrl(node) {
  if (!node) return null
  return `https://www.figma.com/design/${MOTION_FILE_KEY}/Motion-system?node-id=${node.replace(':', '-')}`
}

/**
 * The canonical page structure. Every motion pattern is documented with these
 * sections, in this order, so the pages stay comparable to each other.
 *
 *   Purpose        One short definition of what the motion communicates.
 *   Demo           Live example with a replay control. The most important part.
 *                  Built with DemoCard: the replay control and status caption
 *                  sit in the header bar, the example is centred on the stage
 *                  below. Every pattern uses this so demos stay comparable.
 *   When to use    When it applies, and when it does not.
 *   Behavior       The rules that have to hold wherever the pattern is applied.
 *   Motion spec    Only the values needed to reproduce it.
 *   States         The transitions the pattern has to cover.
 *   Accessibility  Reduced motion, and what gets announced.
 *   Engineering    The values a spec table leaves out but an implementation
 *                  cannot be built without. Last, and engineering-facing.
 *
 * Purpose is rendered by the section shell from `definition` below. Pattern
 * pages render the remaining sections using these exact ids.
 */
export const MOTION_SECTIONS = [
  { id: 'purpose',       label: 'Purpose'       },
  { id: 'demo',          label: 'Demo'          },
  { id: 'usage',         label: 'When to use'   },
  { id: 'behavior',      label: 'Behavior'      },
  { id: 'spec',          label: 'Motion spec'   },
  { id: 'states',        label: 'States'        },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'engineering',   label: 'Engineering reference' },
]

/** The curve every motion uses unless a documented exception applies. */
export const STANDARD_EASING = 'cubic-bezier(0.9, 0, 0.1, 1)'

export const MOTION_CATEGORIES = [
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'The shared values every other motion in the system references.',
    patterns: [
      {
        id: 'easing',
        label: 'Easing',
        definition: 'The standard curve every motion uses, and the documented exceptions to it.',
        spec: { easing: STANDARD_EASING },
      },
      {
        id: 'duration',
        label: 'Duration',
        definition: 'The duration scale, and how to choose between its steps.',
        spec: { duration: '200 / 300 / 400 / 600 / 1500ms' },
      },
      {
        id: 'haptics',
        label: 'Haptics',
        definition: 'Which motions are paired with haptic feedback, and when in the animation it fires.',
      },
      {
        id: 'gesture-drivers',
        label: 'Gesture drivers',
        definition: 'How a gesture replaces a timed curve as the thing driving an animation, and which surfaces accept which gestures.',
        node: '1:4144',
        notes: [
          ['Two drivers',
           'A tap plays the full animation at its specified duration and curve. A gesture maps animation progress to the gesture fraction in real time, interpolated linearly, and on release either completes or snaps back. A gesture never has its own animation; it drives an existing one.'],
          ['Tab switch',
           'Horizontal swipe drives alpha, cross-slide and the background lerp from a single progress value, so they stay in sync with the finger. Alpha runs 10% to 100%. The swipe driver is active only in the top 300dp of the screen, the region holding the header, segmented control and Available Limit card. Below that it is off.'],
          ['Bottom sheet',
           'Drag to dismiss is kept. Because the sheet is drag-driven, a physics-based spring settle is the correct behavior and is a documented exception to the standard curve, on both platforms.'],
          ['Full-height flow sheet',
           'Swipe down to dismiss is disabled. Close via back navigation or an explicit control only, so an accidental drag cannot discard form input.'],
          ['Drawer',
           'Edge swipe to open is disabled on both platforms. The top-bar control is the only trigger, which avoids conflicts with the system back gesture and with the tab swipe region.'],
          ['Not yet specified',
           'Row swipe actions, the activity carousel, the onboarding pager and the full-image dialog all accept swipe in the Android app but have no entry in the Motion system file.'],
        ],
      },
      {
        id: 'icon-state',
        label: 'Icon state change',
        definition: 'How an icon transitions between its two states, so that every pattern using one does not decide separately.',
        notes: [
          ['Paired icons',
           'The icon set ships outline and fill variants of the same glyph: home, chat, user, pin, statement, activity, calendar, installment, users and start. The pair is the two states.'],
          ['Where it happens',
           'Bottom navigation outline to fill, the accordion chevron rotating 0 to -180 degrees, radio and checkbox selection, and the password reveal from eye-off to show.'],
          ['Current state',
           'Unspecified. The Android app swaps the icon colour with no transition, so the change is instant. Every pattern that needs it currently decides for itself, which is the symptom of nobody owning it.'],
          ['Open question',
           'Whether the two states cross-fade and over what duration, or whether particular pairs animate their own geometry the way the chevron already does.'],
        ],
      },
    ],
  },
  {
    id: 'loader',
    label: 'Loader',
    description: 'States that stand in for content while it is being fetched.',
    patterns: [
      {
        id: 'skeleton',
        label: 'Skeleton loader',
        definition: 'Indicates that structured content is loading while preserving the layout users can expect when data arrives.',
      },
      {
        id: 'page',
        label: 'Page loader',
        definition: 'A full-screen looping animation shown while a whole page fetches or renders.',
        node: '1:4515',
        spec: { duration: 'Loops until the fetch completes', easing: 'Lottie timeline' },
        asset: { name: 'Bouncings.json', url: MOTION_ASSETS_URL },
      },
      {
        id: 'spinner',
        label: 'Inline spinner',
        definition: 'A micro loading indicator inside an existing component, signalling background processing without taking over the screen.',
        node: '1:4515',
        spec: { duration: 'Loops until the fetch completes', easing: 'Lottie timeline' },
        asset: { name: 'Spinner.json', url: MOTION_ASSETS_URL },
      },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    description: 'Moving between screens, tabs and flows.',
    patterns: [
      {
        id: 'app-launch',
        label: 'App launch',
        definition: 'The post-security entrance animation that carries the user from launch into the app.',
        node: '1:4060',
        spec: { duration: '1500ms', easing: STANDARD_EASING },
      },
      {
        id: 'step',
        label: 'Step forward and back',
        definition: 'The horizontal push between two screens or modals in a sequence.',
        node: '1:4182',
        spec: { duration: '600ms', easing: STANDARD_EASING },
      },
      {
        id: 'tab-switch',
        label: 'Tab switch',
        definition: 'The cross-slide between two segmented control destinations.',
        node: '1:4144',
        spec: { duration: '600ms', easing: STANDARD_EASING },
      },
      {
        id: 'bottom-navigation',
        label: 'Bottom navigation',
        definition: 'The press feedback on a bottom navigation icon.',
        node: '1:4312',
        spec: { duration: '300ms (200ms down, 100ms up)', easing: STANDARD_EASING, haptics: 'On tap' },
      },
    ],
  },
  {
    id: 'overlay',
    label: 'Overlay',
    description: 'Surfaces that arrive over the current screen.',
    patterns: [
      {
        id: 'new-flow-entry',
        label: 'New flow entry',
        definition: 'The full-height sheet that opens when the user enters a new flow.',
        node: '1:4201',
        spec: { duration: '600ms', easing: STANDARD_EASING },
      },
      {
        id: 'bottom-sheet',
        label: 'Bottom sheet',
        definition: 'The entrance and dismissal of a partial-height bottom sheet.',
        node: '1:4231',
        spec: { duration: '600ms', easing: STANDARD_EASING },
      },
      {
        id: 'dialog',
        label: 'Dialog',
        definition: 'The scale and fade of a centred dialog over a dimmed screen.',
        node: '1:4263',
        spec: { duration: '400ms', easing: STANDARD_EASING },
      },
      {
        id: 'drawer',
        label: 'Drawer',
        definition: 'The side panel that slides in from the edge while the screen behind it parallaxes.',
        node: '1:4281',
        spec: { duration: '400ms', easing: STANDARD_EASING },
      },
    ],
  },
  {
    id: 'controls',
    label: 'Controls',
    description: 'Form and disclosure controls responding to input.',
    patterns: [
      {
        id: 'input-focus',
        label: 'Input focus',
        definition: 'The transition from a placeholder input to a focused one.',
        node: '1:4340',
        spec: { duration: '200ms', easing: STANDARD_EASING },
      },
      {
        id: 'selection',
        label: 'Radio and checkbox',
        definition: 'The selection change on a radio button or checkbox.',
        node: '1:4371',
        spec: { duration: '400ms', easing: STANDARD_EASING },
      },
    ],
  },
  {
    id: 'disclosure',
    label: 'Disclosure',
    description: 'Revealing content in place, without leaving the screen or covering it.',
    patterns: [
      {
        id: 'accordion',
        label: 'Accordion',
        definition: 'The expand and collapse of a disclosure section, with its chevron.',
        node: '1:4356',
        spec: { duration: '300ms', easing: STANDARD_EASING },
      },
      {
        id: 'card-flip',
        label: 'Card flip',
        definition: 'Turning a card over to show its details, tied to the locked and unlocked states of the card.',
        notes: [
          ['Status',
           'The motion is not in the Motion system file and not implemented in the app. The states it turns between are: the card already has a locked state and a reveal action, both handled today with an instant swap.'],
          ['What it turns between',
           'The card front, and the details behind it. The trigger is the see details or reveal control. The locked state is a third case, not simply the reverse of unlocked, since the reveal control is removed entirely while locked.'],
          ['Decide alongside the motion',
           'An auto-hide timer, screenshot behavior, and whether details reveal on tap or on hold. These are security decisions the animation depends on, not consequences of it.'],
          ['Open question',
           'Whether the flip and the existing show and hide value pattern are one pattern at two scales, or two. They share a trigger, a locked state, and an icon that changes with them.'],
        ],
      },
      {
        id: 'show-hide',
        label: 'Show and hide value',
        definition: 'Revealing a masked value in place, such as a balance, an available limit or an account number.',
        notes: [
          ['Already implemented',
           'The Balance component takes a reveal flag that toggles the value between masked and shown, and swaps its icon between show and hide as it does. This is shipped behavior, not a proposal.'],
          ['Three states, not two',
           'Locked is a distinct state rather than the opposite of revealed. While locked, a lock icon replaces the reveal control, the control is removed rather than disabled, and the value renders in a disabled style. Any motion has to cover locked to unlocked as well as hidden to shown.'],
          ['Current state',
           'No animation. The value and the icon both swap instantly, and the tap target explicitly suppresses its ripple, so there is no feedback of any kind on the interaction.'],
          ['Relation to icon state change',
           'The control is an icon with two states, so whatever Foundations settles for icon state change applies to the toggle itself.'],
        ],
      },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    description: 'The system answering something the user just did.',
    patterns: [
      {
        id: 'toast',
        label: 'Toast',
        definition: 'A transient message that enters from the top and dismisses itself.',
        node: '1:4484',
        spec: { duration: '400ms', easing: STANDARD_EASING, dismiss: 'Auto-dismiss after 4s' },
      },
      {
        id: 'otp-success',
        label: 'OTP success',
        definition: 'The confirmation state on an OTP field once the code is accepted.',
        node: '1:4432',
        spec: { duration: '400ms', easing: STANDARD_EASING },
      },
      {
        id: 'otp-error',
        label: 'OTP error shake',
        definition: 'The horizontal shake that rejects an incorrect OTP.',
        node: '1:4385',
        spec: { duration: '400ms (four 100ms sub-moves)', easing: 'Bouncy', haptics: 'At the start' },
      },
      {
        id: 'otp-alert',
        label: 'OTP alert',
        definition: 'The alert that pushes the OTP field down to explain a failure.',
        node: '1:4449',
        spec: { duration: '400ms', easing: STANDARD_EASING, dismiss: 'Auto-dismiss after 5s' },
      },
    ],
  },
]

export const DEFAULT_MOTION_PATH = '/motion/loader/skeleton'

export function findMotionPattern(categoryId, patternId) {
  const category = MOTION_CATEGORIES.find(c => c.id === categoryId)
  if (!category) return null
  const pattern = patternId
    ? category.patterns.find(p => p.id === patternId)
    : category.patterns[0]
  if (!pattern) return null
  return { category, pattern }
}
