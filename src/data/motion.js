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
      {
        id: 'accordion',
        label: 'Accordion',
        definition: 'The expand and collapse of a disclosure section, with its chevron.',
        node: '1:4356',
        spec: { duration: '300ms', easing: STANDARD_EASING },
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
