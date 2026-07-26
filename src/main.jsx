import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/swiper-bundle.min.css'
import './assets/css/styles.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
