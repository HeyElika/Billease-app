import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useToc } from '../context/TocContext'
import { PROTOTYPE_FLOWS } from '../data/prototypeFlows'
import TooManyOTPAttempts from './flows/EmailVerification'
import { HEADER_HEIGHT } from '../components/ui/Header'

const SIDEBAR_W = 220

const FLOW_COMPONENTS = {
  'email-verification': {
    'too-many-otp-attempts': TooManyOTPAttempts,
  },
}

export default function PrototypesPage() {
  const { flowId, scenarioId } = useParams()
  const { setNavItems } = useToc()

  const flow = PROTOTYPE_FLOWS.find(f => f.id === flowId)

  useEffect(() => {
    if (!flow) return
    setNavItems(
      flow.scenarios.map(s => ({
        id: s.id,
        label: s.label,
        to: `/prototypes/${flow.id}/${s.id}`,
      }))
    )
    return () => setNavItems([])
  }, [flow, setNavItems])

  if (!flow) return <Navigate to="/prototypes/email-verification/too-many-otp-attempts" replace />

  const scenarioComponents = FLOW_COMPONENTS[flowId] ?? {}
  const Component = scenarioComponents[scenarioId]
  if (!Component) return <Navigate to="/prototypes/email-verification/too-many-otp-attempts" replace />

  return (
    <div style={{
      position: 'fixed',
      top: HEADER_HEIGHT,
      left: SIDEBAR_W,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      backgroundColor: '#fff',
    }}>
      <Component />
    </div>
  )
}
