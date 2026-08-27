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
 *   parent settle   0 ─────────────────────────────── ~320
 *   content out            60 ──── 180
 *   data swap                      180
 *   content in                     180 ───────── 380
 */
export const CONTEXTUAL_MOTION = {
  exitDelay: 60,
  exitMs: 120,
  enterMs: 200,
  shift: 4,          // px, and opacity carries the change rather than this
  skeletonMs: 120,   // fading a placeholder in, when the data is not there yet
  crossfadeMs: 180,  // placeholder to content, once it arrives
  heightMs: 200,
  reducedMs: 1,
}
