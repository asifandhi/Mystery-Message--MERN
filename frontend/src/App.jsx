import { useState,useEffect } from 'react'
import './App.css'
import { useSelector } from 'react-redux'
import { toggleTheme } from './store/themeSlice';
import { Outlet } from 'react-router-dom';
import { Header,Footer } from '../components';

function App() {
  const theme  = useSelector((state) => state.theme.theme);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className='min-h-screen flex flex-col bg-white dark:bg-gray-900'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )  
}

export default App
