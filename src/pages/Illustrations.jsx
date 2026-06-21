import { useState } from 'react'
import billyActivate       from '../assets/illustrations/billy-activate.png'
import billyApprovedBank   from '../assets/illustrations/billy-approved-bank.png'
import billyApprovedCredit from '../assets/illustrations/billy-approved-credit.png'
import billyBlurry         from '../assets/illustrations/billy-blurry.png'
import billyBoost          from '../assets/illustrations/billy-boost.png'
import billyCancelled      from '../assets/illustrations/billy-cancelled.png'
import billyDetective      from '../assets/illustrations/billy-detective.png'
import billyFrozen         from '../assets/illustrations/billy-frozen.png'
import billyHalf           from '../assets/illustrations/billy-half.png'
import billyInProgress     from '../assets/illustrations/billy-in-progress.png'
import billyNeedMoreDoc    from '../assets/illustrations/billy-need-more-doc.png'
import billyOpenBankAccount from '../assets/illustrations/billy-open-bank-account.png'
import billyPortrait       from '../assets/illustrations/billy-portrait.png'
import billyRejected       from '../assets/illustrations/billy-rejected.png'
import billyReview         from '../assets/illustrations/billy-review.png'
import billySelfie1        from '../assets/illustrations/billy-selfie-1.png'
import billySelfie2        from '../assets/illustrations/billy-selfie-2.png'
import billySelfie3        from '../assets/illustrations/billy-selfie-3.png'
import billySelfiecFace    from '../assets/illustrations/billy-selfie-face.png'
import billyTakingSelfie   from '../assets/illustrations/billy-taking-selfie.png'
import billyThumbUp        from '../assets/illustrations/billy-thumb-up.png'
import billyWaiting        from '../assets/illustrations/billy-waiting.png'
import billyWarning        from '../assets/illustrations/billy-warning.png'
import billyWelcome        from '../assets/illustrations/billy-welcome.png'
import billyWithQr         from '../assets/illustrations/billy-with-qr.png'

const GROUPS = [
  {
    label: 'Status',
    items: [
      { name: 'approved-bank',   label: 'Approved · Bank',   img: billyApprovedBank   },
      { name: 'approved-credit', label: 'Approved · Credit', img: billyApprovedCredit },
      { name: 'in-progress',     label: 'In progress',       img: billyInProgress     },
      { name: 'review',          label: 'Review',            img: billyReview         },
      { name: 'waiting',         label: 'Waiting',           img: billyWaiting        },
      { name: 'rejected',        label: 'Rejected',          img: billyRejected       },
      { name: 'cancelled',       label: 'Cancelled',         img: billyCancelled      },
      { name: 'warning',         label: 'Warning',           img: billyWarning        },
      { name: 'frozen',          label: 'Frozen',            img: billyFrozen         },
    ],
  },
  {
    label: 'Actions & features',
    items: [
      { name: 'welcome',           label: 'Welcome',             img: billyWelcome          },
      { name: 'activate',          label: 'Activate',            img: billyActivate         },
      { name: 'boost',             label: 'Boost',               img: billyBoost            },
      { name: 'thumb-up',          label: 'Thumb up',            img: billyThumbUp          },
      { name: 'detective',         label: 'Detective',           img: billyDetective        },
      { name: 'open-bank-account', label: 'Open bank account',   img: billyOpenBankAccount  },
      { name: 'need-more-doc',     label: 'Need more docs',      img: billyNeedMoreDoc      },
      { name: 'with-qr',          label: 'With QR',             img: billyWithQr           },
    ],
  },
  {
    label: 'Camera & selfie',
    items: [
      { name: 'taking-selfie', label: 'Taking selfie', img: billyTakingSelfie },
      { name: 'selfie-1',      label: 'Selfie 1',      img: billySelfie1      },
      { name: 'selfie-2',      label: 'Selfie 2',      img: billySelfie2      },
      { name: 'selfie-3',      label: 'Selfie 3',      img: billySelfie3      },
      { name: 'selfie-face',   label: 'Selfie face',   img: billySelfiecFace  },
      { name: 'portrait',      label: 'Portrait',      img: billyPortrait     },
      { name: 'half',          label: 'Half',          img: billyHalf         },
      { name: 'blurry',        label: 'Blurry',        img: billyBlurry       },
    ],
  },
]

function IllustrationCard({ name, label, img }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(name)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      title={`Copy name: ${name}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '20px 16px 14px',
        backgroundColor: copied ? 'var(--bg-success-subtle, #f0fdf4)' : '#fff',
        border: `1px solid ${copied ? 'var(--green-300, #86efac)' : 'var(--border-subtle)'}`,
        borderRadius: 12,
        cursor: 'pointer',
        transition: 'all 0.15s',
        textAlign: 'center',
        fontFamily: 'var(--font-family)',
      }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.backgroundColor = 'var(--bg-subtle)' }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.backgroundColor = '#fff' }}
    >
      <img
        src={img}
        alt={label}
        style={{ width: 80, height: 80, objectFit: 'contain', display: 'block' }}
        draggable={false}
      />
      <span style={{
        fontSize: 12,
        fontWeight: 500,
        color: copied ? 'var(--text-success, #16a34a)' : 'var(--text-subtle)',
        lineHeight: 1.3,
        maxWidth: 100,
      }}>
        {copied ? 'Copied!' : label}
      </span>
    </button>
  )
}

export default function Illustrations() {
  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
        Illustrations
      </h1>
      <p style={{ margin: '0 0 40px', fontSize: 15, color: 'var(--text-subtle)', lineHeight: 1.5 }}>
        Billy is the Billease mascot — a friendly blue bird that appears across the app to communicate status, actions, and emotion. 25 variants across 3 categories. Click any illustration to copy its name.
      </p>

      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 40 }} />

      {GROUPS.map(group => (
        <section key={group.label} style={{ marginBottom: 56 }}>
          <h2 style={{
            margin: '0 0 20px',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-base)',
          }}>
            {group.label}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))',
            gap: 12,
          }}>
            {group.items.map(item => (
              <IllustrationCard key={item.name} {...item} />
            ))}
          </div>
        </section>
      ))}

      <div style={{ height: 48 }} />
    </div>
  )
}
