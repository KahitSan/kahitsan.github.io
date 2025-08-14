import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// If SSR injected HTML exists, hydrate; otherwise do a client-only render
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}