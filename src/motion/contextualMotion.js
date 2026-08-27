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
 *   glide               70 ───────────── 310
 *
 * The region is a clipped viewport, and what moves through it is each set of
 * content whole. Never the values inside it: a mask or a fade applied across
 * the content itself cuts through the rows, and a row that is half one card and
 * half another is worse than any transition is good.
 *
 * The travel is small on purpose. It is there to say the context changed, not
 * to be watched: at 10px the two sets read as one settling into the other
 * rather than as panels being exchanged. The clip is only there so nothing
 * escapes the section; it should never be visible as an edge.
 */
export const CONTEXTUAL_MOTION = {
  holdMs: 70,        // after the commit, before anything moves
  slideMs: 240,      // one set out, the other in, together
  shift: 10,         // px each set travels: a nudge, not a journey
  skeletonMs: 120,   // fading a placeholder in, when the data is not there yet
  crossfadeMs: 180,  // placeholder to content, once it arrives
  reducedMs: 1,
}
