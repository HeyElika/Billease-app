export const PROTOTYPE_FLOWS = [
  {
    id: 'email-verification',
    label: 'Email Verification',
    scenarios: [
      { id: 'too-many-otp-attempts', label: 'Too many wrong OTP attempts' },
      { id: 'expired-otp',           label: 'Expired OTP'                 },
    ],
  },
  {
    id: 'sign-up',
    label: 'Sign Up',
    scenarios: [
      { id: 'happy-path',           label: 'Happy path'           },
      { id: 'email-delivery-error', label: 'Email delivery error' },
    ],
  },
]
