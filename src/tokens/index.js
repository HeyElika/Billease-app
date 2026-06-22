// Parsed from variables.json (Figma export)
// Source of truth for all Billease design tokens

export const primitives = {
  typography: {
    family: 'Source Sans Pro',
    weight: { regular: 400, semibold: 600, bold: 700 },
    size: {
      xs: 11, sm: 13, md: 14, lg: 16, xl: 20, '2xl': 24, '3xl': 32,
    },
  },
  color: {
    neutral: {
      white: '#FFFFFF', black: '#000000',
      100: '#F7F8F9', 200: '#EAEDF0', 300: '#CCD2D8', 400: '#B4BDC5',
      500: '#97A1AB', 600: '#606C79', 700: '#2B3B4E', 800: '#1D2D40', 900: '#0F1923',
    },
    red: {
      100: '#FFF6F6', 200: '#FEC6B2', 300: '#FC9F8C', 400: '#FA7B6F',
      500: '#F84040', 600: '#DD0C0C', 700: '#B22039', 800: '#8F1434', 900: '#770C31',
    },
    blue: {
      100: '#EDF1FF', 200: '#DEE4FF', 300: '#C9D3F7', 400: '#AABCF2',
      500: '#8BA6EE', 600: '#6C90EA', 700: '#265CE5', 800: '#203AA9', 900: '#18326D',
    },
    green: {
      100: '#EAF9F1', 200: '#D5F5E4', 300: '#B7E9CF', 400: '#91DDB4',
      500: '#13BD85', 600: '#12A454', 700: '#07773A', 800: '#024822', 900: '#012B14',
    },
    yellow: {
      100: '#FFFBEB', 200: '#FEF3C7', 300: '#FDE68A', 400: '#FCD34D',
      500: '#FBBF24', 600: '#F59E0B', 700: '#D97706', 800: '#B45309', 900: '#92400E',
    },
  },
  spacing: {
    '050': 2, '100': 4, '200': 8, '300': 12, '400': 16,
    '500': 20, '600': 24, '700': 28, '800': 32, '900': 40, '1000': 48,
  },
  radius: {
    xxs: 1, xs: 2, sm: 4, md: 8, lg: 12, xl: 16, '2xl': 24, full: 9999,
  },
  borderWidth: { xs: 1, sm: 2, md: 3 },
  iconSize: { xs: 16, sm: 20, md: 24, lg: 32, xl: 40, '2xl': 48 },
  elevation: {
    xs: '0 8px 34px rgba(46,60,72,0.04)',
    sm: '0 1px 2px rgba(0,0,0,0.10)',
    md: '0 4px 24px rgba(0,0,0,0.25)',
    lg: '2px 0 30px rgba(0,0,0,0.12)',
  },
}

export const semantic = {
  canvas: {
    default: '#F7F8F9',
    alt: '#FFFFFF',
    scrim: 'rgba(0,0,0,0.60)',
  },
  bg: {
    base: '#FFFFFF',
    subtle: '#F7F8F9',
    sunken: '#EAEDF0',
    elevated: '#CCD2D8',
    strong: '#97A1AB',
    primary: '#F84040',
    secondary: '#265CE5',
    selected: '#DEE4FF',
    credit: '#265CE5',
    saving: '#12A454',
    successSubtle: '#EAF9F1',
    errorSubtle: '#FFF6F6',
    errorBold: '#FEC6B2',
    infoSubtle: '#EDF1FF',
    warningSubtle: '#FFFBEB',
    overlay: '#FFFFFF',
  },
  text: {
    base: '#1D2D40',
    subtle: '#606C79',
    disabled: '#B4BDC5',
    onDark: '#FFFFFF',
    primary: '#F84040',
    secondary: '#265CE5',
    success: '#12A454',
    error: '#DD0C0C',
    warning: '#D97706',
  },
  border: {
    subtle: '#EAEDF0',
    default: '#CCD2D8',
    strong: '#97A1AB',
    primary: '#F84040',
    error: '#F84040',
    success: '#13BD85',
  },
  icon: {
    base: '#1D2D40',
    subtle: '#606C79',
    disabled: '#B4BDC5',
    onDark: '#FFFFFF',
    primary: '#F84040',
    success: '#12A454',
    error: '#DD0C0C',
    warning: '#F59E0B',
  },
}

export const typography = {
  'heading/heading-xl-bold': { fontSize: 32, fontWeight: 700, lineHeight: '125%' },
  'heading/heading-lg-bold': { fontSize: 24, fontWeight: 700, lineHeight: '125%' },
  'heading/heading-lg-semibold': { fontSize: 24, fontWeight: 600, lineHeight: '125%' },
  'heading/heading-md-bold': { fontSize: 20, fontWeight: 700, lineHeight: '150%' },
  'heading/heading-md-semibold': { fontSize: 20, fontWeight: 600, lineHeight: '125%' },
  'heading/heading-sm-semibold': { fontSize: 16, fontWeight: 600, lineHeight: '125%' },
  'heading/heading-xs-semibold': { fontSize: 14, fontWeight: 600, lineHeight: '125%' },
  'body/body-lg-semibold': { fontSize: 20, fontWeight: 600, lineHeight: '150%' },
  'body/body-lg-regular': { fontSize: 20, fontWeight: 400, lineHeight: '150%' },
  'body/body-md-semibold': { fontSize: 16, fontWeight: 600, lineHeight: '150%' },
  'body/body-md-regular': { fontSize: 16, fontWeight: 400, lineHeight: '150%' },
  'body/body-sm-semibold': { fontSize: 14, fontWeight: 600, lineHeight: '150%' },
  'body/body-sm-regular': { fontSize: 14, fontWeight: 400, lineHeight: '150%' },
  'body/body-xs-semibold': { fontSize: 13, fontWeight: 600, lineHeight: '150%' },
  'body/body-xs-regular': { fontSize: 13, fontWeight: 400, lineHeight: '150%' },
  'body/body-xxs-semibold': { fontSize: 11, fontWeight: 600, lineHeight: '125%' },
  'body/body-xxs-regular': { fontSize: 11, fontWeight: 400, lineHeight: '125%' },
  'link/link-md': { fontSize: 16, fontWeight: 600, lineHeight: '150%', textDecoration: 'underline' },
  'link/link-sm': { fontSize: 14, fontWeight: 600, lineHeight: '150%', textDecoration: 'underline' },
  'link/Label-xs': { fontSize: 13, fontWeight: 600, lineHeight: '150%', letterSpacing: '1px', textTransform: 'small-caps' },
}
