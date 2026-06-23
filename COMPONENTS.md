# Billease Design System — Component Reference

> Single source of truth for all DS components available in `src/components/ds/`.
> Do not invent, extend, or replace any component listed here.
> If a required component is missing, list it — do not create a substitute.

---

## Component Registry

| ID | Component | File |
|---|---|---|
| `button` | Button | `Button.jsx` |
| `nav-header` | NavHeader | `NavHeader.jsx` |
| `otp-input` | OTPInput | `OTPInput.jsx` |
| `input-field` | InputField | `InputField.jsx` |
| `link` | Link | `Link.jsx` |
| `action-bar` | ActionBar | `ActionBar.jsx` |
| `icon-only-button` | IconOnlyButton | `IconOnlyButton.jsx` |
| `alert` | Alert | `Alert.jsx` |
| `toast` | Toast | `Toast.jsx` |
| `screen-banner` | ScreenBanner (named export) | `Toast.jsx` |
| `amount-input` | AmountInput | `AmountInput.jsx` |
| `textarea-input` | TextareaInput | `TextareaInput.jsx` |
| `action-menu-item` | ActionMenuItem | `ActionMenuItem.jsx` |
| `quick-action-item` | QuickActionItem | `QuickActionItem.jsx` |

---

## Button

**File:** `src/components/ds/Button.jsx`
**Figma node:** `16:182`
**Import:** `import Button from '../../components/ds/Button'`

**Description:** Primary interactive element for user actions. Use for all CTA and action triggers.

### Variants (`type`)
| Value | Description |
|---|---|
| `primary` | Solid red fill (`--bg-primary`). Main CTA. |
| `secondary` | Outlined red border, transparent fill. Secondary action. |
| `ghost` | No border, no fill. Tertiary/inline action. |
| `ghost-destructive` | No border, red text. Destructive tertiary action. |

### Sizes (`size`)
| Value | Height | Padding | Font size |
|---|---|---|---|
| `lg` | 48px | px 20px | 16px |
| `md` | 40px | px 16px | 14px |
| `sm` | 32px | px 12px | 13px |

### States (`state`)
| Value | Visual |
|---|---|
| `default` | Normal interactive |
| `active` | Pressed/highlighted |
| `pressed` | Pressed visual (lighter) |
| `disabled` | Muted, non-interactive |
| `loading` | Shows spinner (platform-dependent) |

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | string | `'primary'` | Variant — see Variants table |
| `size` | string | `'lg'` | Size — lg/md/sm |
| `state` | string | `'default'` | Interaction state |
| `label` | string | `'Button'` | Button text |
| `iconLeft` | boolean | `false` | Show left arrow icon |
| `iconRight` | boolean | `false` | Show right arrow icon |
| `fullWidth` | boolean | `false` | 100% container width |
| `platform` | string | `'android'` | Spinner style: `android` or `ios` |
| `onClick` | function | — | Click handler |

### Usage

```jsx
<Button type="primary" size="lg" state="default" label="Continue" fullWidth />
<Button type="secondary" size="md" label="Cancel" />
<Button type="ghost" size="sm" label="Skip" />
<Button type="primary" size="lg" state="disabled" label="Submit" />
<Button type="primary" size="lg" state="loading" label="Submitting" platform="android" />
```

---

## NavHeader

**File:** `src/components/ds/NavHeader.jsx`
**Figma node:** `50:3459`
**Import:** `import NavHeader from '../../components/ds/NavHeader'`

**Description:** Top navigation bar for every screen. Always the first element below the status bar.

### Variants (`type`)
| Value | Left | Center | Right |
|---|---|---|---|
| `icon-left` | Back arrow | Title | — |
| `title-only` | — | Title | — |
| `icon-left-right` | Back arrow | Title | Close icon |
| `logo-only` | — | Logo | — |
| `icon-right` | — | Title | Close icon |
| `help` | Back arrow | Title | "Help" link |
| `w/progress` | Back arrow | Progress dots | — |
| `w/subtitle` | Back arrow | Title + Subtitle | — |

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | string | `'icon-left'` | Variant — see Variants table |
| `title` | string | `''` | Header title text |
| `subtitle` | string | `''` | Subtitle (w/subtitle only) |
| `showBorder` | boolean | `false` | Bottom border |
| `showWatermark` | boolean | `true` | Colored dot indicator at top |
| `showTitle` | boolean | `true` | Show/hide title |
| `progress` | string | `'start'` | Progress variant: `start` / `mid` / `end` (w/progress only) |
| `onBack` | function | — | Back arrow callback |
| `onClose` | function | — | Close icon callback |
| `onHelp` | function | — | Help link callback |

### Usage

