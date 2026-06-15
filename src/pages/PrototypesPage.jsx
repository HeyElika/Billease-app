import { useParams, Navigate } from 'react-router-dom'
import TooManyOTPAttempts from './flows/EmailVerification'

const FLOW_SCENARIOS = {
  'email-verification': {
    'too-many-otp-attempts': TooManyOTPAttempts,
  },
}

export default function PrototypesPage() {
  const { flowId, scenarioId } = useParams()
  const scenarios = FLOW_SCENARIOS[flowId]
  if (!scenarios) return <Navigate to="/prototypes/email-verification/too-many-otp-attempts" replace />
  const Component = scenarios[scenarioId]
  if (!Component) return <Navigate to="/prototypes/email-verification/too-many-otp-attempts" replace />
  return <Component />
}
