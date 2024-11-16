import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AskDestination from './components/pedir_corrida/ask_destination.tsx'
import Home from './components/home/home.component'
import LoginForm from './components/login/login.tsx'
import RegisterForm from './components/register/register.tsx'
import { Theme } from './style/Theme.tsx'
import { GlobalStyle } from './style/Global.ts'
import { AuthProvider } from './components/context/supabase.context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <GlobalStyle />
      <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/register" element={<RegisterForm></RegisterForm>}></Route>
          <Route path="/login" element={<LoginForm></LoginForm>}></Route>
          <Route path='/iniciar' element={<AskDestination />}> </Route>
        </Routes>
      </Router>
      </AuthProvider>
    </Theme>
  </StrictMode>,
)