```jsx
<NavHeader type="icon-left" title="Verify email" showBorder={false} onBack={() => {}} />
<NavHeader type="w/subtitle" title="Profile" subtitle="Edit your details" showBorder />
<NavHeader type="w/progress" progress="mid" onBack={() => {}} />
<NavHeader type="icon-left-right" title="Settings" onBack={() => {}} onClose={() => {}} />
```

---

## OTPInput

**File:** `src/components/ds/OTPInput.jsx`
**Figma node:** `188:2882`
**Import:** `import OTPInput from '../../components/ds/OTPInput'`

**Description:** Code entry field composed of individual cells. Use for PIN, OTP, and verification code inputs. Always use the group component — never render individual `OTPCell` directly in prototype screens.

### Variants (`type`)
| Value | Cells | Cell size |
|---|---|---|
| `PIN` | 4 | 44×50px |
| `OTP-email` | 6 | 44×50px |
| `OTP-mobile` | 4 | 44×50px |
| `code` | 8 | 32×42px |

### Cell States
| State | Visual |
|---|---|
| `default` | Gray background (`--bg-sunken`), no border |
| `focused` | White bg + 2px blue border (`--border-active`) |
| `filled` | White bg, no border, digit value |
| `success` | White bg + 2px green border (`--border-success`) + digit |
| `error` | White bg + 2px red border + digit |
| `error-active` | White bg + 2px red border, focused |
| `masked` | Filled with dot (•) |
| `masked-error` | Masked with red border |
| `disabled` | Gray bg, non-interactive |

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | string | `'OTP-mobile'` | Variant — determines cell count |
| `values` | array | `[]` | Character array, one entry per cell |
| `focusedIndex` | number | — | Index of focused cell (0-based) |
| `errorMessage` | string | `''` | Error text below cells |
| `showError` | boolean | `false` | Show error cell state |
| `disabled` | boolean | `false` | Disable all cells |
| `onChange` | function | — | Change handler |

### Usage

```jsx
<OTPInput type="OTP-email" values={['', '', '', '', '', '']} focusedIndex={0} />
<OTPInput type="OTP-email" values={['5','2','5','5','5','5']} showError={false} />
<OTPInput type="PIN" values={['', '', '', '']} focusedIndex={0} />
<OTPInput type="OTP-email" values={['1','2','3','4','5','6']} showError errorMessage="Incorrect code." />
<OTPInput type="OTP-mobile" disabled values={['', '', '', '']} />
```

---

## InputField

**File:** `src/components/ds/InputField.jsx`
**Figma node:** `109:1161`
**Import:** `import InputField from '../../components/ds/InputField'`

**Description:** Text input for forms. Covers single-line text and phone number entry.

### Variants (`variant`)
| Value | Description |
|---|---|
| `text` | Standard text input |
| `phone` | Shows country code prefix (alias for `showCountryCode=true`) |

### Sizes (`size`)
| Value | Height |
|---|---|
| `lg` | 56px |
| `md` | 48px |

### States (`state`)
| Value | Description |
|---|---|
| `default` | Empty, unfocused |
| `focused` | Active focus, empty |
| `typing` | Active focus, has value (shows clear icon) |
| `filled` | Unfocused, has value |
| `error` | Error state, empty |
| `error-filled` | Error state, has value |
| `disabled` | Non-interactive |

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | string | `'text'` | text / phone |
| `size` | string | `'lg'` | lg / md |
| `state` | string | `'default'` | Interaction state |
| `label` | string | `'Account name'` | Field label |
| `placeholder` | string | `'Enter text'` | Placeholder |
| `value` | string | `''` | Input value |
| `errorMessage` | string | — | Error text below field |
| `infoMessage` | string | — | Info text below field |
| `showLabel` | boolean | `true` | Show label row |
| `showOptional` | boolean | `false` | Show "(Optional)" tag |
| `showIcon` | boolean | `true` | Show right icon slot |
| `info` | boolean | `false` | Show info message |
| `characterLimit` | boolean | `false` | Show character count |
| `maxLength` | number | `50` | Max characters |
| `onChange` | function | — | Input change handler |
| `onFocus` | function | — | Focus handler |
| `onBlur` | function | — | Blur handler |
| `onClear` | function | — | Clear icon click (typing state) |

### Usage

```jsx
<InputField variant="text" size="md" state="focused" label="" placeholder="Enter new email" value={email} onChange={setEmail} />
<InputField variant="text" size="lg" state="error" label="Email" errorMessage="Invalid email address" value={email} />
<InputField variant="phone" size="lg" state="typing" label="Mobile number" value="917 555 0123" />
```

---

## Link

**File:** `src/components/ds/Link.jsx`
**Figma node:** `190:3261`
**Import:** `import Link from '../../components/ds/Link'`

**Description:** Inline text link. Use for secondary navigation and in-copy actions (Resend code, Change email, etc.).

### Sizes (`size`)
| Value | Font size |
|---|---|
| `md` | 16px |
| `sm` | 14px |

