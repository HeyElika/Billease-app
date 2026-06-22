import { useEffect, useRef, useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

/*
 * Alert — Billease Design System
 * Figma: node 11972:1657–1687, file qESeTFW1GEEosrYnm4Hu3b
 * Variants: type = critical | success | info | warning
 *
 * Alignment rule:
 *   single-line message → icon vertically centered with text
 *   2+ line message     → icon top-aligned with first line of text
 */

const CONFIG = {
  critical: {
    bg:        'var(--bg-error-subtle)',
    icon:      'status-error',
    iconColor: 'var(--icon-error, #e53935)',
  },
  success: {
    bg:        'var(--bg-success-subtle)',
    icon:      'status-success',
    iconColor: 'var(--icon-success, #2e7d32)',
  },
  info: {
    bg:        'var(--bg-info-subtle)',
    icon:      'info',
    iconColor: 'var(--icon-info, #265ce5)',
  },
  warning: {
    bg:        'var(--bg-warning-subtle)',
    icon:      'status-warning',
    iconColor: 'var(--icon-warning, #d97706)',
  },
}

export default function Alert({ type = 'info', message, children }) {
  const cfg = CONFIG[type] ?? CONFIG.info
  const textRef = useRef(null)
  const [multiLine, setMultiLine] = useState(false)

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    function check() {
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 21
      setMultiLine(el.scrollHeight > lh + 4)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [message, children])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: 16,
      borderRadius: 12,
      backgroundColor: cfg.bg,
    }}>
      {/* Icon — top-align when multi-line, center when single-line */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        marginTop: multiLine ? 1 : 'auto',
        alignSelf: multiLine ? 'flex-start' : 'center',
      }}>
        <BilleaseIcon name={cfg.icon} size="sm" color={cfg.iconColor} />
      </div>

      {/* Text */}
      <p ref={textRef} style={{
        flex: 1,
        margin: 0,
        fontFamily: 'var(--ds-font-family)',
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.5,
        color: 'var(--text-base)',
      }}>
        {message ?? children}
      </p>
    </div>
  )
}
