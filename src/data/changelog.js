// Component changelog entries — keyed by Figma node ID
export const CHANGELOGS = {
  '35:1200': [
    {
      date: '2026-06-22',
      type: 'added',
      description: 'Added Notification Banner (Toast) component. Types: critical, success, error, info. Dynamic icon alignment: single-line = center, two-line = top-aligned. Text truncates at 2 lines.',
    },
  ],
  '16:182': [
    {
      date: '2026-06-09',
      type: 'removed',
      description: 'Removed gradient button type from the design system.',
    },
  ],
  '228:11126': [
    {
      date: '2026-06-22',
      type: 'added',
      description: 'Added Warning variant. Icon size reduced to 20 px (sm). Info background changed from bg-subtle to bg-info-subtle. Dynamic icon alignment: single-line = center, 2+ lines = top-aligned.',
    },
    {
      date: '2026-06-22',
      type: 'deprecated',
      description: 'Old v1 variants (Critical, Success, Info with 24 px icon and always-centered alignment) are deprecated. Use v2 variants going forward.',
    },
  ],
  '188:2882': [
    {
      date: '2026-06-16',
      type: 'removed',
      description: 'Removed error state with solid pink background (bg-error-subtle). Error cells now use a 2px red border on white background, consistent with the error-active style.',
    },
    {
      date: '2026-06-16',
      type: 'added',
      description: 'Added success state: white background with 2px green border (border-success). Used to confirm a valid code entry.',
    },
  ],
}
