// npm modules 
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// pages
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Landing from './pages/Landing/Landing'
import Profiles from './pages/Profiles/Profiles'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import Editor from './pages/Editor/Editor'
import Dashboard from './pages/Dashboard/Dashboard'
import PlaygroundList from './pages/PlaygroundList/PlaygroundList'


// components
import NavBar from './components/NavBar/NavBar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// services
import * as authService from './services/authService'

// styles
import './App.css'

// types
import { User } from './types/models'

function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(authService.getUser())
  const [justLoggedIn, setJustLoggedIn] = useState(false) // new state variable
  const navigate = useNavigate()

  const handleLogout = (): void => {
    authService.logout()
    setUser(null)
    navigate('/')
  }

  const handleAuthEvt = (): void => {
    setUser(authService.getUser())
    setJustLoggedIn(true) // indicate that the user just logged in
  }

  useEffect(() => {
    if (user && justLoggedIn) {
      navigate("/dashboard")
      setJustLoggedIn(false) // reset the flag
    }
  }, [user, justLoggedIn, navigate]);

  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing user={user} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor"
          element={
            <ProtectedRoute user={user}>
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-playgrounds"
          element={
            <ProtectedRoute user={user}>
              <PlaygroundList />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Landing user={user} />} />
        <Route
          path="/profiles"
          element={
            <ProtectedRoute user={user}>
              <Profiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={<Signup handleAuthEvt={handleAuthEvt} />}
        />
        <Route
          path="/auth/login"
          element={<Login handleAuthEvt={handleAuthEvt} />}
        />
        <Route
          path="/auth/change-password"
          element={
            <ProtectedRoute user={user}>
              <ChangePassword handleAuthEvt={handleAuthEvt} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor"
          element={
            <ProtectedRoute user={user}>
              <Editor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App;
