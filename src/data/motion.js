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

/**
 * Loader Lotties, served from public/ so the files have stable URLs devs can
 * download or point a build at, with no Drive access to request. Names match
 * the source files.
 */
export const LOTTIE_PAGE_LOADER = '/motion/page-loader.json'
export const LOTTIE_SPINNER     = '/motion/spinner.json'

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
        spec: { duration: 'Loops until the fetch completes', easing: 'Lottie timeline' },
        asset: { name: 'page-loader.json', url: LOTTIE_PAGE_LOADER },
        notes: [
          ['Behavior',
           'Loops indefinitely until the fetch or render completes. There is no fixed duration: it is dismissed by the data arriving, not by a timer.'],
          ['Where it applies',
           'Whole-page waits, where the app is fetching or rendering an entire screen rather than a region of one.'],
        ],
      },
      {
        id: 'spinner',
        label: 'Inline spinner',
        definition: 'A micro loading indicator inside an existing component, signalling background processing without taking over the screen.',
        spec: { duration: 'Loops until the fetch completes', easing: 'Lottie timeline' },
        asset: { name: 'spinner.json', url: LOTTIE_SPINNER },
        notes: [
          ['Behavior',
           'Loops indefinitely until the fetch completes. There is no fixed duration: it is dismissed by the data arriving, not by a timer.'],
          ['Where it applies',
           'Inside an existing component, signalling background processing without taking over the screen. Use the skeleton loader instead when the shape of the incoming content is known.'],
        ],
      },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation & transitions',
    description: 'Moving between screens, tabs, flows and items.',
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
        notes: [
          ['Two drivers',
           'A tap plays the full 600ms animation on the standard curve. A horizontal swipe instead maps animation progress to the gesture fraction in real time, interpolated linearly, and on release either completes or snaps back.'],
          ['One progress value',
           'Alpha, the cross-slide and the background colour lerp are all driven by the same progress value, so they stay in sync with the finger. Alpha runs 10% to 100%.'],
          ['Where the gesture is live',
           'The swipe driver is active only in the top 300dp of the screen, the region holding the header, segmented control and Available Limit card. Below that it is off.'],
        ],
      },
      {
        id: 'card-carousel',
        label: 'Card carousel',
        definition: 'Dragging horizontally between cards, with the neighbouring card peeking at the edge.',
        spec: { duration: '300ms snap', easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)' },
        links: [{ label: 'Cards animation handoff', detail: 'Interactive prototype', url: 'https://claude.ai/code/artifact/63d0fe5d-2b57-4568-8bf6-a054e326a60a' }],
        notes: [
          ['Layout',
           'The centred card sits at full scale. Neighbours peek at the edges at 268/300 scale, roughly 0.89, re-centred vertically against the centred card so the row reads as one strip.'],
          ['Drag, not fling',
           'The strip follows the finger one to one with no transition while the pointer is down. Velocity is never measured, so this is direct manipulation rather than a recognised swipe gesture. A movement under 4px is treated as a tap, so tapping a peeking card also selects it.'],
          ['Commit or snap back',
           'Past 60px of travel the carousel commits to the neighbouring card. Under that it returns to where it was. Snap runs 300ms on the Material 3 emphasized-decelerate curve.'],
          ['What follows the selection',
           'The dots, the action row and the transaction list below all track whichever card is centred.'],
          ['Reduced motion',
           'Transitions are switched off entirely rather than shortened, so the change is instant.'],
        ],
      },
      {
        id: 'contextual-content',
        label: 'Contextual content',
        definition: 'Content below a selection handing over to the newly selected one, once the selection is committed.',
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
    id: 'overlays',
    label: 'Overlays',
    description: 'Surfaces that arrive over the current screen.',
    patterns: [
      {
        id: 'new-flow-entry',
        label: 'New flow entry',
        definition: 'The full-height sheet that opens when the user enters a new flow.',
        node: '1:4201',
        spec: { duration: '600ms', easing: STANDARD_EASING },
        notes: [
          ['Dismissal',
           'Swipe down to dismiss is disabled on full-height flow sheets. Close via back navigation or an explicit control only, so an accidental drag cannot discard form input. Standard bottom sheets keep drag to dismiss.'],
          ['Scrim',
           'Black, 0 to 50% opacity. Sheet travels Y 740 to 0.'],
        ],
      },
      {
        id: 'bottom-sheet',
        label: 'Bottom sheet',
        definition: 'The entrance and dismissal of a partial-height bottom sheet.',
        node: '1:4231',
        spec: { duration: '600ms', easing: STANDARD_EASING },
        notes: [
          ['Drag to dismiss',
           'Kept, unlike full-height flow sheets.'],
          ['Approved curve exception',
           'Because the sheet is drag-driven, a physics-based spring settle is the correct platform behavior and is approved as-is on both platforms. The 600ms and standard curve describe the intended feel, not a strict requirement. The scrim spec still applies: black, 0 to 50%.'],
        ],
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
        notes: [
          ['Open trigger',
           'Edge swipe to open is disabled on both platforms. The top-bar control is the only trigger, which avoids conflicts with the system back gesture and with the tab swipe region.'],
          ['Motion',
           'Drawer X -370 to 0, screen content parallax 0 to -40, scrim black 0 to 50%.'],
        ],
      },
    ],
  },
  {
    id: 'controls',
    label: 'Controls & interactions',
    description: 'Components responding to direct input.',
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
        notes: [
          ['Motion',
           'Chevron rotates 0 to -180 degrees while the list travels. Both run on the same 300ms and standard curve.'],
        ],
      },
      {
        id: 'card-flip',
        label: 'Card flip',
        definition: 'Turning a card over to reveal its number, expiry and CVV.',
        spec: { duration: '450ms', easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)' },
        links: [{ label: 'Cards animation handoff', detail: 'Interactive prototype', url: 'https://claude.ai/code/artifact/63d0fe5d-2b57-4568-8bf6-a054e326a60a' }],
        notes: [
          ['The motion',
           'A true three-dimensional turn, not a cross-dissolve: the card rotates 180 degrees around its vertical axis inside a 1200px perspective. Transform runs 450ms, with the card filter following over 260ms on the same curve.'],
          ['Gated by identity',
           'View details does not flip straight away. It raises a confirm-your-identity step with face verification first, so the flip plays on success rather than on tap.'],
          ['Locked is a separate state',
           'A locked card shows Card locked and cannot be used. Lock and unlock is its own transition, a 260ms cross-fade between the closed and open lock icons, and does not flip the card.'],
          ['Not yet in the Motion system file',
           'These values come from the cards handoff prototype. They are not in the Motion system Figma file, and they do not use the Billease standard curve.'],
        ],
      },
      {
        id: 'lock-unlock',
        label: 'Lock and unlock',
        definition: 'Freezing a card so it cannot be used, and releasing it again.',
        spec: { duration: '400ms lock, 340ms unlock', easing: 'cubic-bezier(0.2, 0, 0, 1)' },
        links: [{ label: 'Lock and unlock handoff', detail: 'Interactive prototype', url: 'https://claude.ai/code/artifact/e5166bcd-31c3-42e5-9908-242dcb93fc3c' }],
      },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback & status',
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
