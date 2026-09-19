// url=https://www.figma.com/design/qESeTFW1GEEosrYnm4Hu3b/Billease-Library--Native-app-?node-id=16-182
// source=src/components/ds/Button.jsx
// component=Button
import figma from 'figma'

const instance = figma.selectedInstance

// TEXT layer "Button" carries the label; it is a layer, not a component property.
const labelLayer = instance.findText('Button')
const label = labelLayer && labelLayer.type === 'TEXT' ? labelLayer.textContent : ''

// VARIANT "type": all 5 Figma options map 1:1 onto the code `type` prop.
const type = instance.getEnum('type', {
  gradient: 'gradient',
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'ghost',
  'ghost-destructive': 'ghost-destructive',
})

// VARIANT "size" is 1:1 with the code `size` prop.
const size = instance.getEnum('size', {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
})

// VARIANT "state" is 1:1 with the code `state` prop.
const state = instance.getEnum('state', {
  default: 'default',
  active: 'active',
  pressed: 'pressed',
  disabled: 'disabled',
  loading: 'loading',
})

// BOOLEAN "icon left" / "icon right": the code component takes booleans and
// renders BilleaseIcon itself, so the nested swap instance has no code prop.
const iconLeft = instance.getBoolean('icon left')
const iconRight = instance.getBoolean('icon right')

export default {
  example: figma.code`<Button
  type="${type}"
  size="${size}"
  state="${state}"
  label="${label}"
  ${iconLeft ? 'iconLeft' : ''}
  ${iconRight ? 'iconRight' : ''}
/>`,
  imports: ["import Button from '../components/ds/Button'"],
  id: 'button',
  metadata: { nestable: false },
}
