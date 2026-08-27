/**
 * LottiePlayer — plays a Lottie file from public/ inside a documentation demo.
 *
 * The demos for the two loaders play the exact file devs download from the
 * same page, so the demo cannot drift from the asset. Nothing about the motion
 * is reimplemented here.
 *
 * lottie-web is loaded on demand, so the pages that do not use it never pay
 * for the player. The light build is enough: neither file uses expressions.
 *
 * Remount the player to replay it — the demos do that with a key.
 */

import { useEffect, useRef, useState } from 'react'

let playerModule = null

function loadPlayer() {
  if (!playerModule) playerModule = import('lottie-web/build/player/esm/lottie_light.min.js')
  return playerModule
}

export default function LottiePlayer({ src, width, height, label }) {
  const host = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let animation = null
    let cancelled = false

    loadPlayer()
      .then(({ default: lottie }) => {
        if (cancelled || !host.current) return
        animation = lottie.loadAnimation({
          container: host.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: src,
        })
        animation.addEventListener('data_failed', () => setFailed(true))
      })
      .catch(() => setFailed(true))

    return () => {
      cancelled = true
      if (animation) animation.destroy()
    }
  }, [src])

  return (
    <div
      role="img"
      aria-label={label}
      style={{
        width, height: height ?? width,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)',
      }}
    >
      {failed
        ? <span>{src} could not be loaded</span>
        : <div ref={host} aria-hidden="true" style={{ width: '100%', height: '100%' }} />}
    </div>
  )
}
