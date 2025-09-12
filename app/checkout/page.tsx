'use client'

import { motion } from 'framer-motion'
import { CreditCard, Lock, ArrowLeft, Smartphone, Wallet, Plus, Minus, Truck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

export default function CheckoutPage() {
  const { items, getTotalPrice, updateQuantity } = useCart()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    secondMobile: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  // Auto-fetch user profile data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.username || '',
        email: user.email || '',
        mobile: user.mobile || ''
      }))
    }
  }, [user])
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error'
    message: string
  }>({ show: false, type: 'success', message: '' })

  const subtotal = getTotalPrice()
  const shipping = 99
  const tax = subtotal * 0.18
  const total = subtotal + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const orderData = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        secondMobile: formData.secondMobile,
        address: formData.address,
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
        items: items,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        paymentMethod: paymentMethod
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (result.success) {
        setNotification({
          show: true,
          type: 'success',
          message: `Order placed successfully! Order ID: ${result.orderId}`
        })
        // Clear cart after successful order
        setTimeout(() => {
          window.location.href = '/jewelry'
        }, 2000)
      } else {
        setNotification({
          show: true,
          type: 'error',
          message: result.message || 'Failed to place order'
        })
      }
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to place order. Please try again.'
      })
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 mb-6 mt-6">
        <div className="flex items-center mb-8">
          <Link href="/cart" className="flex items-center text-gray-800 hover:underline">
            <ArrowLeft size={20} className="mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Payment Form */}
          <div className="bg-white backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Lock size={24} className="mr-2" />
              Secure Checkout
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none mb-4"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none mb-4"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none"
                    required
                  />
                  <input
                    type="tel"
                    name="secondMobile"
                    placeholder="Second Mobile (Optional)"
                    value={formData.secondMobile}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h3>
                <input
                  type="text"
                  name="address"
                  placeholder="Complete Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none mb-4"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-gray-800 focus:outline-none"
                  required
                />
              </div>

              {/* Payment Method Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-lg border text-center flex items-center justify-center space-x-2 ${paymentMethod === 'cod' ? 'border-gray-800 bg-gray-100' : 'border-gray-300'}`}
                  >
                    <Truck size={20} />
                    <span>Cash on Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('phonepe')}
                    className={`p-4 rounded-lg border text-center flex items-center justify-center space-x-2 ${paymentMethod === 'phonepe' ? 'border-gray-800 bg-gray-100' : 'border-gray-300'}`}
                  >
                    <Smartphone size={20} />
                    <span>PhonePe Online</span>
                  </button>
                </div>
              </div>

              {/* Payment Information */}
              {paymentMethod === 'cod' && (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-600 mb-4">Pay when your order is delivered to your doorstep</p>
                  <div className="flex justify-center mb-2">
                    <Truck size={48} className="text-gray-800" />
                  </div>
                  <p className="text-sm text-gray-500">No advance payment required</p>
                </div>
              )}

              {paymentMethod === 'phonepe' && (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-600 mb-4">You will be redirected to PhonePe to complete your payment</p>
                  <div className="flex justify-center mb-2">
                    <Smartphone size={48} className="text-gray-800" />
                  </div>
                  <p className="text-sm text-gray-500">Secure PhonePe online payment</p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg mt-6"
              >
                {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay with PhonePe'}
              </motion.button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-300 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                      >
                        <Minus size={12} />
                      </motion.button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                      >
                        <Plus size={12} />
                      </motion.button>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ₹{typeof item.price === 'string' ? item.price.replace(/[$]/g, '') : item.price}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-gray-800">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg border-2 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification({ show: false, type: 'success', message: '' })}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}