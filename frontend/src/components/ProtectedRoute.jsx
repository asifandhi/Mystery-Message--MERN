import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function ProtectedRoute({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [authentication, authStatus, navigate])

  return loader ? (
    <div className='flex items-center justify-center w-full h-screen bg-white dark:bg-gray-950'>
      <p className='text-xl font-semibold text-gray-500 dark:text-gray-400 animate-pulse'>Loading...</p>
    </div>
  ) : <>{children}</>
}