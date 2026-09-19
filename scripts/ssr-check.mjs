import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import React from 'react'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { dsRegistry, sectionsForEntry } = await server.ssrLoadModule('/src/data/dsRegistry.jsx')
  const { default: GenericDocs } = await server.ssrLoadModule('/src/pages/GenericDocs.jsx')

  let failures = 0
  for (const [id, entry] of Object.entries(dsRegistry)) {
    try {
      const html = renderToString(React.createElement(GenericDocs, { comp: { id, name: entry.name }, entry }))
      const sections = sectionsForEntry(entry).map(s => s.id).join(',')
      console.log(`ok   ${id.padEnd(12)} ${entry.name.padEnd(22)} ${String(html.length).padStart(6)} bytes  sections: ${sections}`)
    } catch (err) {
      failures++
      console.log(`FAIL ${id} ${entry.name}: ${err.message}`)
    }
  }
  console.log(failures === 0 ? `\nAll ${Object.keys(dsRegistry).length} registry pages render.` : `\n${failures} failing.`)
  process.exitCode = failures ? 1 : 0
} finally {
  await server.close()
}
