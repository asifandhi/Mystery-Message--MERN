import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from './store/authSlice'
import { getMe } from './api/user.api.js' 
import Header from './components/header/Header.jsx'
import Footer from './components/footer/Footer.jsx'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.theme.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
  }, [theme])

  useEffect(() => {
    getMe()
      .then((res) => dispatch(login(res.data.data)))
      .catch(() => dispatch(logout()))
      .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-col bg-white dark:bg-gray-950'>
      <Header />
      <main className='grow'>
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : (
    <div className='flex items-center justify-center w-full h-screen bg-white dark:bg-gray-950'>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-8 h-8 border-2 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin' />
        <p className='text-sm text-gray-400 dark:text-gray-600'>Loading...</p>
      </div>
    </div>
  )
}

export default App