'use client'

import { useState } from 'react'
import { Moon, Sun, User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  isDark: boolean
  toggleTheme: () => void
}

export default function AdminHeader({ isDark, toggleTheme }: AdminHeaderProps) {
  const [showProfile, setShowProfile] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-72 bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..."
              className="w-80 px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
          </div>
          <div className="text-gray-500 text-sm">
            Monday, 4th September
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-gray-800"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Admin Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800">Admin</p>
                <p className="text-xs text-gray-500">Company Manager</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <User size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Admin</p>
                      <p className="text-sm text-gray-500">adminjwelery@gmail.com</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}