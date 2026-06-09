/**
 * ActionBar (action-bar) — Billease Design System
 * Source: Figma node 86:742, file qESeTFW1GEEosrYnm4Hu3b
 *
 * COMPONENT_SET properties:
 *   alignment         VARIANT  vertical | horizontal  (default: vertical)
 *   secondary button  BOOLEAN  default: false
 *   text-top          BOOLEAN  default: false
 *   text-bottom       BOOLEAN  default: false
 *   Show border       BOOLEAN  default: false
 */
import Button from './Button'

// Layout specs from Figma (component 83:644 / 86:743)
const PADDING_TOP    = 12   // VariableID:2:726
const PADDING_H      = 20   // VariableID:2:734
const PADDING_BOTTOM = 20   // VariableID:2:734
const OUTER_GAP      = 12   // VariableID:2:726 — between text row and button group
const BUTTON_GAP     = 16   // VariableID:2:730 — between buttons in group

export default function ActionBar({
  alignment = 'vertical',     // vertical | horizontal
  showSecondary = false,       // secondary button#86:11
  textTop = '',                // text-top#190:31 — shown above button group
  textBottom = '',             // text-bottom#2725:0 — shown below button group
  showBorder = false,          // Show border#86:9 — 1px border-subtle at top
  primaryLabel = 'Button',
  secondaryLabel = 'Button',
  platform = 'android',
}) {
  const isHorizontal = alignment === 'horizontal'

  // Text: Source Sans Pro 13px / 400 / lineHeight 19.5px / var(--text-subtle) = #606C79
  const textStyle = {
    fontFamily: 'var(--ds-font-family)',   // VariableID:2:364
    fontSize: 13,                           // VariableID:2:379
    fontWeight: 400,                        // VariableID:2:378
    lineHeight: '19.5px',
    color: 'var(--text-subtle)',            // VariableID:5:17 = #606C79
    textAlign: 'center',
    display: 'block',
  }

  return (
    <div style={{
      position: 'relative',
      backgroundColor: 'var(--bg-base)',    // VariableID:5:68 = #FFFFFF
      paddingTop: PADDING_TOP,
      paddingLeft: PADDING_H,
      paddingRight: PADDING_H,
      paddingBottom: PADDING_BOTTOM,
      display: 'flex',
      flexDirection: 'column',
      gap: OUTER_GAP,
    }}>

      {/* Show border#86:9 — 1px solid border-subtle, positioned at top
          color: var(--border-subtle) = #EAEDF0 (VariableID:5:1537) */}
      {showBorder && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 1,
          backgroundColor: 'var(--border-subtle)',
        }} />
      )}

      {/* text-top#190:31 */}
      {textTop && <span style={textStyle}>{textTop}</span>}

      {/* Button group — vertical: primary on top, secondary below (both FILL width)
                       horizontal: secondary left, primary right (both flex:1) */}
      <div style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        gap: BUTTON_GAP,
      }}>
        {isHorizontal ? (
          <>
            {showSecondary && (
              <Button type="secondary" size="lg" state="default" label={secondaryLabel} platform={platform} fullWidth />
            )}
            <Button type="primary" size="lg" state="default" label={primaryLabel} platform={platform} fullWidth />
          </>
        ) : (
          <>
            <Button type="primary" size="lg" state="default" label={primaryLabel} platform={platform} fullWidth />
            {showSecondary && (
              <Button type="secondary" size="lg" state="default" label={secondaryLabel} platform={platform} fullWidth />
            )}
          </>
        )}
      </div>

      {/* text-bottom#2725:0 */}
      {textBottom && <span style={textStyle}>{textBottom}</span>}
    </div>
  )
}
