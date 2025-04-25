import { useState, useEffect } from 'react'
import { MantineProvider } from '@mantine/core'
import { RegistrationForm } from './components/RegistrationForm'
import { AdminLogin } from './components/AdminLogin'
import { AdminPanel } from './components/AdminPanel'
import './App.css'

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if we're in admin mode (you can implement your own logic here)
  const checkIfAdmin = () => {
    // For demo purposes, let's check if the URL includes 'admin'
    return window.location.pathname.includes('admin')
  }

  useEffect(() => {
    setIsAdmin(checkIfAdmin())
  }, [])

  if (isAdmin) {
    if (!isAdminLoggedIn) {
      return (
        <MantineProvider>
          <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
        </MantineProvider>
      )
    }
    return (
      <MantineProvider>
        <AdminPanel />
      </MantineProvider>
    )
  }

  return (
    <MantineProvider>
      <RegistrationForm />
    </MantineProvider>
  )
}

export default App
