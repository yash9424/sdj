'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  const router = useRouter()
  const { login } = useAuth()

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        login(data.user)
        if (data.isAdmin) {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } else {
        setErrors({ submit: data.error || 'Login failed' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Blurry Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          filter: 'blur(8px)'
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm sm:max-w-md relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-50/80 border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 focus:border-gray-800 focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                <Lock size={16} className="inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-gray-50/80 border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base text-gray-800 focus:border-gray-800 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg disabled:opacity-50 transition-colors shadow-lg"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                'Sign In'
              )}
            </motion.button>
            {errors.submit && <p className="text-red-500 text-xs sm:text-sm mt-2 text-center">{errors.submit}</p>}
          </form>

          <div className="mt-6 sm:mt-8 text-center space-y-4">
            <Link href="/forgot-password" className="block text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors">
              Forgot your password?
            </Link>
            <p className="text-sm sm:text-base text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-gray-800 font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}