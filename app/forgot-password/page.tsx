'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Blurry Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
            filter: 'blur(8px)'
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm sm:max-w-md relative z-10"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-green-600" size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Check Your Email</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-colors shadow-lg"
              >
                Back to Login
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Blurry Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
            <p className="text-sm sm:text-base text-gray-600">Enter your email to reset your password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50/80 border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 focus:border-gray-800 focus:outline-none transition-colors"
                placeholder="Enter your email address"
              />
              {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
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
                'Send Reset Link'
              )}
            </motion.button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <Link href="/login" className="inline-flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}