import { useState } from 'react'
import Alert from '../components/ds/Alert'

// ─── Shared layout helpers (same pattern as LinkDocs, NavHeaderDocs) ──────────

function DocSection({ id, title, children, description }) {
  return (
    <section id={id} style={{ marginBottom: 56 }}>
      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 20, fontWeight: 700, color: 'var(--text-base)', margin: '0 0 20px' }}>
        {title}
      </h2>
      {description && (
        <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)' }}>
          {description}
        </p>
      )}
      {children}
    </section>
  )
}

function DocCard({ children, style }) {
  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden', ...style }}>
      {children}
    </div>
  )
}

function CardHeader({ label }) {
  return (
    <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
      <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </span>
    </div>
  )
}

function CardBody({ children, style }) {
  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 16, backgroundColor: '#fff', ...style }}>
      {children}
    </div>
  )
}

function PropRow({ name, type, def, desc }) {
  return (
    <tr>
      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-base)', borderBottom: '1px solid var(--border-subtle)' }}>{name}</td>
      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-info, #265ce5)', borderBottom: '1px solid var(--border-subtle)' }}>{type}</td>
      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>{def}</td>
      <td style={{ padding: '10px 16px', fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>{desc}</td>
    </tr>
  )
}

function Tag({ children, color = 'var(--bg-sunken)', text = 'var(--text-subtle)' }) {
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 100, backgroundColor: color, fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-family)', color: text }}>
      {children}
    </span>
  )
}

export default function AlertDocs({ comp }) {
  const [liveType, setLiveType] = useState('info')
  const [liveMsg, setLiveMsg] = useState('Your session will expire in 5 minutes.')

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      <p style={{ margin: '0 0 40px', fontSize: 15, color: 'var(--text-subtle)', lineHeight: 1.6 }}>
        Alert banners communicate non-blocking status messages — informational, successful, warning, or critical. They sit inline in a screen, not as toasts or modals.
      </p>

      {/* ── Variants ── */}
      <DocSection id="variants" title="Variants">
        <DocCard>
          <CardHeader label="Critical" />
          <CardBody><Alert type="critical" message="Your account has been locked after too many failed attempts." /></CardBody>
        </DocCard>
        <DocCard style={{ marginTop: 8 }}>
          <CardHeader label="Success" />
          <CardBody><Alert type="success" message="Your email address has been verified successfully." /></CardBody>
        </DocCard>
        <DocCard style={{ marginTop: 8 }}>
          <CardHeader label="Info" />
          <CardBody><Alert type="info" message="Your application is under review. This usually takes 1–2 business days." /></CardBody>
        </DocCard>
        <DocCard style={{ marginTop: 8 }}>
          <CardHeader label="Warning" />
          <CardBody><Alert type="warning" message="Make sure your details are correct before submitting." /></CardBody>
        </DocCard>
      </DocSection>

      {/* ── Alignment ── */}
      <DocSection
        id="alignment"
        title="Alignment"
        description="The icon automatically aligns based on text length. For single-line messages the icon is vertically centered. For two or more lines the icon locks to the top."
      >
        <DocCard>
          <CardHeader label="Single line — icon centered" />
          <CardBody><Alert type="info" message="Your code has been sent." /></CardBody>
        </DocCard>
        <DocCard style={{ marginTop: 8 }}>
          <CardHeader label="Multi-line — icon top-aligned" />
          <CardBody><Alert type="warning" message="Your verification code has expired. Please request a new one and make sure to use it within the next 5 minutes." /></CardBody>
        </DocCard>
      </DocSection>

      {/* ── Playground ── */}
      <DocSection id="playground" title="Playground">
        <DocCard>
          <CardHeader label="Live preview" />
          <CardBody>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['critical', 'success', 'info', 'warning'].map(t => (
                <button key={t} onClick={() => setLiveType(t)} style={{
                  padding: '4px 12px', borderRadius: 100, border: '1px solid',
                  borderColor: liveType === t ? 'var(--bg-secondary)' : 'var(--border-subtle)',
                  backgroundColor: liveType === t ? 'var(--bg-info-subtle)' : 'transparent',
                  color: liveType === t ? 'var(--text-base)' : 'var(--text-subtle)',
                  fontWeight: liveType === t ? 600 : 400,
                  fontSize: 12, fontFamily: 'var(--font-family)', cursor: 'pointer', textTransform: 'capitalize',
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
                width: '100%', boxSizing: 'border-box', padding: '8px 12px',
                borderRadius: 8, border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-base)',
                resize: 'vertical', outline: 'none',
              }}
            />
            <Alert type={liveType} message={liveMsg} />
          </CardBody>
        </DocCard>
      </DocSection>

      {/* ── Props ── */}
      <DocSection id="props" title="Props">
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
      </DocSection>

      {/* ── Usage ── */}
      <DocSection id="usage" title="Usage notes">
        <DocCard>
          <CardBody style={{ gap: 8 }}>
            <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: 14, lineHeight: 2, color: 'var(--text-subtle)' }}>
              <li>Use <strong style={{ color: 'var(--text-base)' }}>critical</strong> only for blocking errors (locked account, payment failure).</li>
              <li>Use <strong style={{ color: 'var(--text-base)' }}>warning</strong> for reversible or pre-action caution.</li>
              <li>Use <strong style={{ color: 'var(--text-base)' }}>info</strong> for neutral guidance or processing states.</li>
              <li>Use <strong style={{ color: 'var(--text-base)' }}>success</strong> to confirm a completed action.</li>
              <li>Keep messages short — 1–2 sentences. Avoid repeating page titles.</li>
            </ul>
          </CardBody>
        </DocCard>
      </DocSection>

      <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0 0 48px' }} />

      {/* ── Changelog ── */}
      <DocSection id="changelog" title="Changelog">
        <DocCard>
          <CardBody style={{ gap: 16 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--font-family)', minWidth: 90, paddingTop: 2 }}>v2 · current</div>
              <div>
                <Tag color="var(--bg-success-subtle)" text="var(--text-success, #2e7d32)">New</Tag>
                <span style={{ fontSize: 13, color: 'var(--text-base)', marginLeft: 8 }}>
                  Added Warning variant. Icon size reduced to 20 px. Info background changed from bg-subtle to bg-info-subtle. Dynamic icon alignment rule added.
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--font-family)', minWidth: 90, paddingTop: 2 }}>v1</div>
              <div>
                <Tag>Deprecated</Tag>
                <span style={{ fontSize: 13, color: 'var(--text-subtle)', marginLeft: 8 }}>
                  Critical, Success, Info only. Icon size 24 px. Info background was bg-subtle. Icons always center-aligned. Use v2 going forward.
                </span>
              </div>
            </div>
          </CardBody>
        </DocCard>
      </DocSection>

    </div>
  )
}
