import { useRef, useEffect, useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

// ⚠️ Missing tokens (using fallbacks): --border-info, --border-error-bold, --icon-info
const CONFIG = {
  critical: {
    bg:          'var(--bg-error-subtle)',
    border:      'var(--text-error)',        // fallback for --border-error-bold
    icon:        'status-error',
    iconColor:   'var(--icon-error)',
    showClose:   false,
  },
  success: {
    bg:          'var(--bg-success-subtle)',
    border:      'var(--border-success)',
    icon:        'status-success',
    iconColor:   'var(--icon-success)',
    showClose:   true,
  },
  error: {
    bg:          'var(--bg-error-subtle)',
    border:      'var(--text-error)',        // fallback for --border-error-bold
    icon:        'status-error',
    iconColor:   'var(--icon-error)',
    showClose:   true,
  },
  info: {
    bg:          'var(--bg-info-subtle)',
    border:      'var(--bg-secondary)',      // fallback for --border-info
    icon:        'info',
    iconColor:   'var(--bg-secondary)',      // fallback for --icon-info
    showClose:   true,
  },
}

export default function Toast({ type = 'info', message, children, onClose }) {
  const cfg = CONFIG[type] ?? CONFIG.info
  const textRef = useRef(null)
  const [multiLine, setMultiLine] = useState(false)

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const check = () => {
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 24
      setMultiLine(el.scrollHeight > lh + 4)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [message, children])

  const text = message ?? children

  return (
    <div style={{
      display:         'flex',
      alignItems:      'center',
      gap:             8,
      padding:         '16px 12px 16px 16px',
      borderRadius:    'var(--radius-lg)',
      border:          `1px solid ${cfg.border}`,
      backgroundColor: cfg.bg,
    }}>
      {/* icon + text */}
      <div style={{
        display:    'flex',
        flex:       1,
        gap:        8,
        alignItems: multiLine ? 'flex-start' : 'center',
        minWidth:   0,
      }}>
        {/* 24px container, 2px padding → 20px icon */}
        <div style={{
          width:          24,
          height:         24,
          flexShrink:     0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        2,
          boxSizing:      'border-box',
          alignSelf:      multiLine ? 'flex-start' : 'center',
        }}>
          <BilleaseIcon name={cfg.icon} size="sm" color={cfg.iconColor} />
        </div>

        {/* text — max 2 lines, then truncate */}
        <p ref={textRef} style={{
          flex:               1,
          margin:             0,
          fontFamily:         'var(--ds-font-family)',
          fontSize:           16,
          fontWeight:         400,
          lineHeight:         1.5,
          color:              'var(--text-base)',
          display:            '-webkit-box',
          WebkitLineClamp:    2,
          WebkitBoxOrient:    'vertical',
          overflow:           'hidden',
          minWidth:           0,
        }}>
          {text}
        </p>
      </div>

      {/* close icon — shown for types that have it */}
      {cfg.showClose && (
        <button
          onClick={onClose}
          style={{
            flexShrink:     0,
            alignSelf:      multiLine ? 'flex-start' : 'center',
            width:          16,
            height:         16,
            background:     'none',
            border:         'none',
            cursor:         onClose ? 'pointer' : 'default',
            padding:        0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          <BilleaseIcon name="close-mini" size="xs" color="var(--icon-subtle)" />
        </button>
      )}
    </div>
  )
}
