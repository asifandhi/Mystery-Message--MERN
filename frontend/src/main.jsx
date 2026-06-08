import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import VerifyCode from './pages/VerifyCode.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PublicProfile from './pages/PublicProfile.jsx'
import ThreadCheck from './pages/ThreadCheck.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: (
          <ProtectedRoute authentication={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <ProtectedRoute authentication={false}>
            <Register />
          </ProtectedRoute>
        ),
      },
      {
        path: '/verify-code',
        element: (
          <ProtectedRoute authentication={false}>
            <VerifyCode />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute authentication={true}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/u/:username',
        element: <PublicProfile />,
      },
      {
        path: '/thread/:threadToken',
        element: <ThreadCheck />,
      },
      {
        path: '*',
        element: (
          <div className='flex items-center justify-center min-h-screen text-gray-400 dark:text-gray-600'>
            404 — Page not found
          </div>
        ),
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)