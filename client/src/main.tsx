import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router'
import App from './App'
import AuthPage from './components/auth/AuthPage'
import { AuthProvider } from "./contexts/AuthContext";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index element={<App />} />
          <Route path="login" element={<AuthPage isLogin={true} />} />
          <Route path="register" element={<AuthPage isLogin={false} />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
