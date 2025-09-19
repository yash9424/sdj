'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Eye, Calendar, CreditCard, Truck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Order } from '@/models/Order'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      router.push('/login')
      return
    }
    if (isLoggedIn && user) {
      fetchUserOrders()
    }
  }, [isLoggedIn, user, router, isLoading])

  const fetchUserOrders = async () => {
    try {
      const response = await fetch(`/api/orders/user/${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 px-4">My Orders</h1>
            <p className="text-sm sm:text-base text-gray-600 px-4">Track and manage your order history</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <Package className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Start shopping to see your orders here</p>
              <button
                onClick={() => router.push('/jewelry')}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white border border-black rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-all">Order #{order.orderId}</h3>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600 mt-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {new Date(order.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-center ${getStatusColor(order.status || 'pending')}`}>
                        {order.status || 'Pending'}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-gray-800 text-center sm:text-left">
                        ₹{(order.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                      <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Items ({order.items?.length || 0})</h4>
                      <div className="space-y-2">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                            <img 
                              src={item.image || '/placeholder.jpg'} 
                              alt={item.name || ''} 
                              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{item.name}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {(order.items?.length || 0) > 2 && (
                          <p className="text-xs text-gray-500">+{(order.items?.length || 0) - 2} more items</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Shipping Address</h4>
                      <div className="text-xs sm:text-sm text-gray-600">
                        <p className="truncate">{order.shippingAddress?.fullName}</p>
                        <p className="truncate">{order.shippingAddress?.address}</p>
                        <p className="truncate">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                        <p>{order.shippingAddress?.pincode}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Payment</h4>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                        {order.paymentMethod === 'cod' ? (
                          <>
                            <Truck className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span className="truncate">Cash on Delivery</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span className="truncate">Online Payment</span>
                          </>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center sm:justify-end pt-2 border-t border-gray-200">
                    <button
                      onClick={() => router.push(`/order-confirmation?orderId=${order._id}`)}
                      className="flex items-center justify-center px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}