/**
 * Contextual content transition.
 *
 * A parent owns a selection. A region below it shows content that belongs to
 * whatever is selected. This runs the handover between the two, so the parent
 * leads and the dependent content follows:
 *
 *   selection committed
 *     → the parent starts settling
 *     → a short hold, so the parent is plainly the thing that moved
 *     → a soft-edged mask crosses the region the same way the parent went,
 *       taking the old content off behind it and leaving the new one in place
 *
 * It is a replacement, not a fade. Both sets are on screen for the whole of it,
 * each carrying half of the same mask, so the region is full from the first
 * frame to the last. Nothing is ever seen to empty and refill, which is what
 * makes a dependent region look like it reloaded.
 *
 * It reacts to a committed selection, never to a gesture in progress. Pass the
 * value only once the parent has decided; a drag that is cancelled must never
 * reach this, and there is nothing here to undo if it does not.
 *
 * Interruption cancels, it never queues. A selection that changes again mid
 * handover replaces both halves, so A to B to C ends on C.
 *
 * Written for the card carousel's transactions and kept general, since account
 * pickers and the other carousels have the same parent-and-dependent shape.
 */

import { useLayoutEffect, useRef, useState } from 'react'
import { ACCELERATE, DECELERATE, CONTEXTUAL_MOTION } from './contextualMotion'

const M = CONTEXTUAL_MOTION

/**
 * The mask is twice the width of the region and slides across it. One half is
 * opaque, the other transparent, with ${M.feather * 2}px of gradient between them: that
 * soft edge is the difference between a replacement and a wipe.
 *
 * The two sets carry mirrored masks, so wherever one is hidden the other is
 * shown and the region is covered at every instant.
 */
const EDGE = (dir) => `linear-gradient(to ${dir}, #000 calc(50% - ${M.feather}px), transparent calc(50% + ${M.feather}px))`

const MASKED = (image) => `
    -webkit-mask-image: ${image};
            mask-image: ${image};
    -webkit-mask-size: 200% 100%;
            mask-size: 200% 100%;
    -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
`

const CSS = `
  .cx-region { position: relative; }
  /* Whatever is on its way out, and any placeholder, sit over the region rather
     than in it, so the incoming content is what holds the layout. */
  .cx-over { position: absolute; top: 0; left: 0; right: 0; pointer-events: none; }

  @keyframes cx-wipe-fwd {
    from { -webkit-mask-position: 0% 0;   mask-position: 0% 0;   }
    to   { -webkit-mask-position: 100% 0; mask-position: 100% 0; }
  }
  @keyframes cx-wipe-back {
    from { -webkit-mask-position: 100% 0; mask-position: 100% 0; }
    to   { -webkit-mask-position: 0% 0;   mask-position: 0% 0;   }
  }

  .cx-in-next, .cx-out-next, .cx-in-prev, .cx-out-prev {
    animation-duration: ${M.wipeMs}ms;
    animation-timing-function: ${DECELERATE};
    animation-delay: ${M.holdMs}ms;
    animation-fill-mode: both;
  }
  /* Next: the card went right to left, so the edge does too. The new content is
     uncovered from the right as the old one is covered from the right. */
  .cx-in-next  { animation-name: cx-wipe-fwd;  ${MASKED(EDGE('left'))} }
  .cx-out-next { animation-name: cx-wipe-fwd;  ${MASKED(EDGE('right'))} }
  /* Previous mirrors it. */
  .cx-in-prev  { animation-name: cx-wipe-back; ${MASKED(EDGE('right'))} }
  .cx-out-prev { animation-name: cx-wipe-back; ${MASKED(EDGE('left'))} }

  .cx-skeleton-in  { animation: cx-fade-in  ${M.skeletonMs}ms ${DECELERATE} both; }
  .cx-skeleton-out { animation: cx-fade-out ${M.crossfadeMs}ms ${ACCELERATE} both; }
  .cx-content-in   { animation: cx-fade-in  ${M.crossfadeMs}ms ${DECELERATE} both; }
  @keyframes cx-fade-in  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cx-fade-out { from { opacity: 1; } to { opacity: 0; } }

  /* Motion is never what tells you which selection you are looking at, so all
     of it can go: the content simply changes. */
  @media (prefers-reduced-motion: reduce) {
    .cx-in-next, .cx-out-next, .cx-in-prev, .cx-out-prev {
      animation-duration: ${M.reducedMs}ms;
      animation-delay: 0ms;
      -webkit-mask-image: none;
              mask-image: none;
    }
    .cx-skeleton-in, .cx-skeleton-out, .cx-content-in {
      animation-duration: ${M.reducedMs}ms;
      animation-delay: 0ms;
    }
  }
`

