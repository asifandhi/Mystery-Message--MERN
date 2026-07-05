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

import Dashboard from './pages/Dashboard.jsx'
import PublicProfile from './pages/PublicProfile.jsx'
import ThreadCheck from './pages/ThreadCheck.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SentThreads from './pages/SentThreads.jsx'
import { ToastProvider } from './components/toast/ToastContext.jsx'


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
        path: '/threads/:username', 
        element: <SentThreads /> 
      },
      
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
  </StrictMode>
)