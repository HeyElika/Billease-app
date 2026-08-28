/**
 * The transaction list, as it appears under a selected card.
 *
 * Shared by the card carousel and the contextual content pattern, which both
 * document the same section: the carousel for how the cards move, the pattern
 * for how the rows under them are handed over.
 *
 * Read from Financial Core, transaction-widget (49002:20669).
 */

import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import Skeleton, { SkeletonText } from '../../components/ds/Skeleton'

/**
 * The widget splits in two. The heading names the section and holds still; only
 * the list underneath belongs to one card and travels with it.
 */
function TransactionsHeading() {
  return (
    <div style={{ height: 24, display: 'flex', alignItems: 'center', gap: 'var(--space-200)', width: '100%', fontFamily: 'var(--ds-font-family)' }}>
      <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.25, color: 'var(--text-base)', whiteSpace: 'nowrap' }}>
        Transactions for this card
      </span>
    </div>
  )
}

/** The date the rows are grouped under. It names the group, so it holds still. */
function TransactionsDate() {
  return (
    <div style={{ height: 28, display: 'flex', alignItems: 'center', paddingTop: 'var(--space-300)', paddingBottom: 'var(--space-200)', width: '100%', fontFamily: 'var(--ds-font-family)' }}>
      <span style={{ fontSize: 'var(--text-md)', fontWeight: 400, lineHeight: 1.5, color: 'var(--text-base)' }}>Today</span>
    </div>
  )
}

/** The rows for one card. One block: they are never animated individually. */
function TransactionRows({ card }) {
  return (card.tx ?? []).map(tx => <TransactionItem key={tx.merchant} tx={tx} />)
}

function TransactionItem({ tx }) {
  const amountColor = tx.failed ? 'var(--text-error)' : 'var(--text-base)'
  return (
    <div style={{ display: 'flex', gap: 'var(--space-300)', alignItems: 'center', padding: 'var(--space-300) 0', width: '100%' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 'var(--radius-full)', flexShrink: 0,
        backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <BilleaseIcon name="cart" size="sm" color="var(--icon-base)" />
      </div>
      <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.5 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-base)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {tx.merchant}
        </span>
        <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {tx.meta}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.5, color: amountColor, textAlign: 'right', whiteSpace: 'nowrap' }}>
          {tx.amount}
        </span>
        {tx.failed && (
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, lineHeight: 1.25, color: 'var(--text-error)', textAlign: 'right' }}>
            Failed
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * What stands in for the rows while a card's transactions are still being
 * fetched. The DS skeleton in the shape of the row it replaces: an avatar, two
 * lines and an amount. Never a spinner, and never a collapsed section.
 */
function TransactionsSkeleton({ rows = 3 }) {
  return Array.from({ length: rows }, (_, i) => (
    <div key={i} style={{ display: 'flex', gap: 'var(--space-300)', alignItems: 'center', padding: 'var(--space-300) 0', width: '100%' }}>
      <Skeleton width={40} height={40} circle />
      <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-100)' }}>
        <SkeletonText role="primary" width="medium" />
        <SkeletonText role="supporting" width="long" />
      </div>
      <SkeletonText role="primary" width="short" />
    </div>
  ))
}

export { TransactionsHeading, TransactionsDate, TransactionRows, TransactionItem, TransactionsSkeleton }
