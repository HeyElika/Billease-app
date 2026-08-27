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
 *   hold            0 ─ 100
 *   content out         100 ──── 220
 *   data swap                    220
 *   content in                   220 ─────────────── 420
 *   height              100 ────────── 300
 *
 * The hold is what makes the parent read as the thing that moved: it is well
 * clear of the ground before anything below it reacts.
 *
 * The two halves do not overlap. The outgoing content is fully hidden before
 * the data changes, so nothing is ever read through anything else.
 *
 * The height is the exception, and it is what keeps the handover from stepping.
 * It runs during the exit, against the incoming content measured out of sight,
 * so the section is already the right size before the new content appears.
 */
export const CONTEXTUAL_MOTION = {
  holdMs: 100,       // the parent moves alone for this long
  exitMs: 120,
  enterMs: 200,
  shift: 4,          // px, and opacity carries the change rather than this
  skeletonMs: 120,   // fading a placeholder in, when the data is not there yet
  crossfadeMs: 180,  // placeholder to content, once it arrives
  heightMs: 200,     // under the exit, so the swap lands at the right size
  reducedMs: 1,
}
