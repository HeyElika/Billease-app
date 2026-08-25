/**
 * Motion taxonomy — the left-hand navigation for the Motion section.
 *
 * One entry per motion type (category), each holding the patterns documented
 * under it. Adding a new motion type is a matter of adding a category here and
 * registering its page component in src/pages/motion/index.js.
 *
 * Route shape: /motion/:categoryId/:patternId
 */

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
        sections: [
          { id: 'demo',          label: 'Demo'                 },
          { id: 'usage',         label: 'Usage'                },
          { id: 'behaviour',     label: 'Behaviour'            },
          { id: 'specification', label: 'Specification'        },
          { id: 'states',        label: 'States'               },
          { id: 'accessibility', label: 'Accessibility'        },
        ],
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
