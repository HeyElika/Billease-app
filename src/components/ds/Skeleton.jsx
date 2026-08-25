/**
 * Skeleton — Billease Design System
 * Source: Figma node 567:25585 (gradient fill), section 567:25575
 *   "General Skeleton Behaviour", file "Motion design" (P4kziTuTniQFQen8RQUIuy)
 * Registry slot: qr/skeleton, node 53:176, file qESeTFW1GEEosrYnm4Hu3b
 *   (this primitive is the code-behind for that registry entry)
 *
 * A placeholder block with an animated shimmer sweep. Compose multiple
 * <Skeleton> instances to mimic the silhouette of the content being loaded
 * (see SkeletonDocs for the grid-loader / detail-loader examples).
 *
 * Colors are bound Figma variables — color/neutral/neutral 200 (#E0E0E0) and
 * color/neutral/neutral 500 (#919191) — which map exactly to this repo's own
 * --bg-sunken and --bg-strong tokens, so no new color values are introduced.
 *
 * Duration/easing/loop are not attached to the Figma node itself (no
 * keyframe data on either reference frame) — 1000ms/linear/infinite is
 * carried from the written Motion spec doc, not extracted from the file.
 *
 * For text-line placeholders specifically, use the named export SkeletonText
 * below rather than sizing <Skeleton> by hand — it derives height/width from
 * typography-scale tokens so hierarchy (primary/secondary/supporting) and
 * responsive type changes are handled automatically.
 */

const GRADIENT = `linear-gradient(
  65.69deg,
  transparent 0%,
  transparent 45.84%,
  var(--bg-strong) 61.69%,
  transparent 75.48%,
  transparent 100%
)`

export default function Skeleton({
  width = '100%',
  height = 16,
  radius = 'var(--radius-sm)',
  circle = false,
  className,
  style,
}) {
  return (
    <>
      <style>{`
        @keyframes ds-skeleton-sweep {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        .ds-skeleton {
          position: relative;
          overflow: hidden;
          background: var(--bg-sunken);
        }
        .ds-skeleton::after {
          content: '';
          position: absolute;
          inset: 0;
          background: ${GRADIENT};
          transform: translateX(-100%);
          animation: ds-skeleton-sweep 1000ms linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ds-skeleton::after { animation: none; }
        }
      `}</style>
      <div
        className={`ds-skeleton${className ? ` ${className}` : ''}`}
        style={{
          width,
          height,
          borderRadius: circle ? '50%' : radius,
          ...style,
        }}
        aria-hidden="true"
      />
    </>
  )
}

/**
 * SkeletonText — a text-line placeholder sized off the typography scale, not
 * off the incoming content. See "Skeleton text sizing" design rule:
 *
 *  - Height reflects the visual weight of the text role it stands in for
 *    (primary/secondary/supporting), not the full line-height of that role.
 *  - Width is one of a small set of reusable proportional presets
 *    (short/medium/long) — never computed from the real string that will load.
 *
 * Both dimensions are tokens (--skeleton-text-height-*, --skeleton-text-width-*
 * in src/index.css), derived from the existing --text-* type scale via calc().
 * If the type scale changes — a breakpoint, a platform, an accessibility
 * setting — these follow it automatically without touching this component.
 */
const TEXT_HEIGHT_ROLE = {
  primary: 'var(--skeleton-text-height-primary)',
  secondary: 'var(--skeleton-text-height-secondary)',
  supporting: 'var(--skeleton-text-height-supporting)',
}

const TEXT_WIDTH_PRESET = {
  short: 'var(--skeleton-text-width-short)',
  medium: 'var(--skeleton-text-width-medium)',
  long: 'var(--skeleton-text-width-long)',
}

export function SkeletonText({ role = 'secondary', width = 'medium', className, style }) {
  const height = TEXT_HEIGHT_ROLE[role] ?? TEXT_HEIGHT_ROLE.secondary
  const resolvedWidth = TEXT_WIDTH_PRESET[width] ?? width // allow a raw override, e.g. "72%"
  return (
    <Skeleton
      width={resolvedWidth}
      height={height}
      radius={`calc(${height} / 2)`}
      className={className}
      style={style}
    />
  )
}
