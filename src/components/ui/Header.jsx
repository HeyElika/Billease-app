import { useLocation } from 'react-router-dom'

const pageMeta = {
  '/explorer': { title: 'Component Explorer', description: 'Browse all 138 Billease design system components' },
  '/tokens': { title: 'Design Tokens', description: 'Colors, typography, spacing, and effects from variables.json' },
}

export default function Header() {
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] ?? { title: 'Billease DS', description: '' }

  return (
    <header
      style={{
        height: 64,
        backgroundColor: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--text-base)',
            fontFamily: 'var(--font-family)',
            lineHeight: 1,
          }}
        >
          {meta.title}
        </h1>
        {meta.description && (
          <p
            style={{
              margin: '2px 0 0',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-subtle)',
              fontFamily: 'var(--font-family)',
            }}
          >
            {meta.description}
          </p>
        )}
      </div>
    </header>
  )
}
