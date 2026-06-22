import { useState } from 'react'
import Alert from '../components/ds/Alert'

const LABEL = { color: 'var(--text-subtle)', fontSize: 12, fontFamily: 'var(--ds-font-family)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }
const SECTION_TITLE = { margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: 'var(--text-base)', fontFamily: 'var(--ds-font-family)' }
const DIVIDER = { borderTop: '1px solid var(--border-subtle)', margin: '48px 0' }
const PREVIEW_BOX = { padding: 24, backgroundColor: 'var(--bg-subtle)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }

function Tag({ children, color = 'var(--bg-sunken)', text = 'var(--text-subtle)' }) {
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 100, backgroundColor: color, fontSize: 11, fontWeight: 600, fontFamily: 'var(--ds-font-family)', color: text }}>
      {children}
    </span>
  )
}

function PropRow({ name, type, def, desc }) {
  return (
    <tr>
      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-base)', borderBottom: '1px solid var(--border-subtle)' }}>{name}</td>
      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-info, #265ce5)', borderBottom: '1px solid var(--border-subtle)' }}>{type}</td>
      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>{def}</td>
      <td style={{ padding: '10px 16px', fontSize: 13, fontFamily: 'var(--ds-font-family)', color: 'var(--text-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>{desc}</td>
    </tr>
  )
}

export default function AlertDocs({ comp }) {
  const [liveType, setLiveType] = useState('info')
  const [liveMsg, setLiveMsg] = useState('Your session will expire in 5 minutes.')

  return (
    <div style={{ fontFamily: 'var(--ds-font-family)' }}>

      {/* Description */}
      <p style={{ margin: '0 0 40px', fontSize: 15, color: 'var(--text-subtle)', lineHeight: 1.6 }}>
        Alert banners communicate non-blocking status messages — informational, successful, warning, or critical. They sit inline in a screen, not as toasts or modals.
      </p>

      {/* ── Variants ── */}
      <section id="variants" style={{ marginBottom: 48 }}>
        <h2 style={SECTION_TITLE}>Variants</h2>
        <div style={PREVIEW_BOX}>
          <div><div style={LABEL}>Critical</div>
            <Alert type="critical" message="Your account has been locked after too many failed attempts." />
          </div>
          <div><div style={LABEL}>Success</div>
            <Alert type="success" message="Your email address has been verified successfully." />
          </div>
          <div><div style={LABEL}>Info</div>
            <Alert type="info" message="Your application is under review. This usually takes 1–2 business days." />
          </div>
          <div><div style={LABEL}>Warning</div>
            <Alert type="warning" message="Make sure your details are correct before submitting." />
          </div>
        </div>
      </section>

      {/* ── Alignment behavior ── */}
      <section id="alignment" style={{ marginBottom: 48 }}>
        <h2 style={SECTION_TITLE}>Alignment</h2>
        <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6 }}>
          The icon automatically aligns based on text length. For single-line messages the icon is vertically centered. For two or more lines the icon locks to the top.
        </p>
        <div style={PREVIEW_BOX}>
          <div>
            <div style={LABEL}>Single line — icon centered</div>
            <Alert type="info" message="Your code has been sent." />
          </div>
          <div style={{ marginTop: 4 }}>
            <div style={LABEL}>Multi-line — icon top-aligned</div>
            <Alert type="warning" message="Your verification code has expired. Please request a new one and make sure to use it within the next 5 minutes." />
          </div>
        </div>
      </section>

      {/* ── Playground ── */}
      <section id="playground" style={{ marginBottom: 48 }}>
        <h2 style={SECTION_TITLE}>Playground</h2>
        <div style={{ padding: 24, border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['critical', 'success', 'info', 'warning'].map(t => (
              <button key={t} onClick={() => setLiveType(t)} style={{
                padding: '4px 12px', borderRadius: 100, border: '1px solid',
                borderColor: liveType === t ? 'var(--bg-secondary)' : 'var(--border-subtle)',
                backgroundColor: liveType === t ? 'var(--bg-info-subtle)' : 'transparent',
                color: liveType === t ? 'var(--text-base)' : 'var(--text-subtle)',
                fontWeight: liveType === t ? 600 : 400,
                fontSize: 12, fontFamily: 'var(--ds-font-family)', cursor: 'pointer',
                textTransform: 'capitalize',
              }}>
                {t}
              </button>
            ))}
          </div>
          <textarea
            value={liveMsg}
            onChange={e => setLiveMsg(e.target.value)}
            rows={2}
            style={{
              width: '100%', boxSizing: 'border-box',
              marginBottom: 16, padding: '8px 12px',
              borderRadius: 8, border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--ds-font-family)', fontSize: 13,
              color: 'var(--text-base)', resize: 'vertical', outline: 'none',
            }}
          />
          <Alert type={liveType} message={liveMsg} />
        </div>
      </section>

      {/* ── Props ── */}
      <section id="props" style={{ marginBottom: 48 }}>
        <h2 style={SECTION_TITLE}>Props</h2>
        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                {['Prop', 'Type', 'Default', 'Description'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <PropRow name="type" type='"critical" | "success" | "info" | "warning"' def='"info"' desc='Visual variant — controls background color and icon.' />
              <PropRow name="message" type='string' def='—' desc='Text content. Use this or children, not both.' />
              <PropRow name="children" type='ReactNode' def='—' desc='Accepts rich text (bold, spans). Overridden by message.' />
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Usage notes ── */}
      <section id="usage" style={{ marginBottom: 48 }}>
        <h2 style={SECTION_TITLE}>Usage notes</h2>
        <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: 14, lineHeight: 2, color: 'var(--text-subtle)' }}>
          <li>Use <strong style={{ color: 'var(--text-base)' }}>critical</strong> only for blocking errors (locked account, payment failure).</li>
          <li>Use <strong style={{ color: 'var(--text-base)' }}>warning</strong> for reversible or pre-action caution.</li>
          <li>Use <strong style={{ color: 'var(--text-base)' }}>info</strong> for neutral guidance or processing states.</li>
          <li>Use <strong style={{ color: 'var(--text-base)' }}>success</strong> to confirm a completed action.</li>
          <li>Keep messages short — 1–2 sentences. Avoid repeating page titles.</li>
        </ul>
      </section>

      <div style={DIVIDER} />

      {/* ── Changelog ── */}
      <section id="changelog" style={{ marginBottom: 48 }}>
        <h2 style={SECTION_TITLE}>Changelog</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--ds-font-family)', minWidth: 90, paddingTop: 2 }}>v2 · current</div>
            <div style={{ flex: 1 }}>
              <Tag color="var(--bg-success-subtle)" text="var(--text-success, #2e7d32)">New</Tag>
              <span style={{ fontSize: 13, color: 'var(--text-base)', marginLeft: 8 }}>
                Added Warning variant. Icon size reduced to 20px (sm). Infomation alert background changed from bg-subtle to bg-info-subtle. Alignment rule added (single-line = center, multi-line = top-align).
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--ds-font-family)', minWidth: 90, paddingTop: 2 }}>v1</div>
            <div style={{ flex: 1 }}>
              <Tag>Deprecated</Tag>
              <span style={{ fontSize: 13, color: 'var(--text-subtle)', marginLeft: 8 }}>
                Old variants: Critical, Success, Info only. Icon size 24px (md). Info background was bg-subtle. All icons center-aligned regardless of text length. Use v2 variants going forward.
              </span>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
