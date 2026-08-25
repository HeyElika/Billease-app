/**
 * Motion taxonomy — the left-hand navigation for the Motion section.
 *
 * One entry per motion type (category), each holding the patterns documented
 * under it. Adding a new motion type is a matter of adding a category here and
 * registering its page component in src/pages/motion/registry.js.
 *
 * Route shape: /motion/:categoryId/:patternId
 */

/**
 * The canonical page structure. Every motion pattern is documented with these
 * sections, in this order, so the pages stay comparable to each other.
 *
 *   Purpose        One short definition of what the motion communicates.
 *   Demo           Live example with a replay control. The most important part.
 *   When to use    When it applies, and when it does not.
 *   Behavior       The rules that have to hold wherever the pattern is applied.
 *   Motion spec    Only the values needed to reproduce it.
 *   States         The transitions the pattern has to cover.
 *   Accessibility  Reduced motion, and what gets announced.
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
]

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
