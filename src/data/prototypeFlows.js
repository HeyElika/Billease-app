export const PROTOTYPE_FLOWS = [
  {
    id: 'email-verification',
    label: 'Email Verification',
    scenarios: [
      { id: 'too-many-otp-attempts',    label: 'Too many wrong OTP attempts'   },
      { id: 'expired-otp',              label: 'Expired OTP'                   },
      { id: 'resend-and-change-email',  label: '3 resend attempts + change email' },
    ],
  },
]
