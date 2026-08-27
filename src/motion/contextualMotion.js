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
 *   parent settle   0 ─────────────── 280
 *   hold            0 ─ 70
 *   old content         70 ───────── 270
 *   new content         70 ─────────────── 350
 *
 * The region is a clipped viewport, and what moves through it is each set of
 * content whole. Never the values inside it: a mask or a fade applied across
 * the content itself cuts through the rows, and a row that is half one card and
 * half another is worse than any transition is good.
 *
 * The arrival carries the movement. The set that is leaving barely moves and is
 * mostly gone by the time the new one is halfway in, so what you watch is the
 * incoming content sliding into place rather than two panels changing shifts.
 */
export const CONTEXTUAL_MOTION = {
  holdMs: 70,        // after the commit, before anything moves
  exitMs: 200,       // the old set, which mostly just goes
  enterMs: 280,      // the new set, which is the thing being watched
  exitShift: 12,     // px: enough to leave with, no more
  enterShift: 40,    // px: a slide, not a nudge
  skeletonMs: 120,   // fading a placeholder in, when the data is not there yet
  crossfadeMs: 180,  // placeholder to content, once it arrives
  reducedMs: 1,
}
