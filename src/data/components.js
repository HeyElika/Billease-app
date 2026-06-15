// Sourced from component-index.md (Billease Library — Figma file qESeTFW1GEEosrYnm4Hu3b)
// 138 component sets, 857 total components
// Never add entries that don't exist in component-index.md

export const componentIndex = [
  // ↳ Accordion
  { id: '3978:4668', name: 'accordion', category: 'Accordion', variants: 4, variantProps: { state: ['collapsed', 'expanded - months'] } },

  // ↳ Alert
  { id: '228:11126', name: 'alert', category: 'Alert', variants: 0, variantProps: {} },

  // ↳ Android
  { id: '8493:750', name: 'dialog', category: 'Android', variants: 4, variantProps: { type: ['authenticate', 'camera-photo', 'face-unlock', 'fingerprint'] } },
  { id: '35:809', name: 'keyboard', category: 'Android', variants: 3, variantProps: { type: ['default', 'keypad', 'suggest'] } },
  { id: '5408:1078', name: 'share', category: 'Android', variants: 2, variantProps: { type: ['PDF', 'default'] } },
  { id: '16:1582', name: 'status-bar', category: 'Android', variants: 4, variantProps: { 'dark mode': ['false', 'true'], os: ['android', 'iOS'] } },

  // ↳ Avatar (new)
  { id: '11078:4331', name: 'avatar', category: 'Avatar', variants: 0, variantProps: {} },
  { id: '11062:4177', name: 'avatar-badge', category: 'Avatar', variants: 0, variantProps: {} },

  // ↳ Badge
  { id: '220:10713', name: 'badge/item-special', category: 'Badge', variants: 2, variantProps: { type: ['Recommended', 'limit-boost'] } },
  { id: '8005:6802', name: 'count-badge', category: 'Badge', variants: 7, variantProps: { Type: ['neutral', 'overdue', 'pending', 'promise-to-pay', 'proof', 'upcoming'], size: ['md', 'sm'] } },
  { id: '8720:535', name: 'status-badge', category: 'Badge', variants: 4, variantProps: { type: ['Due', 'Grace on', 'Overdue', 'Ready'] } },

  // ↳ Banners
  { id: '9978:3297', name: 'banner/activity', category: 'Banners', variants: 4, variantProps: { variant: ['cash-loans', 'deals', 'mobile-load', 'savings'] } },
  { id: '21:2084', name: 'banner/bank', category: 'Banners', variants: 2, variantProps: { type: ['frozen'] } },
  { id: '193:6410', name: 'banner/campaign', category: 'Banners', variants: 3, variantProps: { variant: ['image 1', 'image 2', 'image 3'] } },
  { id: '8005:5550', name: 'banner/fomo', category: 'Banners', variants: 5, variantProps: { variant: ['Fomo-1', 'Fomo-2', 'Fomo-3', 'Fomo-4', 'Fomo-5'] } },
  { id: '20:2093', name: 'banner/home', category: 'Banners', variants: 3, variantProps: { type: ['credit-balance', 'limit-boost', 'saving-balance'] } },
  { id: '26:687', name: 'banner/home/balance', category: 'Banners', variants: 4, variantProps: { Mode: ['On-dark', 'On-light'], balance: ['off', 'on'] } },
  { id: '47:2556', name: 'banner/home/entity-row', category: 'Banners', variants: 2, variantProps: { type: ['text-only'] } },
  { id: '16:2015', name: 'banner/info', category: 'Banners', variants: 18, variantProps: { status: ['activate', 'approved-bank', 'approved-credit', 'cancelled', 'in-progress', 'need-more-info', 'need-more-info-2', 'open-bank', 'paused', 'rejected', 'review'], version: ['2025', '2026'] } },

  // ↳ Buttons
  { id: '11079:3310', name: 'action-menu', category: 'Buttons', variants: 0, variantProps: {} },
  { id: '16:182', name: 'button', category: 'Buttons', variants: 61, variantProps: { size: ['lg', 'md', 'sm'], state: ['active', 'default', 'disabled', 'loading', 'pressed'], type: ['ghost', 'ghost-destructive', 'gradient', 'primary', 'secondary'] } },
  { id: '190:3261', name: 'link', category: 'Buttons', variants: 6, variantProps: { size: ['md', 'sm'], state: ['active', 'default', 'disabled'] } },
  { id: '11079:851', name: 'quick-action', category: 'Buttons', variants: 0, variantProps: {} },
  { id: '11079:718', name: 'quick-action/item', category: 'Buttons', variants: 2, variantProps: { state: ['Default', 'disabled'] } },

  // ↳ Cards
  { id: '7985:4510', name: 'card/balance', category: 'Cards', variants: 8, variantProps: { Type: ['LB-active', 'bottom-msg', 'cooldown', 'default', 'fomo', 'overdue', 'ready-to-use'] } },
  { id: '9753:1663', name: 'card/e-wallet-provider', category: 'Cards', variants: 3, variantProps: { state: ['active', 'default', 'disabled'] } },
  { id: '208:8461', name: 'card/installment-info', category: 'Cards', variants: 3, variantProps: { state: ['code-valid', 'default', 'promo-active'] } },
  { id: '9753:1667', name: 'card/link-bank', category: 'Cards', variants: 3, variantProps: { Active: ['False', 'True'], state: ['bank-linked', 'default', 'linked'] } },
  { id: '224:10738', name: 'card/options', category: 'Cards', variants: 2, variantProps: { state: ['default', 'selected'] } },
  { id: '9752:3137', name: 'card/payment-method', category: 'Cards', variants: 10, variantProps: { Active: ['False', 'True'], type: ['bank-transfer', 'counter', 'e-wallet', 'online-banking', 'qrph'] } },
  { id: '9752:3352', name: 'card/payment-partner', category: 'Cards', variants: 2, variantProps: { Active: ['False', 'True'] } },
  { id: '8005:6960', name: 'payment-reminder-statuses', category: 'Cards', variants: 5, variantProps: { type: ['overdue', 'pending', 'promise-to-pay', 'proof', 'upcoming'] } },
  { id: '8720:3672', name: 'statement', category: 'Cards', variants: 4, variantProps: { state: ['due-date', 'grace-on', 'overdue', 'paid fully'] } },
  { id: '8736:7013', name: 'statement/summary-card', category: 'Cards', variants: 2, variantProps: { status: ['grace-active', 'grace-lost'] } },

  // ↳ Carousel
  { id: '3269:8630', name: 'carousel/activity', category: 'Carousel', variants: 4, variantProps: { banner: ['1', '2', '3', '4'] } },
  { id: '190:3413', name: 'slider-dots', category: 'Carousel', variants: 4, variantProps: { mode: ['on-dark', 'on-light'], state: ['active', 'inactive'] } },

  // ↳ Checkbox
  { id: '183:1591', name: 'checkbox-label', category: 'Checkbox', variants: 3, variantProps: { state: ['checked', 'default', 'error'] } },
  { id: '183:2213', name: 'checkbox-paragraph', category: 'Checkbox', variants: 3, variantProps: { state: ['checked', 'default', 'error'] } },

  // ↳ Dropdown
  { id: '6809:94', name: 'dropdown/field', category: 'Dropdown', variants: 8, variantProps: { size: ['lg', 'md'], state: ['default', 'disabled', 'error', 'selected'] } },
  { id: '10282:2743', name: 'dropdown/list', category: 'Dropdown', variants: 2, variantProps: { state: ['default', 'selected'] } },

  // ↳ Empty state
  { id: '51:1546', name: 'empty-state', category: 'Empty state', variants: 4, variantProps: { type: ['empty-card', 'empty-error', 'text-only'] } },

  // ↳ Filter & Chips
  { id: '56:312', name: 'filter/item', category: 'Filter & Chips', variants: 0, variantProps: {} },

  // ↳ General
  { id: '8592:2434', name: 'ellipse', category: 'General', variants: 2, variantProps: { size: ['lg', 'md'] } },
  { id: '8493:5431', name: 'overlay-scan', category: 'General', variants: 2, variantProps: { type: ['ID', 'QR'] } },
  { id: '8609:463', name: 'overlay-selfie', category: 'General', variants: 3, variantProps: { size: ['md', 'sm'], type: ['animated', 'default'] } },
  { id: '8717:3991', name: 'rgb-check', category: 'General', variants: 4, variantProps: { screen: ['1', '2', '3', '4'] } },

  // ↳ Hero
  { id: '24:4456', name: 'hero/credit', category: 'Hero', variants: 4, variantProps: { type: ['frozen'] } },
  { id: '7985:5826', name: 'hero/loans', category: 'Hero', variants: 3, variantProps: { Type: ['Loans', 'credit-line'] } },
  { id: '24:4460', name: 'hero/savings', category: 'Hero', variants: 3, variantProps: { type: ['frozen'] } },

  // ↳ Iconography
  { id: '229:12184', name: 'ID-requirements', category: 'Iconography', variants: 0, variantProps: {} },
  { id: '6567:245', name: 'NID', category: 'Iconography', variants: 0, variantProps: {} },
  { id: '11039:214', name: '[android] spinner', category: 'Iconography', variants: 4, variantProps: { Variant: ['1', '2', '3', '4'] } },
  { id: '193:6581', name: 'billease', category: 'Iconography', variants: 0, variantProps: {} },
  { id: '16:1998', name: 'billy', category: 'Iconography', variants: 0, variantProps: {} },
  { id: '4:56', name: 'icon-placeholder', category: 'Iconography', variants: 0, variantProps: {} },
  { id: '2632:732', name: 'loading', category: 'Iconography', variants: 0, variantProps: {} },
  { id: '47:2495', name: 'logo', category: 'Iconography', variants: 0, variantProps: {} },
  { id: '8386:1526', name: 'onboarding', category: 'Iconography', variants: 0, variantProps: {} },
  { id: '8386:2154', name: 'other', category: 'Iconography', variants: 0, variantProps: {} },
  { id: '16:1156', name: 'products', category: 'Iconography', variants: 0, variantProps: {} },
  { id: '2430:1071', name: 'spinner-animation', category: 'Iconography', variants: 0, variantProps: {} },
  { id: '2430:1153', name: 'spinner-animation-dark', category: 'Iconography', variants: 0, variantProps: {} },

  // ↳ Input
  { id: '51:1615', name: 'input/amount', category: 'Input', variants: 6, variantProps: { state: ['default', 'error', 'filled', 'focused', 'success', 'typing'] } },
  { id: '188:2882', name: 'input/code', category: 'Input', variants: 7, variantProps: { state: ['default', 'disabled', 'error', 'filled', 'focused', 'masked', 'masked-error'] } },
  { id: '109:1161', name: 'input/field', category: 'Input', variants: 14, variantProps: { size: ['lg', 'md'], state: ['default', 'disabled', 'error', 'error-filled', 'filled', 'focused', 'typing'] } },
  { id: '5529:781', name: 'input/text', category: 'Input', variants: 4, variantProps: { State: ['Default', 'Error', 'Filled', 'Typing'] } },

  // ↳ List
  { id: '10673:1443', name: 'date-separator', category: 'List', variants: 2, variantProps: { size: ['md', 'sm'] } },
  { id: '2755:1118', name: 'general/list/item', category: 'List', variants: 4, variantProps: { size: ['lg', 'md'], state: ['default', 'selected'] } },
  { id: '11134:3552', name: 'list/w-logo', category: 'List', variants: 0, variantProps: {} },
  { id: '11108:1097', name: 'selection row', category: 'List', variants: 0, variantProps: {} },
  { id: '11134:986', name: 'transaction-avatar', category: 'List', variants: 2, variantProps: { size: ['md', 'sm'] } },
  { id: '8728:4542', name: 'transaction-widget', category: 'List', variants: 2, variantProps: { state: ['empty', 'list'] } },
  { id: '50:3319', name: 'transaction/item', category: 'List', variants: 5, variantProps: { status: ['failed', 'inbound', 'outbound', 'pending', 'refund'] } },

  // ↳ Loans
  { id: '10938:1822', name: 'loan/card', category: 'Loans', variants: 3, variantProps: { state: ['default', 'overdue', 'promise-to-pay'] } },
  { id: '10938:2043', name: 'loan/card/auto-renew', category: 'Loans', variants: 2, variantProps: { type: ['installment', 'loan'] } },
  { id: '10938:1874', name: 'loan/card/description', category: 'Loans', variants: 5, variantProps: { type: ['convert', 'convert-loading', 'converted', 'grace-note', 'verifying'] } },
  { id: '10938:1833', name: 'loan/card/item', category: 'Loans', variants: 5, variantProps: { state: ['closed', 'default', 'default+info', 'warning', 'warning+info'] } },
  { id: '6526:1762', name: 'loan/details/convert', category: 'Loans', variants: 2, variantProps: { state: ['default', 'processing'] } },
  { id: '10938:2026', name: 'loan/history/accordion', category: 'Loans', variants: 2, variantProps: { type: ['collapse', 'expand'] } },
  { id: '10938:1889', name: 'loan/schedule/item', category: 'Loans', variants: 4, variantProps: { type: ['next', 'overdue', 'paid', 'upcoming'] } },
  { id: '10938:1918', name: 'loan/schedule/list', category: 'Loans', variants: 2, variantProps: { length: ['long', 'short'] } },
  { id: '10938:1795', name: 'loan/schedule/progress', category: 'Loans', variants: 11, variantProps: { connector: ['default', 'leading', 'terminal'], status: ['completed', 'current', 'overdue', 'upcoming'] } },

  // ↳ Modal
  { id: '27:588', name: 'bottom-sheet', category: 'Modal', variants: 16, variantProps: { type: ['LB-cancel', 'LB-complete', 'LB-offer', 'T&C', 'cool-down', 'installment-list', 'instructions', 'open-bank', 'order-merchant', 'order-qrph', 'payment-breakdown', 'payment-method', 'payment-schedule', 'payment-upcoming', 'province-list', 'text'] } },
  { id: '3277:986', name: 'modal-overlay', category: 'Modal', variants: 4, variantProps: { type: ['bottom-sheet', 'dialog', 'keyboard', 'native-overlay'] } },

  // ↳ Navigation
  { id: '7985:897', name: 'navigation/header (home)', category: 'Navigation', variants: 2, variantProps: { state: ['Default'], version: ['2025', '2026'] } },
  { id: '50:3459', name: 'navigation/header', category: 'Navigation', variants: 8, variantProps: { type: ['help', 'icon-left', 'icon-left-right', 'icon-right', 'logo-only', 'title-only'] } },
  { id: '16:904', name: 'navigation/item', category: 'Navigation', variants: 6, variantProps: { state: ['active', 'default', 'disabled'], version: ['2025', '2026'] } },
  { id: '24:3036', name: 'navigation/menu', category: 'Navigation', variants: 8, variantProps: { type: ['home', 'loans', 'support', 'transactions'], version: ['2025', '2026'] } },

  // ↳ Notification banner
  { id: '35:1200', name: 'notification-banner', category: 'Notification banner', variants: 0, variantProps: {} },
  { id: '10063:175', name: 'notification-banner-overlay', category: 'Notification banner', variants: 2, variantProps: { 'Long message': ['False', 'True'] } },

  // ↳ Pay now
  { id: '8798:9168', name: 'pay-now/selection', category: 'Pay now', variants: 9, variantProps: { Status: ['Due', 'Overdue', 'P2P'], state: ['Default', 'collapsed', 'expanded'] } },

  // ↳ Payment
  { id: '11134:1144', name: 'Detail-row', category: 'Payment', variants: 0, variantProps: {} },
  { id: '11148:3945', name: 'Transaction-details', category: 'Payment', variants: 0, variantProps: {} },
  { id: '11134:1216', name: 'Transfer-summary', category: 'Payment', variants: 0, variantProps: {} },
  { id: '11134:1365', name: 'Transfer/payment-result', category: 'Payment', variants: 0, variantProps: {} },
  { id: '11134:1217', name: 'Transfer/payment-review', category: 'Payment', variants: 0, variantProps: {} },
  { id: '2766:2817', name: 'card/payment-details', category: 'Payment', variants: 2, variantProps: { type: ['fixed', 'input'] } },
  { id: '3062:3082', name: 'card/payment-method (status)', category: 'Payment', variants: 4, variantProps: { status: ['enough-credit', 'enough-savings', 'not-enough-credit', 'not-enough-savings'] } },
  { id: '3062:2404', name: 'card/payment-result', category: 'Payment', variants: 4, variantProps: { status: ['fail', 'loading', 'pending', 'success'] } },
  { id: '3270:9414', name: 'card/payment-review', category: 'Payment', variants: 3, variantProps: { type: ['credit', 'installment', 'savings'] } },
  { id: '5029:785', name: 'card/payment-status', category: 'Payment', variants: 4, variantProps: { status: ['completed', 'failed', 'loading', 'pending'] } },
  { id: '3267:1120', name: 'card/recipient', category: 'Payment', variants: 4, variantProps: { type: ['default', 'mobile_load', 'p2p'] } },
  { id: '6505:2677', name: 'card/summary', category: 'Payment', variants: 2, variantProps: { type: ['installment', 'transaction'] } },
  { id: '8802:9354', name: 'card/summary/payment', category: 'Payment', variants: 3, variantProps: { state: ['collapsed', 'expanded'], type: ['downpayment', 'loans+creditline'] } },
  { id: '3267:1621', name: 'card/summary/review', category: 'Payment', variants: 4, variantProps: { type: ['credit-one time', 'installment', 'savings', 'send'] } },
  { id: '8736:6879', name: 'card/summary/statement', category: 'Payment', variants: 2, variantProps: { type: ['minimum', 'summary'] } },
  { id: '5029:817', name: 'payment/method', category: 'Payment', variants: 3, variantProps: { type: ['credit', 'refund', 'savings'] } },
  { id: '5029:799', name: 'paymet/fee', category: 'Payment', variants: 2, variantProps: { type: ['no-fee', 'with-fee'] } },
  { id: '11079:2749', name: 'receipent-item', category: 'Payment', variants: 0, variantProps: {} },
  { id: '11134:535', name: 'receipent-summary', category: 'Payment', variants: 0, variantProps: {} },

  // ↳ Plan selection
  { id: '8000:3222', name: 'plan/favorites/group', category: 'Plan selection', variants: 2, variantProps: { type: ['on_grey', 'on_white'] } },
  { id: '8000:3252', name: 'plan/item', category: 'Plan selection', variants: 2, variantProps: { state: ['disabled', 'enabled'] } },
  { id: '7903:3106', name: 'plan/package', category: 'Plan selection', variants: 1, variantProps: { type: ['amount'] } },

  // ↳ QR
  { id: '5469:1217', name: 'qr/payment', category: 'QR', variants: 2, variantProps: { 'QR code': ['false', 'true'] } },
  { id: '53:176', name: 'qr/skeleton', category: 'QR', variants: 2, variantProps: { step: ['end', 'start'] } },

  // ↳ Quick links
  { id: '7985:1814', name: 'product-items', category: 'Quick links', variants: 3, variantProps: { version: ['2025', '2026', '2026 - loans'] } },

  // ↳ Radio button
  { id: '9676:1388', name: 'pay-now/action', category: 'Radio button', variants: 2, variantProps: { state: ['default', 'selected'] } },
  { id: '8731:6026', name: 'pay-now/selection (radio)', category: 'Radio button', variants: 4, variantProps: { type: ['Credit', 'Loans', 'credit-line-error', 'loans-error'] } },
  { id: '9676:1395', name: 'pay-now/selection/item', category: 'Radio button', variants: 5, variantProps: { State: ['Active', 'Default', 'Disabled'], type: ['Default'] } },
  { id: '188:2593', name: 'radio-button', category: 'Radio button', variants: 8, variantProps: { Disabled: ['False', 'True'], size: ['md', 'sm'], state: ['default', 'selected'] } },
  { id: '188:2864', name: 'radio-button/group', category: 'Radio button', variants: 2, variantProps: { alignment: ['horizontal', 'vertical'] } },
  { id: '188:2583', name: 'radio-button/label', category: 'Radio button', variants: 6, variantProps: { state: ['default', 'error', 'selected'], style: ['rectangular', 'rounded'] } },
  { id: '6494:1025', name: 'radio-button/selection/installments', category: 'Radio button', variants: 2, variantProps: { State: ['Default', 'selected'] } },

  // ↳ Search
  { id: '97:1512', name: 'search/field', category: 'Search', variants: 10, variantProps: { size: ['field', 'md', 'sm'], state: ['default', 'disabled', 'filled', 'focused', 'search', 'typing'] } },
  { id: '8175:3089', name: 'search/list/address', category: 'Search', variants: 2, variantProps: { state: ['default', 'empty'] } },
  { id: '189:3139', name: 'search/results', category: 'Search', variants: 4, variantProps: { size: ['lg', 'md'], state: ['default', 'selected'] } },

  // ↳ Segmented controls
  { id: '16:1573', name: 'item (segmented)', category: 'Segmented controls', variants: 2, variantProps: { state: ['active', 'default'] } },

  // ↳ Selector
  { id: '98:707', name: 'selector', category: 'Selector', variants: 3, variantProps: { state: ['default', 'selected'] } },

  // ↳ Slider
  { id: '24:5083', name: 'slider/balance-bar', category: 'Slider', variants: 8, variantProps: { Version: ['2025', '2026'], status: ['empty', 'full', 'mid'], type: ['limit', 'limit-used'] } },
  { id: '8728:4918', name: 'slider/progress', category: 'Slider', variants: 3, variantProps: { state: ['end', 'mid', 'start'] } },

  // ↳ Tabs
  { id: '7985:1185', name: 'tab/group', category: 'Tabs', variants: 2, variantProps: { Type: ['Default', 'on-dark'], size: ['md', 'sm'] } },
  { id: '43:2261', name: 'tab/item', category: 'Tabs', variants: 9, variantProps: { 'On-dark': ['False', 'True'], size: ['md', 'sm'], state: ['active', 'default', 'disabled'], type: ['logo', 'text'] } },

  // ↳ iOS
  { id: '7609:479', name: 'biometrics', category: 'iOS', variants: 2, variantProps: { 'Property 1': ['iOS-faceID-unlock', 'iOS-touchID-unlock'] } },
  { id: '7606:600', name: 'permissions', category: 'iOS', variants: 3, variantProps: { type: ['general-camera', 'location', 'vertical-photo'] } },
]

export const categories = [...new Set(componentIndex.map(c => c.category))]

export const totalComponents = componentIndex.reduce((sum, c) => sum + Math.max(c.variants, 1), 0)
