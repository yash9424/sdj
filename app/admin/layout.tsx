'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import AdminSidebar from './components/AdminSidebar'
import AdminHeader from './components/AdminHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDark, setIsDark] = useState(false)
  const { user, isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user?.email !== 'adminjwelery@gmail.com')) {
      router.push('/login')
    }
  }, [isLoggedIn, isLoading, user, router])

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme')
    if (saved) {
      setIsDark(saved === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('admin-theme', newTheme ? 'dark' : 'light')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isLoggedIn || user?.email !== 'adminjwelery@gmail.com') {
    return null
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        <AdminSidebar isDark={isDark} />
        <AdminHeader isDark={isDark} toggleTheme={toggleTheme} />
        
        <main className="lg:ml-72 pt-24 p-6 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}