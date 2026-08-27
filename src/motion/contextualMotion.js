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
 *   hold                              280 ─ 360
 *   crossfade                               360 ───────── 540
 *   height                                  360 ───────── 540
 *
 * Nothing below the parent moves until the parent has arrived. The content then
 * waits out the hold, so the change reads as the answer to a selection that has
 * already been made rather than as part of making it.
 *
 * The two sets cross directly: the outgoing one is still on screen while the
 * incoming one comes up, so the section is never empty. Opacity is the whole of
 * it. Nothing translates, because nothing is arriving from anywhere: the same
 * container is showing different data.
 */
export const CONTEXTUAL_MOTION = {
  holdMs: 80,        // after the parent has settled, before anything changes
  fadeMs: 180,       // both directions, at once
  skeletonMs: 120,   // fading a placeholder in, when the data is not there yet
  crossfadeMs: 180,  // placeholder to content, once it arrives
  heightMs: 180,     // with the crossfade, so a taller list does not step
  reducedMs: 1,
}
