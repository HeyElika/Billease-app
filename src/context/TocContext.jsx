import { createContext, useContext, useState, useRef } from 'react'

const TocContext = createContext({
  sections: [],
  setSections: () => {},
  scrollRef: { current: null },
})

export function TocProvider({ children }) {
  const [sections, setSections] = useState([])
  const scrollRef = useRef(null)
  return (
    <TocContext.Provider value={{ sections, setSections, scrollRef }}>
      {children}
    </TocContext.Provider>
  )
}

export function useToc() {
  return useContext(TocContext)
}
