/**
 * Contextual content transition.
 *
 * A parent owns a selection. A region below it shows content that belongs to
 * whatever is selected. This runs the handover between the two, so the parent
 * leads and the dependent content follows:
 *
 *   selection committed
 *     → the parent starts moving
 *     → the current content fades out, 60ms behind it
 *     → the incoming content fades up through it as it goes
 *     → the height eases under both, so nothing steps
 *
 * The two halves overlap. The outgoing content is under a tenth of its opacity
 * by the time the incoming one starts, so no line is ever read through another,
 * but there is no empty beat in the middle either: one dissolves into the next.
 * A hard sequence of out, then swap, then in, reads as a reload, which is the
 * thing this exists to avoid.
 *
 * It reacts to a committed selection, never to a gesture in progress. Pass the
 * value only once the parent has decided; a drag that is cancelled must never
 * reach this, and there is nothing here to undo if it does not.
 *
 * Interruption cancels, it never queues. A selection that changes again mid
 * handover replaces both halves, so swiping A to B to C ends on C.
 *
 * Written for the card carousel's transactions and kept general, since account
 * pickers and the other carousels have the same parent-and-dependent shape.
 */

import { useLayoutEffect, useRef, useState } from 'react'
import { ACCELERATE, DECELERATE, CONTEXTUAL_MOTION } from './contextualMotion'

const M = CONTEXTUAL_MOTION

const CSS = `
  .cx-region { position: relative; transition: height ${M.heightMs}ms ${DECELERATE}; }
  /* Whatever is on its way out, and any placeholder, sit over the region rather
     than in it, so the incoming content is what the height is measured from and
     there is nothing to reflow when they go. */
  .cx-over { position: absolute; top: 0; left: 0; right: 0; pointer-events: none; }

  /* Leaving drops fast and holds the tail, so it is out of the way before the
     arrival starts rather than fading in step with it. */
  @keyframes cx-exit  { from { opacity: 1; } to { opacity: 0; transform: translateY(-${M.shift}px); } }
  @keyframes cx-enter { from { opacity: 0; transform: translateY(${M.shift}px); } to { opacity: 1; } }
  @keyframes cx-fade-in  { from { opacity: 0; } }
  @keyframes cx-fade-out { to   { opacity: 0; } }

  .cx-exit  { animation: cx-exit  ${M.exitMs}ms ${DECELERATE} ${M.exitDelay}ms both; }
  .cx-enter { animation: cx-enter ${M.enterMs}ms ${DECELERATE} ${M.enterDelay}ms both; }
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
  const [state, setState] = useState(() => ({
    shown: value,
    leaving: null,
    entering: false,
    placeholder: !ready,
    turn: 0,
  }))

  // Adjusted during render rather than in an effect: the incoming content has
  // to be in the tree on the same commit as the outgoing one, or the height has
  // nothing to ease between and the section steps instead of moving.
  if (state.shown !== value) {
    setState(s => ({
      shown: value,
      leaving: { value: s.shown },   // replaces anything already on its way out
      entering: true,
      placeholder: !ready,
      turn: s.turn + 1,
    }))
  }

  const { shown, leaving, entering, placeholder, turn } = state

  const regionRef = useRef(null)
  const contentRef = useRef(null)
  const height = useRef(null)

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

  const onLeft = (e) => {
    if (e.target !== e.currentTarget) return
    setState(s => ({ ...s, leaving: null }))
  }

  const onArrived = (e) => {
    if (e.target !== e.currentTarget) return
    setState(s => ({ ...s, entering: false }))
  }

  const onPlaceholderGone = (e) => {
    if (e.target !== e.currentTarget) return
    setState(s => ({ ...s, placeholder: false }))
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
        key={`cx-in-${turn}`}
        ref={contentRef}
        className={arriving ? 'cx-content-in' : entering ? 'cx-enter' : undefined}
        style={waiting ? { visibility: 'hidden' } : undefined}
        aria-hidden={waiting ? 'true' : undefined}
        onAnimationEnd={onArrived}
      >
        {children(shown)}
      </div>

      {leaving && (
        <div
          key={`cx-out-${turn}`}
          className="cx-over cx-exit"
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
