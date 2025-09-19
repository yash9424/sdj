'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MessageSquare, Send, MapPin, Clock } from 'lucide-react'
import Footer from '../components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required'
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', mobile: '', message: '' })
      } else {
        const data = await response.json()
        setErrors({ submit: data.error || 'Failed to send message' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    }
    
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Send className="text-green-600" size={24} />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Message Sent Successfully!</h1>
              <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <motion.button
                onClick={() => setIsSubmitted(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-colors shadow-lg"
              >
                Send Another Message
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">Contact Us</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            We'd love to hear from you. Get in touch with us for any inquiries about our jewelry collection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                      <User size={14} className="inline mr-2 sm:w-4 sm:h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 focus:border-gray-800 focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                      <Mail size={14} className="inline mr-2 sm:w-4 sm:h-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 focus:border-gray-800 focus:outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                    <Phone size={14} className="inline mr-2 sm:w-4 sm:h-4" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 focus:border-gray-800 focus:outline-none transition-colors"
                    placeholder="Enter your mobile number"
                  />
                  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                    <MessageSquare size={14} className="inline mr-2 sm:w-4 sm:h-4" />
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={5}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 focus:border-gray-800 focus:outline-none transition-colors resize-none"
                    placeholder="Write your message here..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                {errors.submit && (
                  <div className="text-red-500 text-sm text-center">
                    {errors.submit}
                  </div>
                )}

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
                      className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Send size={16} className="inline mr-2 sm:w-5 sm:h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Get in Touch</h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-gray-100 p-2.5 sm:p-3 rounded-full border border-gray-200 flex-shrink-0">
                    <MapPin className="text-gray-600" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Visit Our Store</h3>
                    <p className="text-gray-600 text-sm sm:text-base">415 - 4th floor, Sanskar Heights,<br />150 ft. ring road, Rajkot</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-gray-100 p-2.5 sm:p-3 rounded-full border border-gray-200 flex-shrink-0">
                    <Phone className="text-gray-600" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Call Us</h3>
                    <p className="text-gray-600 text-sm sm:text-base">+91 96645 12597</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-gray-100 p-2.5 sm:p-3 rounded-full border border-gray-200 flex-shrink-0">
                    <Mail className="text-gray-600" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Email Us</h3>
                    <p className="text-gray-600 text-sm sm:text-base">info@nrcrafted.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-gray-100 p-2.5 sm:p-3 rounded-full border border-gray-200 flex-shrink-0">
                    <Clock className="text-gray-600" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Business Hours</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Mon - Sat: 9:00 AM - 7:00 PM<br />Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Why Choose Us?</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm sm:text-base">Handcrafted jewelry with premium materials</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm sm:text-base">30-day return policy</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm sm:text-base">Lifetime warranty on all pieces</p>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}