/**
 * Contextual content transition.
 *
 * A parent owns a selection. A region below it shows content that belongs to
 * whatever is selected. This runs the handover between the two, so the parent
 * leads and the dependent content follows:
 *
 *   selection committed
 *     → the parent starts moving
 *     → the current content leaves, 60ms behind it
 *     → the data is replaced while nothing is readable
 *     → the new content arrives, while the parent is nearly settled
 *
 * It reacts to a committed selection, never to a gesture in progress. Pass the
 * value only once the parent has decided; a drag that is cancelled must never
 * reach this, and there is nothing here to undo if it does not.
 *
 * Interruption cancels, it never queues. A selection that changes again mid
 * handover is simply the value that gets rendered when the exit ends, so
 * swiping A to B to C shows C's content and B's is never drawn.
 *
 * Written for the card carousel's transactions and kept general, since account
 * pickers and the other carousels have the same parent-and-dependent shape.
 */

import { useLayoutEffect, useRef, useState } from 'react'
import { ACCELERATE, DECELERATE, CONTEXTUAL_MOTION } from './contextualMotion'

const M = CONTEXTUAL_MOTION

const CSS = `
  .cx-region { position: relative; transition: height ${M.heightMs}ms ${DECELERATE}; }
  /* The placeholder sits over the region it is standing in for, so the height
     is whatever the content last needed and nothing collapses. */
  .cx-over { position: absolute; top: 0; left: 0; right: 0; pointer-events: none; }

  @keyframes cx-exit  { to   { opacity: 0; transform: translateY(-${M.shift}px); } }
  @keyframes cx-enter { from { opacity: 0; transform: translateY(${M.shift}px); } }
  @keyframes cx-fade-in  { from { opacity: 0; } }
  @keyframes cx-fade-out { to   { opacity: 0; } }

  .cx-exit  { animation: cx-exit  ${M.exitMs}ms ${ACCELERATE} ${M.exitDelay}ms both; }
  .cx-enter { animation: cx-enter ${M.enterMs}ms ${DECELERATE} both; }
  .cx-skeleton-in  { animation: cx-fade-in  ${M.skeletonMs}ms ${DECELERATE} both; }
  .cx-skeleton-out { animation: cx-fade-out ${M.crossfadeMs}ms ${ACCELERATE} both; }
  .cx-content-in   { animation: cx-fade-in  ${M.crossfadeMs}ms ${DECELERATE} both; }

  /* Motion is never what tells you which selection you are looking at, so all
     of it can go. The swap, the placeholder and the height still happen. */
  @media (prefers-reduced-motion: reduce) {
    @keyframes cx-exit  { to   { opacity: 0; } }
    @keyframes cx-enter { from { opacity: 0; } }
    .cx-exit, .cx-enter, .cx-skeleton-in, .cx-skeleton-out, .cx-content-in {
      animation-duration: ${M.reducedMs}ms;
      animation-delay: 0ms;
    }
    .cx-region { transition: none; }
  }
`

/**
 * @param value     the committed selection. Changing it runs a handover.
 * @param ready     is the content for `value` available? False shows the
 *                  placeholder at the height the region already had.
 * @param skeleton  what to show while it is not. Never a spinner: this region
 *                  has a known shape, so the shape is what stands in for it.
 * @param children  render function, called with the value being shown, which
 *                  trails `value` for as long as the outgoing content is
 *                  still readable.
 */
export default function ContextualContent({ value, ready = true, skeleton = null, children }) {
  const [shown, setShown] = useState(value)
  const [entering, setEntering] = useState(false)
  // The placeholder outlives `ready` by one crossfade, so it can fade under the
  // content rather than being cut.
  const [placeholder, setPlaceholder] = useState(!ready)

  const regionRef = useRef(null)
  const contentRef = useRef(null)
  const height = useRef(null)

  // Exiting is not a state: it is simply the gap between what is selected and
  // what is drawn. Nothing to reset, and nothing to get stuck in.
  const exiting = value !== shown
  const waiting = placeholder && !ready      // data not there yet
  const arriving = placeholder && ready      // the crossfade out of the placeholder

  /**
   * Height is a measurement, not a decision, so it is written to the node. It
   * is pinned to the old value, flushed and set to the new one, which is what
   * the transition runs between, then released so a stale number cannot clip.
   */
  useLayoutEffect(() => {
    const region = regionRef.current
    const content = contentRef.current
    if (!region) return
    // Waiting on data: hold the height the region already had. This is the one
    // thing that keeps the page from collapsing and springing back open.
    if (waiting) {
      if (height.current !== null) region.style.height = `${height.current}px`
      return
    }
    if (!content) return
    const from = height.current
    const to = content.offsetHeight
    if (to > 0) height.current = to
    if (from === null || from === to || to === 0) {
      region.style.height = 'auto'
      return
    }
    region.style.height = `${from}px`
    void region.offsetHeight      // flush, or the browser only sees the last value
    region.style.height = `${to}px`
  }, [shown, placeholder, waiting])

  const onExited = (e) => {
    if (e.target !== e.currentTarget) return
    // Whatever is selected now, not what was selected when this started.
    setShown(value)
    setEntering(true)
    setPlaceholder(!ready)
  }

  const onEntered = (e) => {
    if (e.target !== e.currentTarget) return
    setEntering(false)
  }

  const onPlaceholderGone = (e) => {
    if (e.target !== e.currentTarget) return
    setPlaceholder(false)
  }

  return (
    <div
      ref={regionRef}
      className="cx-region"
      onTransitionEnd={e => {
        // Released back to auto once it lands.
        if (e.propertyName === 'height' && e.target === e.currentTarget) {
          e.currentTarget.style.height = 'auto'
        }
      }}
    >
      <style>{CSS}</style>
      <div
        key={`cx-${shown}`}
        ref={contentRef}
        className={
          exiting ? 'cx-exit'
            : arriving ? 'cx-content-in'
              : entering ? 'cx-enter'
                : undefined
        }
        style={waiting ? { visibility: 'hidden' } : undefined}
        aria-hidden={exiting || waiting ? 'true' : undefined}
        onAnimationEnd={exiting ? onExited : onEntered}
      >
        {children(shown)}
      </div>

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
