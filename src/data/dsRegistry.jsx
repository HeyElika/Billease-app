/**
 * dsRegistry — every Figma component set that has been migrated to the platform.
 *
 * Adding a component is one entry here plus its file in src/components/ds/.
 * Explorer resolves this map before falling back to the "not yet implemented"
 * placeholder, so a component is considered migrated only once it is listed.
 *
 *   id      Figma node id, matching src/data/components.js
 *   axes    the component set's variant properties, exactly as Figma names them
 *   render  props -> element
 */

import StatusBadge, { STATUS_BADGE_SAMPLE_LABEL } from '../components/ds/StatusBadge'
import CountBadge from '../components/ds/CountBadge'
import ItemSpecialBadge from '../components/ds/ItemSpecialBadge'
import Checkbox, { CheckboxParagraph } from '../components/ds/Checkbox'
import RadioButton from '../components/ds/RadioButton'

export const dsRegistry = {
  '8720:535': {
    name: 'status-badge',
    description: 'Compact status pill used on statements and loan cards. The tone carries the meaning, so the label always states the status in words as well.',
    axes: [
      { prop: 'type', label: 'Types', values: ['grace-on', 'ready', 'due', 'overdue'], default: 'grace-on' },
    ],
    sampleProps: ({ type }) => ({ label: STATUS_BADGE_SAMPLE_LABEL[type] ?? 'Due May 31' }),
    render: props => <StatusBadge {...props} />,
    props: [
      { name: 'type',  type: "'grace-on' | 'ready' | 'due' | 'overdue'", default: "'grace-on'", description: 'Status tone. Figma values ("Grace on") are accepted too.' },
      { name: 'label', type: 'string', default: "'Due May 31'", description: 'Badge text. Always spell out the status.' },
    ],
  },

  '8005:6802': {
    name: 'count-badge',
    description: 'Square badge for a count of items in a given state. The md size carries a number up to three digits; the sm size is used inline in list rows.',
    axes: [
      { prop: 'type', label: 'Types', values: ['neutral', 'overdue', 'promise-to-pay', 'upcoming', 'pending', 'proof', 'default-sof'], default: 'neutral' },
      { prop: 'size', label: 'Sizes', values: ['md', 'sm'], default: 'md' },
    ],
    sampleProps: ({ type }) => ({ count: type === 'pending' ? 888 : type === 'proof' ? 88 : 4 }),
    render: props => <CountBadge {...props} />,
    props: [
      { name: 'type',  type: "'neutral' | 'overdue' | 'promise-to-pay' | 'upcoming' | 'pending' | 'proof' | 'default-sof'", default: "'neutral'", description: 'Tone of the badge.' },
      { name: 'size',  type: "'md' | 'sm'", default: "'md'", description: '28px or 24px square.' },
      { name: 'count', type: 'number', default: '2', description: 'Number shown. Ignored by the default-sof variant, which shows an icon.' },
      { name: 'icon',  type: 'string', default: "'cash'", description: 'BilleaseIcon name, default-sof variant only.' },
    ],
  },

  '220:10713': {
    name: 'badge/item-special',
    description: 'Corner ribbon that flags a product tile as boosted or recommended. Only one special badge per tile.',
    axes: [
      { prop: 'type', label: 'Types', values: ['limit-boost', 'recommended'], default: 'limit-boost' },
    ],
    render: props => <ItemSpecialBadge {...props} />,
    props: [
      { name: 'type',  type: "'limit-boost' | 'recommended'", default: "'limit-boost'", description: 'Which ribbon to show. Sets the corner radii, fill and type style.' },
      { name: 'label', type: 'string', default: 'per type', description: 'Overrides the default copy ("Limit Boost\u2122" / "Recommended").' },
    ],
  },

  '183:1591': {
    name: 'checkbox-label',
    description: 'Checkbox with a single-line label and optional description. The error state moves the message below the row so the label stays aligned to the box.',
    axes: [
      { prop: 'state', label: 'States', values: ['default', 'checked', 'error'], default: 'default' },
    ],
    render: props => <Checkbox {...props} />,
    cellWidth: 200,
    props: [
      { name: 'state',        type: "'default' | 'checked' | 'error'", default: "'default'", description: 'Box and message state.' },
      { name: 'label',        type: 'string', default: "'Placeholder'", description: 'Single-line label.' },
      { name: 'description',  type: 'string', default: '—', description: 'Optional second line at text/subtle.' },
      { name: 'errorMessage', type: 'string', default: "'Error message alongside the input'", description: 'Shown below the row in the error state.' },
      { name: 'disabled',     type: 'boolean', default: 'false', description: 'Dims the box and blocks onChange.' },
      { name: 'onChange',     type: '(checked: boolean) => void', default: '—', description: 'Makes the row interactive.' },
    ],
  },

  '183:2213': {
    name: 'checkbox-paragraph',
    description: 'Checkbox for consent copy that wraps over several lines. The first line aligns to the box via the auto-layout gutter.',
    axes: [
      { prop: 'state', label: 'States', values: ['default', 'checked', 'error'], default: 'default' },
    ],
    render: props => <CheckboxParagraph {...props} />,
    cellWidth: 300,
    props: [
      { name: 'state',        type: "'default' | 'checked' | 'error'", default: "'default'", description: 'Box and message state.' },
      { name: 'text',         type: 'string', default: 'sample consent copy', description: 'Wrapping paragraph at 14px.' },
      { name: 'errorMessage', type: 'string', default: "'Error message alongside the input'", description: 'Shown below the row in the error state.' },
      { name: 'onChange',     type: '(checked: boolean) => void', default: '—', description: 'Makes the row interactive.' },
    ],
  },

  '188:2593': {
    name: 'radio-button',
    description: 'Single-choice control. Always used inside a radio group, never on its own to toggle a setting.',
    axes: [
      { prop: 'state',    label: 'States',   values: ['default', 'selected'], default: 'default' },
      { prop: 'size',     label: 'Sizes',    values: ['md', 'sm'], default: 'md' },
      { prop: 'disabled', label: 'Disabled', values: ['false', 'true'], default: 'false' },
    ],
    render: ({ disabled, ...rest }) => <RadioButton {...rest} disabled={disabled === true || disabled === 'true'} />,
    props: [
      { name: 'state',    type: "'default' | 'selected'", default: "'default'", description: 'Selection state.' },
      { name: 'size',     type: "'md' | 'sm'", default: "'md'", description: '24px or 20px box.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Renders at 50% opacity and blocks onClick.' },
      { name: 'onClick',  type: '() => void', default: '—', description: 'Makes the control interactive.' },
    ],
  },
}

/** TOC sections for a registry entry, in render order. */
export function sectionsForEntry(entry) {
  const sections = (entry.axes ?? []).map(axis => ({ id: axis.prop, label: axis.label ?? axis.prop }))
  if ((entry.axes ?? []).length > 1) sections.push({ id: 'combinations', label: 'All combinations' })
  ;(entry.extraSections ?? []).forEach(s => sections.push({ id: s.id, label: s.label }))
  if (entry.props?.length > 0) sections.push({ id: 'props', label: 'Props' })
  sections.push({ id: 'changelog', label: 'Changelog' })
  return sections
}
