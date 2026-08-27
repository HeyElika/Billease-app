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
 *   mask                70 ───────────── 310
 *
 * The content is not faded out and back in. A soft-edged mask travels across
 * the region in the direction the parent moved, taking the old content off
 * behind it and leaving the new content in its place, so the region is full
 * from the first frame to the last and nothing is ever seen to reload.
 */
export const CONTEXTUAL_MOTION = {
  holdMs: 70,        // after the commit, before the mask starts
  wipeMs: 240,       // the mask crossing the region
  feather: 10,       // px either side of the edge, so 20px of soft gradient
  skeletonMs: 120,   // fading a placeholder in, when the data is not there yet
  crossfadeMs: 180,  // placeholder to content, once it arrives
  reducedMs: 1,
}