### States (`state`)
| Value | Description |
|---|---|
| `default` | Normal interactive |
| `active` | Highlighted |
| `disabled` | Muted, non-interactive |

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | `'Button'` | Link text |
| `size` | string | `'md'` | md / sm |
| `state` | string | `'default'` | Interaction state |
| `showIcon` | boolean | `true` | Show chevron-right icon |
| `onClick` | function | — | Click handler |

### Usage

```jsx
<Link label="Resend code" size="sm" state="default" showIcon={false} onClick={handleResend} />
<Link label="Change email" size="sm" state="default" showIcon={false} onClick={() => setScreen('change-email')} />
<Link label="View details" size="md" state="default" showIcon />
```

---

## ActionBar

**File:** `src/components/ds/ActionBar.jsx`
**Import:** `import ActionBar from '../../components/ds/ActionBar'`

**Description:** Bottom action area containing primary (and optionally secondary) buttons with optional text above/below. Includes top border option.

### Variants (`alignment`)
| Value | Description |
|---|---|
| `vertical` | Primary over secondary (stacked) |
| `horizontal` | Primary and secondary side by side |

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `alignment` | string | `'vertical'` | vertical / horizontal |
| `showSecondary` | boolean | `false` | Show secondary button |
| `textTop` | string | `''` | Text above button group |
| `textBottom` | string | `''` | Text below button group |
| `showBorder` | boolean | `false` | Show top border |
| `primaryLabel` | string | `'Button'` | Primary button text |
| `secondaryLabel` | string | `'Button'` | Secondary button text |
| `platform` | string | `'android'` | Spinner platform: android / ios |

### Usage

```jsx
<ActionBar alignment="vertical" primaryLabel="Continue" showBorder />
<ActionBar alignment="vertical" primaryLabel="Submit" showSecondary secondaryLabel="Cancel" showBorder />
<ActionBar alignment="vertical" primaryLabel="Confirm" textBottom="By continuing you agree to our Terms" showBorder />
```

---

## IconOnlyButton

**File:** `src/components/ds/IconOnlyButton.jsx`
**Import:** `import IconOnlyButton from '../../components/ds/IconOnlyButton'`

**Description:** 40×40px square button with a single icon (home-outline). Used for icon-only interactive controls.

### Variants (`type`)
| Value | Description |
|---|---|
| `secondary` | Outlined border |
| `ghost` | No border, transparent |

### States (`state`)
| Value |
|---|
| `default` |
| `active` |
| `pressed` |
| `disabled` |
| `loading` |

### Props
| Prop | Type | Default |
|---|---|---|
| `type` | string | `'secondary'` |
| `state` | string | `'default'` |
| `onClick` | function | — |

---

## Alert

**File:** `src/components/ds/Alert.jsx`
**Import:** `import Alert from '../../components/ds/Alert'`

**Description:** Inline contextual banner for page-level feedback. Not dismissible. Distinct from Toast (which is transient).

### Variants (`type`)
| Value | Color |
|---|---|
| `critical` | Red |
| `success` | Green |
| `info` | Blue |
| `warning` | Yellow |

### Props
| Prop | Type | Default |
|---|---|---|
| `type` | string | `'info'` |
| `message` | string | — |
| `children` | ReactNode | — |

### Usage

```jsx
<Alert type="warning" message="Your email may have been entered incorrectly." />
<Alert type="critical" message="Account is locked. Contact support." />
<Alert type="success" message="Email address verified." />
```

---

## Toast

**File:** `src/components/ds/Toast.jsx`
**Figma node:** `35:1200`
**Import:** `import Toast, { ScreenBanner } from '../../components/ds/Toast'`

**Description:** Transient notification. `Toast` is the base component for doc pages. `ScreenBanner` is the positioned variant used inside prototype phone screens.

### Variants (`type`)
| Value |
|---|
| `critical` |
| `success` |
| `error` |
| `info` |

### Toast Props
| Prop | Type | Default |
|---|---|---|
| `type` | string | `'info'` |
| `message` | string | — |
| `children` | ReactNode | — |
| `onClose` | function | — |

### ScreenBanner Props
| Prop | Type | Description |
|---|---|---|
| `type` | string | Toast type |
| `message` | string | Message text |
| `onClose` | function | Dismiss callback |

**ScreenBanner positioning:** `position: absolute, top: 0, left: 0, right: 0, paddingTop: 54px, paddingLeft: 20px, paddingRight: 20px, paddingBottom: 8px, zIndex: 10`. The parent container must have `position: relative` or `position: absolute`.

### Usage

```jsx
// Inside a doc page:
<Toast type="success" message="Payment submitted successfully." />

// Inside a prototype screen (parent must be position: relative):
<ScreenBanner type="success" message="Verification code has been sent" />
```

---

## AmountInput

