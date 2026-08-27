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
 *     → the old content moves out of a clipped viewport as the new one moves
 *       in, each of them whole
 *
 * The region is the viewport and the content is what travels through it. That
 * distinction is the whole pattern: whatever is being handed over moves as one
 * piece, and nothing is ever applied across the content itself. A mask or a
 * fade laid over the content cuts through its rows, and a row showing one
 * selection's label beside another's value is worse than any transition is
 * good.
 *
 * Both sets are present for the handover, so the region is never empty. Seeing
 * part of each is fine. Seeing a hybrid of the two is not.
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

const CSS = `
  /* The viewport. Everything that happens, happens inside it. */
  .cx-region { position: relative; overflow: hidden; }
  /* The set on its way out is taken out of the flow so the incoming one holds
     the layout, and so neither can push the other around while they cross. */
  .cx-over { position: absolute; top: 0; left: 0; right: 0; pointer-events: none; }

  @keyframes cx-out-next { from { transform: none; opacity: 1; } to { transform: translateX(-${M.shift}px); opacity: 0; } }
  @keyframes cx-in-next  { from { transform: translateX(${M.shift}px); opacity: 0; } to { transform: none; opacity: 1; } }
  @keyframes cx-out-prev { from { transform: none; opacity: 1; } to { transform: translateX(${M.shift}px); opacity: 0; } }
  @keyframes cx-in-prev  { from { transform: translateX(-${M.shift}px); opacity: 0; } to { transform: none; opacity: 1; } }

  .cx-in-next, .cx-out-next, .cx-in-prev, .cx-out-prev {
    animation-duration: ${M.slideMs}ms;
    animation-timing-function: ${DECELERATE};
    animation-delay: ${M.holdMs}ms;
    animation-fill-mode: both;
    /* The transform belongs to the whole set. Nothing inside it moves. */
    will-change: transform, opacity;
  }
  .cx-out-next { animation-name: cx-out-next; }
  .cx-in-next  { animation-name: cx-in-next;  }
  .cx-out-prev { animation-name: cx-out-prev; }
  .cx-in-prev  { animation-name: cx-in-prev;  }

  .cx-skeleton-in  { animation: cx-fade-in  ${M.skeletonMs}ms ${DECELERATE} both; }
  .cx-skeleton-out { animation: cx-fade-out ${M.crossfadeMs}ms ${ACCELERATE} both; }
  .cx-content-in   { animation: cx-fade-in  ${M.crossfadeMs}ms ${DECELERATE} both; }
  @keyframes cx-fade-in  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cx-fade-out { from { opacity: 1; } to { opacity: 0; } }

  /* Motion is never what tells you which selection you are looking at, so all
     of it can go: the content simply changes. */
  @media (prefers-reduced-motion: reduce) {
    .cx-in-next, .cx-out-next, .cx-in-prev, .cx-out-prev,
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
