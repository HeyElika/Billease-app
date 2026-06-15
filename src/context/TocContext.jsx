import { createContext, useContext, useState, useRef } from 'react'

const TocContext = createContext({
  sections: [],
  setSections: () => {},
  navItems: [],
  setNavItems: () => {},
  scrollRef: { current: null },
})

export function TocProvider({ children }) {
  const [sections, setSections] = useState([])
  const [navItems, setNavItems] = useState([])
  const scrollRef = useRef(null)
  return (
    <TocContext.Provider value={{ sections, setSections, navItems, setNavItems, scrollRef }}>
      {children}
    </TocContext.Provider>
  )
}

export function useToc() {
  return useContext(TocContext)
}
