import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generateStaticHTML() {
  const serverEntry = path.resolve(__dirname, '../dist/server/entry-server.js')
  const clientIndexPath = path.resolve(__dirname, '../dist/client/index.html')

  if (!fs.existsSync(serverEntry)) {
    throw new Error(`Server bundle not found at ${serverEntry}. Did you run "npm run build:server"?`)
  }
  if (!fs.existsSync(clientIndexPath)) {
    throw new Error(`Client index not found at ${clientIndexPath}. Did you run "npm run build:client"?`)
  }

  // Import the server-render function via file:// URL to avoid resolution quirks
  const serverMod = await import(pathToFileURL(serverEntry).href)
  const render = serverMod.render || serverMod.default?.render
  if (typeof render !== 'function') {
    throw new Error(`"render" function not found in ${serverEntry}. Export it as "export function render(url) {}".`)
  }

  const template = fs.readFileSync(clientIndexPath, 'utf-8')
  const { html } = render('/')

  const finalHTML = template.replace('<!--ssr-outlet-->', html)
  fs.writeFileSync(clientIndexPath, finalHTML)

  console.log('Static HTML generated at dist/client/index.html')
}

generateStaticHTML().catch(err => {
  console.error(err)
  process.exit(1)
})