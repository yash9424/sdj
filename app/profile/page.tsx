'use client'

import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Calendar, Edit3, Settings, Heart, ShoppingBag, X, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading } = useAuth()
  const router = useRouter()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })
  const [isLoading2, setIsLoading2] = useState(false)
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [editingField, setEditingField] = useState('')
  const [editData, setEditData] = useState({ username: '', mobile: '' })

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-gray-300">
              <User className="text-white" size={32} />
            </div>
            <button className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-300 hover:bg-gray-50 transition-colors">
              <Edit3 size={14} className="text-gray-600 sm:w-4 sm:h-4" />
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{user.username}</h1>
          <p className="text-sm sm:text-base text-gray-600">Jewelry Enthusiast</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Profile Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Personal Information</h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-colors">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <User size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Username</label>
                      <p className="text-base sm:text-lg font-semibold text-gray-800">{user.username}</p>
                    </div>
                  </div>
                  <Edit3 size={14} className="text-gray-400 hover:text-gray-600 cursor-pointer sm:w-4 sm:h-4" onClick={() => handleEdit('username')} />
                </div>

                <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-colors">
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Email</label>
                      <p className="text-base sm:text-lg font-semibold text-gray-800 truncate">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">Not editable</span>
                </div>

                {user.mobile && (
                  <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-colors">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Phone size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Mobile</label>
                        <p className="text-base sm:text-lg font-semibold text-gray-800">{user.mobile}</p>
                      </div>
                    </div>
                    <Edit3 size={14} className="text-gray-400 hover:text-gray-600 cursor-pointer sm:w-4 sm:h-4" onClick={() => handleEdit('mobile')} />
                  </div>
                )}

                <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-gray-300 rounded-xl">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Calendar size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Member Since</label>
                      <p className="text-base sm:text-lg font-semibold text-gray-800">Recently Joined</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Quick Actions</h3>
              <div className="space-y-2 sm:space-y-3">
                <button 
                  onClick={() => router.push('/wishlist')}
                  className="w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Heart size={16} className="text-gray-600 sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-700">My Wishlist</span>
                </button>
                
                <button 
                  onClick={() => router.push('/orders')}
                  className="w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <ShoppingBag size={16} className="text-gray-600 sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-700">My Orders</span>
                </button>
                
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Settings size={16} className="text-gray-600 sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-700">Settings</span>
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Your Activity</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Orders</span>
                  <span className="text-sm sm:text-base font-bold text-gray-800">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Wishlist Items</span>
                  <span className="text-sm sm:text-base font-bold text-gray-800">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Reviews</span>
                  <span className="text-sm sm:text-base font-bold text-gray-800">0</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Edit Field Modal */}
        <AnimatePresence>
          {editingField && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-lg border-2 border-gray-300"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Edit {editingField === 'username' ? 'Username' : 'Mobile Number'}</h3>
                  <button
                    onClick={() => setEditingField('')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      {editingField === 'username' ? 'Username' : 'Mobile Number'}
                    </label>
                    <input
                      type={editingField === 'mobile' ? 'tel' : 'text'}
                      value={editingField === 'username' ? editData.username : editData.mobile}
                      onChange={(e) => setEditData({...editData, [editingField]: e.target.value})}
                      className="w-full p-2 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingField('')}
                      className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading2}
                      className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading2 ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Change Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-lg border-2 border-gray-300"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Change Password</h3>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full p-2 sm:p-3 pr-10 sm:pr-12 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.current ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full p-2 sm:p-3 pr-10 sm:pr-12 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.new ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full p-2 sm:p-3 pr-10 sm:pr-12 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading2}
                      className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading2 ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification */}
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-2 sm:right-4 p-3 sm:p-4 rounded-lg shadow-lg z-50 max-w-xs sm:max-w-none ${
              notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base">{notification.message}</span>
              <button
                onClick={() => setNotification({ show: false, type: '', message: '' })}
                className="ml-4 text-white hover:text-gray-200"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({ show: true, type: 'error', message: 'New passwords do not match' })
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000)
      return
    }

    setIsLoading2(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setNotification({ show: true, type: 'success', message: 'Password updated successfully' })
        setShowPasswordModal(false)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setNotification({ show: true, type: 'error', message: data.error || 'Failed to update password' })
      }
    } catch (error) {
      setNotification({ show: true, type: 'error', message: 'Network error occurred' })
    } finally {
      setIsLoading2(false)
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000)
    }
  }

  function handleEdit(field: string) {
    setEditingField(field)
    setEditData({
      username: user.username || '',
      mobile: user.mobile || ''
    })
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading2(true)
    
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [editingField]: editingField === 'username' ? editData.username : editData.mobile
        })
      })

      const data = await response.json()

      if (response.ok) {
        setNotification({ show: true, type: 'success', message: `${editingField === 'username' ? 'Username' : 'Mobile number'} updated successfully` })
        setEditingField('')
        window.location.reload()
      } else {
        setNotification({ show: true, type: 'error', message: data.error || 'Failed to update' })
      }
    } catch (error) {
      setNotification({ show: true, type: 'error', message: 'Network error occurred' })
    } finally {
      setIsLoading2(false)
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000)
    }
  }
}