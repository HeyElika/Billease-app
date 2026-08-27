/**
 * Contextual content transition.
 *
 * A parent owns a selection. A region below it shows content that belongs to
 * whatever is selected. This runs the handover between the two, so the parent
 * leads and the dependent content follows:
 *
 *   selection committed
 *     → the parent starts settling
 *     → the current content fades out
 *     → the data is replaced once it is fully hidden
 *     → the new content fades in
 *
 * Only one set of content is ever visible. What keeps that from stepping is the
 * height: the incoming content is measured out of sight during the exit, so the
 * section eases to its new size before anything appears in it, rather than
 * jumping at the moment the data changes.
 *
 * It reacts to a committed selection, never to a gesture in progress. Pass the
 * value only once the parent has decided; a drag that is cancelled must never
 * reach this, and there is nothing here to undo if it does not.
 *
 * Interruption cancels, it never queues. What gets drawn is read at the moment
 * the exit ends, so swiping A to B to C shows C and B is never drawn.
 *
 * Written for the card carousel's transactions and kept general, since account
 * pickers and the other carousels have the same parent-and-dependent shape.
 */

import { useLayoutEffect, useRef, useState } from 'react'
import { ACCELERATE, DECELERATE, CONTEXTUAL_MOTION } from './contextualMotion'

const M = CONTEXTUAL_MOTION

const CSS = `
  .cx-region { position: relative; transition: height ${M.heightMs}ms ${DECELERATE}; }
  /* Anything that is not the content itself sits over the region rather than in
     it: the placeholder, and the copy of the incoming content that exists only
     to be measured. Neither can affect the layout it is being measured for. */
  .cx-over { position: absolute; top: 0; left: 0; right: 0; pointer-events: none; }
  .cx-measure { visibility: hidden; }

  @keyframes cx-exit  { from { opacity: 1; } to { opacity: 0; transform: translateY(-${M.shift}px); } }
  @keyframes cx-enter { from { opacity: 0; transform: translateY(${M.shift}px); } to { opacity: 1; } }
  @keyframes cx-fade-in  { from { opacity: 0; } }
  @keyframes cx-fade-out { to   { opacity: 0; } }

  .cx-exit  { animation: cx-exit  ${M.exitMs}ms ${ACCELERATE} both; }
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
 * @param children  render function, called with the value to draw.
 */
export default function ContextualContent({ value, ready = true, skeleton = null, children }) {
  // `shown` trails `value` for as long as the outgoing content is still on
  // screen. Everything else is derived from the two.
  const [shown, setShown] = useState(value)
  const [entering, setEntering] = useState(false)
  // The placeholder outlives `ready` by one crossfade, so it can fade under the
  // content rather than being cut.
  const [placeholder, setPlaceholder] = useState(!ready)

  const regionRef = useRef(null)
  const contentRef = useRef(null)
  const measureRef = useRef(null)
  const height = useRef(null)

  // Exiting is not a state: it is the gap between what is selected and what is
  // drawn. Nothing to reset, and nothing to get stuck in.
  const exiting = value !== shown
  const waiting = placeholder && !ready      // data not there yet
  const arriving = placeholder && ready      // the crossfade out of the placeholder

  /**
   * Height is a measurement, not a decision, so it is written to the node. It
   * is pinned to the old value, flushed and set to the new one, which is what
   * the transition runs between, then released so a stale number cannot clip.
   *
   * During the exit it is measured from the incoming content, which is in the
   * tree but out of sight. That is the whole reason that copy exists: the
   * section reaches its new size while it is empty, so nothing steps when the
   * data is swapped in.
   */
  useLayoutEffect(() => {
    const region = regionRef.current
    if (!region) return
    // Waiting on data: hold the height the region already had. This is the one
    // thing that keeps the page from collapsing and springing back open.
    if (waiting) {
      if (height.current !== null) region.style.height = `${height.current}px`
      return
    }
    const source = exiting ? measureRef.current : contentRef.current
    if (!source) return
    const from = height.current
    const to = source.offsetHeight
    if (to > 0) height.current = to
    if (from === null || from === to || to === 0) {
      region.style.height = 'auto'
      return
    }
    region.style.height = `${from}px`
    void region.offsetHeight      // flush, or the browser only sees the last value
    region.style.height = `${to}px`
  }, [shown, exiting, placeholder, waiting])

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

      {/* Measured, never seen: it gives the height somewhere to go while the
          old content is still fading, so the swap lands at the right size. */}
      {exiting && ready && (
        <div ref={measureRef} className="cx-over cx-measure" aria-hidden="true">
          {children(value)}
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
