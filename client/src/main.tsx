import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router'
import App from './App'
import AuthPage from './components/auth/AuthPage'
import { AuthProvider } from "./contexts/AuthContext";
import ProfilePage from './components/profile/ProfilePage'
import BlogPage from './components/blog/BlogPage'
import EditorPage from './components/blog-editor/EditorPage'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index element={<App />} />
          <Route path="/login" element={<AuthPage isLogin={true} />} />
          <Route path="/register" element={<AuthPage isLogin={false} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/posts/:postId" element={<BlogPage />}></Route>
          <Route path="/edit/:postId" element={<EditorPage />}></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
