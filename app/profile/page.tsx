'use client'

import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-amber-100 to-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <User size={20} className="text-gray-600" />
              <div>
                <label className="text-sm text-gray-500">Username</label>
                <p className="text-gray-800 font-medium">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Mail size={20} className="text-gray-600" />
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-gray-800 font-medium">{user.email}</p>
              </div>
            </div>

            {user.mobile && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Phone size={20} className="text-gray-600" />
                <div>
                  <label className="text-sm text-gray-500">Mobile</label>
                  <p className="text-gray-800 font-medium">{user.mobile}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Calendar size={20} className="text-gray-600" />
              <div>
                <label className="text-sm text-gray-500">Member Since</label>
                <p className="text-gray-800 font-medium">Recently Joined</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}