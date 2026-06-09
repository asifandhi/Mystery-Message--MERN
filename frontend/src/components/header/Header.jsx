import React, { useState } from 'react'
import { logout } from '../../store/authSlice'
import { toggleTheme } from '../../store/themeSlice'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import api from '../../api/axios'
import { logoutUser } from '../../api/api'

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    navigate("/login");
  }

  return (
    <header className='w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'>
      <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>

        {/* Main row */}
        <div className='flex items-center justify-between h-16'>

          {/* Logo */}
          <Link to="/" className='text-xl md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
            MysteryMsg
          </Link>

          {/* Desktop nav */}
          <nav className='hidden sm:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400'>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className='hover:text-gray-900 dark:hover:text-white transition-colors'>
                  Dashboard
                </Link>
                <span className="text-gray-400 dark:text-gray-600">@{user?.username}</span>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className='flex items-center gap-2'>

            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className='p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Desktop auth buttons */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className='hidden sm:block text-sm px-4 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                Logout
              </button>
            ) : (
              <div className='hidden sm:flex items-center gap-2'>
                <Link to="/login" className='text-sm px-4 py-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
                  Login
                </Link>
                <Link to="/register" className='text-sm px-4 py-1.5 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors'>
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="sm:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 py-3 flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  Dashboard
                </Link>
                <span className="px-2 py-1 text-sm text-gray-400 dark:text-gray-600">
                  @{user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className='grid grid-cols-2 gap-1'>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm px-4 py-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm px-4 py-1.5 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  )
}

export default Header