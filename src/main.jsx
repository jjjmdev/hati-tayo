import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@trendyol/baklava'
import { setIconPath } from '@trendyol/baklava'
import '@trendyol/baklava/dist/themes/default.css'
setIconPath('https://cdn.jsdelivr.net/npm/@trendyol/baklava-icons@latest/icons')

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
