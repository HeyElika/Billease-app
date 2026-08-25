/**
 * Skeleton — Billease Design System
 * Registry slot: qr/skeleton, node 53:176, file qESeTFW1GEEosrYnm4Hu3b
 *
 * A placeholder block with an animated shimmer sweep. Compose multiple
 * <Skeleton> instances to mimic the silhouette of the content being loaded
 * (see SkeletonDocs for the grid-loader / detail-loader examples).
 *
 * Implements the documented skeleton loader spec. The single source of truth
 * is the portal page at Motion > Loader > Skeleton loader; keep the two in
 * step rather than tuning values here.
 *
 *   base                neutral 200, var(--bg-sunken)
 *   highlight           neutral 100, var(--bg-subtle)
 *   band                90deg, one element-width wide, soft either side
 *   travel              translateX(-100%) to translateX(300%)
 *   duration / easing   1000ms linear, infinite while loading
 *   text bone height    75% of font size
 *   text bone radius    8px
 *   rectangular radius  8px
 *   circular radius     50%, via the `circle` prop
 *
 * For text-line placeholders specifically, use the named export SkeletonText
 * below rather than sizing <Skeleton> by hand — it derives height/width from
 * typography-scale tokens so hierarchy (primary/secondary/supporting) and
 * responsive type changes are handled automatically.
 */

const GRADIENT = `linear-gradient(
  90deg,
  transparent      0%,
  var(--bg-subtle) 50%,
  transparent    100%
)`

// Shape rules. Text and rectangular placeholders share one radius; only
// genuinely circular targets are round.
const RECT_RADIUS = 'var(--radius-md)'   // 8px
const TEXT_RADIUS = 'var(--radius-md)'   // 8px

export default function Skeleton({
  width = '100%',
  height = 16,
  radius = RECT_RADIUS,
  circle = false,
  className,
  style,
}) {
  return (
    <>
      <style>{`
        @keyframes ds-skeleton-sweep {
          from { transform: translateX(-100%); }
          to   { transform: translateX(300%); }
        }
        .ds-skeleton {
          position: relative;
          overflow: hidden;
          background: var(--bg-sunken);
        }
        .ds-skeleton::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          background: ${GRADIENT};
          transform: translateX(-100%);
          animation: ds-skeleton-sweep 1000ms linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .ds-skeleton::after { animation: none; opacity: 0; }
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
 *  - Height is 75% of the role's font-size: the glyph shape it stands in for,
 *    not the full line box of that role.
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
      radius={TEXT_RADIUS}
      className={className}
      style={style}
    />
  )
}
