'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronDown, Eye, Package, Calendar, User, Mail, Phone, MapPin, CreditCard, Truck, X } from 'lucide-react'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'
import { Order } from '@/models/Order'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus as Order['status'] } : order
        ))
      }
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentStatus: newPaymentStatus })
      })

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, paymentStatus: newPaymentStatus as Order['paymentStatus'] } : order
        ))
      }
    } catch (error) {
      console.error('Failed to update payment status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'paid': return 'bg-green-100 text-green-800 border-green-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase()
    return (order.orderId || '').toLowerCase().includes(searchLower) ||
           (order.shippingAddress?.fullName || '').toLowerCase().includes(searchLower) ||
           (order.customerEmail || '').toLowerCase().includes(searchLower)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-gray-600">Loading orders...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Orders Management</h1>
              <p className="text-gray-600">Manage customer orders and track deliveries</p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ORDER ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">CUSTOMER</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ITEMS</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">PAYMENT</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order, index) => (
                    <tr key={order._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">{order.orderId || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.shippingAddress?.fullName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {(order.items?.length || 0)} Item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">₹{(order.totalAmount || 0).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order._id!, e.target.value)}
                            className={`appearance-none px-3 py-1 rounded-full text-sm font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status || 'pending')}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-current pointer-events-none" size={16} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <select
                            value={order.paymentStatus || 'pending'}
                            onChange={(e) => updatePaymentStatus(order._id!, e.target.value)}
                            className={`appearance-none px-3 py-1 rounded-full text-sm font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-current pointer-events-none" size={16} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderModal(true)
                          }}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-500">No orders match your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Package size={18} className="mr-2" />
                  Order Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Order ID:</span> {selectedOrder.orderId || 'N/A'}</p>
                  <p><span className="font-medium">Date:</span> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p><span className="font-medium">Total:</span> ₹{(selectedOrder.totalAmount || 0).toLocaleString()}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status || 'pending')}`}>
                      {selectedOrder.status || 'pending'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(selectedOrder.paymentStatus || 'pending')}`}>
                      {selectedOrder.paymentStatus || 'pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <User size={18} className="mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center">
                    <User size={14} className="mr-2 text-gray-500" />
                    {selectedOrder.shippingAddress?.fullName || 'N/A'}
                  </p>
                  <p className="flex items-center">
                    <Mail size={14} className="mr-2 text-gray-500" />
                    {selectedOrder.customerEmail || 'N/A'}
                  </p>
                  <p className="flex items-center">
                    <Phone size={14} className="mr-2 text-gray-500" />
                    {selectedOrder.shippingAddress?.phone || 'N/A'}
                  </p>
                  <p className="flex items-start">
                    <MapPin size={14} className="mr-2 text-gray-500 mt-0.5" />
                    <span>
                      {selectedOrder.shippingAddress?.address || 'N/A'}, {selectedOrder.shippingAddress?.city || 'N/A'}, {selectedOrder.shippingAddress?.state || 'N/A'} - {selectedOrder.shippingAddress?.pincode || 'N/A'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img src={item.image || ''} alt={item.name || ''} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium text-gray-800">{item.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity || 0}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800">₹{(item.price || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
              <div className="flex items-center text-sm text-gray-600">
                {(selectedOrder.paymentMethod || 'cod') === 'cod' ? (
                  <>
                    <Truck size={16} className="mr-2" />
                    Cash on Delivery
                  </>
                ) : (
                  <>
                    <CreditCard size={16} className="mr-2" />
                    Online Payment
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}