**File:** `src/components/ds/AmountInput.jsx`
**Import:** `import AmountInput from '../../components/ds/AmountInput'`

**Description:** Specialized currency input. Full-width, large display format for amount entry.

### States (`state`)
| Value |
|---|
| `default` |
| `focused` |
| `typing` |
| `filled` |
| `error` |
| `success` |

### Props
| Prop | Type | Default |
|---|---|---|
| `state` | string | `'default'` |
| `title` | string | `'Enter amount'` |
| `amount` | string | — |
| `helperText` | string | — |
| `onChange` | function | — |
| `onFocus` | function | — |
| `onBlur` | function | — |

---

## TextareaInput

**File:** `src/components/ds/TextareaInput.jsx`
**Import:** `import TextareaInput from '../../components/ds/TextareaInput'`

**Description:** Multi-line text input. Use for remarks, notes, or reason fields.

### States (`state`)
| Value |
|---|
| `default` |
| `typing` |
| `filled` |
| `error` |

### Props
| Prop | Type | Default |
|---|---|---|
| `state` | string | `'default'` |
| `placeholder` | string | `'Type the reason'` |
| `value` | string | `''` |
| `errorMessage` | string | `'Please type the reason'` |
| `characterLimit` | boolean | `false` |
| `maxLength` | number | `50` |
| `onChange` | function | — |
| `onFocus` | function | — |
| `onBlur` | function | — |

---

## ActionMenuItem

**File:** `src/components/ds/ActionMenuItem.jsx`
**Import:** `import ActionMenuItem from '../../components/ds/ActionMenuItem'`

**Description:** List item for action menus and bottom sheets. 320px wide, 60px tall.

### States (`state`)
| Value | Description |
|---|---|
| `Default` | Normal interactive |
| `disabled` | Muted, non-interactive |
| `danger` | Red destructive state |

### Props
| Prop | Type | Default |
|---|---|---|
| `state` | string | `'Default'` |
| `icon` | string | `'start-outline'` (BilleaseIcon name) |
| `label` | string | `'Label'` |
| `description` | string | `''` |
| `showArrow` | boolean | `true` |
| `showDescription` | boolean | `false` |
| `onClick` | function | — |

### Usage

```jsx
<ActionMenuItem icon="edit-outline" label="Edit details" onClick={handleEdit} />
<ActionMenuItem icon="trash-outline" label="Delete account" state="danger" />
<ActionMenuItem icon="lock" label="Change PIN" description="Last changed 30 days ago" showDescription />
```

---

## QuickActionItem

**File:** `src/components/ds/QuickActionItem.jsx`
**Import:** `import QuickActionItem from '../../components/ds/QuickActionItem'`

**Description:** Compact vertical icon+label tile for quick action grids. 72px wide.

### States (`state`)
| Value |
|---|
| `Default` |
| `disabled` |

### Props
| Prop | Type | Default |
|---|---|---|
| `state` | string | `'Default'` |
| `icon` | string | `'installment-outline'` (BilleaseIcon name) |
| `label` | string | `'Pay'` |
| `onClick` | function | — |

### Usage

```jsx
<QuickActionItem icon="payment-method" label="Pay" onClick={handlePay} />
<QuickActionItem icon="qr" label="Scan" onClick={handleScan} />
<QuickActionItem icon="statement-outline" label="Statement" state="disabled" />
```

---

# Missing Components

Components, variants, or tokens referenced in Figma but not yet implemented in code.

## Missing Components
- `NavigationProgress` — exists as a file but no public documentation; verify implementation before use
- `NavigationWatermark` — exists as a file but no public documentation; verify implementation before use
- `PageHeader` — exists as a file but no public documentation; verify implementation before use
- Modal/Bottom sheet — no dedicated DS component exists
- Card/Account — no dedicated DS component exists
- Card/Transaction — no dedicated DS component exists
- Empty state — no dedicated DS component exists
- Tab bar / Bottom navigation — no dedicated DS component exists

## Missing Variants
- `Button/gradient` — referenced in CLAUDE.md `type` options but not confirmed in source
- `Button/ghost-destructive` size `md` — unsupported combination
- `IconOnlyButton` — only ships with `home-outline` icon; custom icon unsupported

## Missing Tokens
- Elevation/shadow tokens — not defined in `index.css` (shadows are hardcoded in components)
- Line-height tokens — not defined; components use unitless `1.5` / `1.25` inline
- Letter-spacing tokens — not defined

## Missing Documentation
- `Alert` — Figma node ID not yet recorded
- `ActionBar` — Figma node ID not yet recorded
- `IconOnlyButton` — Figma node ID not yet recorded
- `AmountInput` — Figma node ID not yet recorded
- `TextareaInput` — Figma node ID not yet recorded
- `ActionMenuItem` — Figma node ID not yet recorded
- `QuickActionItem` — Figma node ID not yet recorded
