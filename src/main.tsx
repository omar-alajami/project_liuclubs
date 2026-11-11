import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './auth/authContext.tsx'
import { MembershipProvider } from './auth/membershipContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from "./ScrollToTop.tsx";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <MembershipProvider>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
      </MembershipProvider>
    </AuthProvider>
  </StrictMode>,
)
