/**
 * Values for the contextual content transition, kept apart from the component
 * so both the pattern and the pages that document it read the same numbers.
 *
 * Curves are the Billease motion set's accelerate and decelerate.
 */

export const ACCELERATE = 'cubic-bezier(0.3, 0, 0.8, 0.15)'
export const DECELERATE = 'cubic-bezier(0.05, 0.7, 0.1, 1)'

/**
 * All measured from the moment the parent starts settling.
 *
 *   parent settle   0 ──────────────────────── ~280
 *   content out            60 ────────── 200
 *   content in                     150 ─────────────── 340
 *   height                 60 ──────────────── 320
 *
 * The two halves overlap by 50ms. The outgoing content is under 10% opacity by
 * the time the incoming starts, so nothing is ever read through anything else,
 * but the section is never empty either: one dissolves into the other rather
 * than leaving and being replaced.
 */
export const CONTEXTUAL_MOTION = {
  exitDelay: 60,
  exitMs: 140,
  enterDelay: 150,
  enterMs: 190,
  shift: 4,          // px, and opacity carries the change rather than this
  skeletonMs: 120,   // fading a placeholder in, when the data is not there yet
  crossfadeMs: 180,  // placeholder to content, once it arrives
  heightMs: 260,     // runs under the whole handover, never in a step
  reducedMs: 1,
}
