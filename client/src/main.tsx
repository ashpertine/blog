import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router'
import App from './App'
import AuthPage from './components/auth/AuthPage'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="login" element={<AuthPage isLogin={true} />} />
        <Route path="register" element={<AuthPage isLogin={false} />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
