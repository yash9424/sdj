'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Package, User, MapPin, CreditCard, Truck, ArrowRight, Home } from 'lucide-react'
import { Order } from '@/models/Order'

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
    } else {
      router.push('/')
    }
  }, [orderId, router])

  const fetchOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-black p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div className="mb-3 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Order Details</h2>
              <p className="text-xs sm:text-sm text-gray-600 break-all">Order ID: {order.orderId}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xl sm:text-2xl font-bold text-black">₹{(order.totalAmount || 0).toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-gray-600">{new Date(order.createdAt!).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4 sm:mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Items Ordered
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={item.image || '/placeholder.jpg'} 
                    alt={item.name || ''} 
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">{item.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">₹{(item.price || 0).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Customer Information
              </h3>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <p><span className="font-medium">Name:</span> {order.shippingAddress?.fullName}</p>
                <p className="break-all"><span className="font-medium">Email:</span> {order.customerEmail}</p>
                <p><span className="font-medium">Phone:</span> {order.shippingAddress?.phone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Shipping Address
              </h3>
              <div className="text-xs sm:text-sm text-gray-600">
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p>{order.shippingAddress?.pincode}</p>
              </div>
            </div>
          </div>

          {/* Payment & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Payment Method
              </h3>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                {order.paymentMethod === 'cod' ? (
                  <>
                    <Truck className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Cash on Delivery
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Online Payment
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Order Status</h3>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm font-medium text-center">
                  {order.status || 'Pending'}
                </span>
                <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm font-medium text-center">
                  Payment {order.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-xl border border-black p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">What's Next?</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-semibold text-black">1</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">We'll send you an email confirmation shortly</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-semibold text-black">2</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Your order will be processed within 5-7 business days</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-semibold text-black">3</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">You'll receive tracking information once shipped</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => router.push('/jewelry')}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Continue Shopping
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-white text-black border border-black rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}