/**
 * @param value     the committed selection. Changing it runs a handover.
 * @param ready     is the content for `value` available? False shows the
 *                  placeholder at the height the region already had.
 * @param skeleton  what to show while it is not. Never a spinner: this region
 *                  has a known shape, so the shape is what stands in for it.
 * @param children  render function, called with the value to draw.
 */
export default function ContextualContent({ value, ready = true, skeleton = null, direction, children }) {
  const [state, setState] = useState(() => ({
    shown: value,
    leaving: null,
    dir: 'next',
    placeholder: !ready,
    turn: 0,
  }))

  // Adjusted during render rather than in an effect: both sets have to be in
  // the tree on the same commit, or the mask has nothing to cross between.
  if (state.shown !== value) {
    setState(s => ({
      shown: value,
      leaving: { value: s.shown },   // replaces anything already on its way out
      dir: directionOf(direction, s.shown, value),
      placeholder: !ready,
      turn: s.turn + 1,
    }))
  }

  const { shown, leaving, dir, placeholder, turn } = state

  const regionRef = useRef(null)
  const contentRef = useRef(null)
  const outRef = useRef(null)

  const waiting = placeholder && !ready      // data not there yet
  const arriving = placeholder && ready      // the crossfade out of the placeholder

  /**
   * The section does not resize while the mask is running. It is held at
   * whichever of the two sets is taller for as long as both are on screen, and
   * released the moment the old one goes. Nothing here animates a height: a
   * region that grows under a transition reads as the page moving, which is
   * exactly what a replacement is supposed to avoid.
   */
  useLayoutEffect(() => {
    const region = regionRef.current
    const content = contentRef.current
    if (!region || !content) return
    if (waiting || leaving) {
      const both = Math.max(content.offsetHeight, outRef.current?.offsetHeight ?? 0)
      if (both > 0) region.style.minHeight = `${both}px`
      return
    }
    region.style.minHeight = ''
  }, [shown, leaving, placeholder, waiting])

  const onLeft = (e) => {
    if (e.target !== e.currentTarget) return
    setState(s => ({ ...s, leaving: null }))
  }

  const onPlaceholderGone = (e) => {
    if (e.target !== e.currentTarget) return
    setState(s => ({ ...s, placeholder: false }))
  }

  return (
    <div ref={regionRef} className="cx-region">
      <style>{CSS}</style>

      <div
        key={`cx-in-${turn}`}
        ref={contentRef}
        className={arriving ? 'cx-content-in' : leaving ? `cx-in-${dir}` : undefined}
        style={waiting ? { visibility: 'hidden' } : undefined}
        aria-hidden={waiting ? 'true' : undefined}
      >
        {children(shown)}
      </div>

      {leaving && (
        <div
          key={`cx-out-${turn}`}
          ref={outRef}
          className={`cx-over cx-out-${dir}`}
          aria-hidden="true"
          onAnimationEnd={onLeft}
        >
          {children(leaving.value)}
        </div>
      )}

      {placeholder && skeleton && (
        <div
          className={`cx-over ${arriving ? 'cx-skeleton-out' : 'cx-skeleton-in'}`}
          aria-hidden="true"
          onAnimationEnd={arriving ? onPlaceholderGone : undefined}
        >
          {skeleton}
        </div>
      )}
    </div>
  )
}

/**
 * Which way the mask travels. Taken from the caller where it knows, and read
 * off the values where they are positions in a list, which covers a carousel
 * and anything else with an order.
 */
function directionOf(given, from, to) {
  if (given === 'next' || given === 'prev') return given
  if (typeof from === 'number' && typeof to === 'number') return to > from ? 'next' : 'prev'
  return 'next'
}
