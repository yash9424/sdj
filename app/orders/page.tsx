'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Eye, Calendar, CreditCard, Truck, X, User, MapPin, Download } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Order } from '@/models/Order'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
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

  const generateInvoicePDF = async (order: Order) => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // Helper function to format currency without spaces
    const formatCurrency = (amount: number) => `₹${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    
    // Company Header
    doc.setFillColor(0, 0, 0)
    doc.rect(0, 0, 210, 45, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('SDJ JEWELRY STORE', 20, 20)
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Premium Jewelry Collection', 20, 30)
    doc.text('www.sdjjewelry.com', 20, 38)
    
    // Invoice Title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('TAX INVOICE', 150, 25)
    
    // Company Details
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('123 Jewelry Street, Mumbai, Maharashtra 400001', 20, 55)
    doc.text('Phone: +91 98765 43210', 20, 63)
    doc.text('Email: contact@sdjjewelry.com', 20, 71)
    doc.text('GST No: 27ABCDE1234F1Z5', 20, 79)
    doc.text('PAN: ABCDE1234F', 20, 87)
    
    // Invoice Details Box
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.5)
    doc.rect(140, 55, 50, 35)
    
    doc.setFontSize(9)
    doc.text('Invoice No:', 142, 62)
    doc.text(order.orderId || 'N/A', 142, 69)
    doc.text('Date:', 142, 76)
    doc.text(new Date(order.createdAt!).toLocaleDateString('en-IN'), 142, 83)
    
    // Customer Details
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('BILL TO:', 20, 105)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(order.shippingAddress?.fullName || 'N/A', 20, 115)
    doc.text(order.customerEmail || 'N/A', 20, 123)
    doc.text(order.shippingAddress?.phone || 'N/A', 20, 131)
    
    // Address with proper line breaks
    const address = order.shippingAddress?.address || 'N/A'
    const cityState = `${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''}`
    const pincode = order.shippingAddress?.pincode || ''
    
    doc.text(address, 20, 139)
    doc.text(cityState, 20, 147)
    doc.text(pincode, 20, 155)
    
    // Table Header
    const tableStartY = 170
    const rowHeight = 10
    
    // Header background
    doc.setFillColor(230, 230, 230)
    doc.rect(20, tableStartY, 170, rowHeight, 'F')
    
    // Header borders
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.3)
    doc.rect(20, tableStartY, 170, rowHeight)
    
    // Column positions
    const col1 = 22  // Description
    const col2 = 115 // Qty
    const col3 = 135 // Rate
    const col4 = 165 // Amount
    
    // Vertical lines
    doc.line(112, tableStartY, 112, tableStartY + rowHeight)
    doc.line(132, tableStartY, 132, tableStartY + rowHeight)
    doc.line(162, tableStartY, 162, tableStartY + rowHeight)
    
    // Header text
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('DESCRIPTION', col1, tableStartY + 6)
    doc.text('QTY', col2, tableStartY + 6)
    doc.text('RATE', col3, tableStartY + 6)
    doc.text('AMOUNT', col4, tableStartY + 6)
    
    // Table Rows
    let currentY = tableStartY + rowHeight
    let subtotal = 0
    
    order.items?.forEach((item, index) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0)
      subtotal += itemTotal
      
      // Row background
      if (index % 2 === 1) {
        doc.setFillColor(248, 248, 248)
        doc.rect(20, currentY, 170, rowHeight, 'F')
      }
      
      // Row borders
      doc.setDrawColor(0, 0, 0)
      doc.rect(20, currentY, 170, rowHeight)
      doc.line(112, currentY, 112, currentY + rowHeight)
      doc.line(132, currentY, 132, currentY + rowHeight)
      doc.line(162, currentY, 162, currentY + rowHeight)
      
      // Row data
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      
      const itemName = (item.name || 'N/A').length > 28 ? (item.name || 'N/A').substring(0, 28) + '...' : (item.name || 'N/A')
      doc.text(itemName, col1, currentY + 6)
      doc.text(String(item.quantity || 0), col2, currentY + 6)
      doc.text(formatCurrency(item.price || 0), col3, currentY + 6)
      doc.text(formatCurrency(itemTotal), col4, currentY + 6)
      
      currentY += rowHeight
    })
    
    // Summary Section
    const summaryStartY = currentY + 15
    const shipping = 99
    const tax = subtotal * 0.18
    const total = subtotal + shipping + tax
    
    // Summary box
    doc.setDrawColor(0, 0, 0)
    doc.rect(120, summaryStartY, 70, 45)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    
    // Right align amounts
    doc.text('Subtotal:', 125, summaryStartY + 8)
    doc.text(formatCurrency(subtotal), 185, summaryStartY + 8, { align: 'right' })
    
    doc.text('Shipping:', 125, summaryStartY + 16)
    doc.text(formatCurrency(shipping), 185, summaryStartY + 16, { align: 'right' })
    
    doc.text('CGST (9%):', 125, summaryStartY + 24)
    doc.text(formatCurrency(tax/2), 185, summaryStartY + 24, { align: 'right' })
    
    doc.text('SGST (9%):', 125, summaryStartY + 32)
    doc.text(formatCurrency(tax/2), 185, summaryStartY + 32, { align: 'right' })
    
    // Total
    doc.setFillColor(0, 0, 0)
    doc.rect(120, summaryStartY + 37, 70, 8, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL:', 125, summaryStartY + 42)
    doc.text(formatCurrency(total), 185, summaryStartY + 42, { align: 'right' })
    
    // Payment Method
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}`, 20, summaryStartY + 55)
    
    // Footer
    const footerY = 260
    doc.setDrawColor(0, 0, 0)
    doc.line(20, footerY, 190, footerY)
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('This is a computer generated invoice and does not require signature.', 20, footerY + 8)
    doc.text('For queries: contact@sdjjewelry.com | +91 98765 43210', 20, footerY + 16)
    doc.text('Thank you for choosing SDJ Jewelry Store!', 20, footerY + 24)
    
    // Generate filename
    const username = (order.shippingAddress?.fullName || 'customer').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
    const productName = (order.items?.[0]?.name || 'jewelry').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().substring(0, 15)
    const deliveryDate = new Date().toISOString().split('T')[0]
    const filename = `${username}_${productName}_${deliveryDate}.pdf`
    
    doc.save(filename)
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

                  <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowOrderModal(true)
                      }}
                      className="flex items-center justify-center px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs sm:text-sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      View Details
                    </button>
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => generateInvoicePDF(order)}
                        className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Download Invoice
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Order Details</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center text-sm sm:text-base">
                  <Package size={18} className="mr-2" />
                  Order Information
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p><span className="font-medium">Order ID:</span> {selectedOrder.orderId || 'N/A'}</p>
                  <p><span className="font-medium">Date:</span> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p><span className="font-medium">Total:</span> ₹{(selectedOrder.totalAmount || 0).toLocaleString()}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status || 'pending')}`}>
                      {selectedOrder.status || 'pending'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Payment {selectedOrder.paymentStatus || 'pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center text-sm sm:text-base">
                  <User size={18} className="mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="flex items-center">
                    <User size={14} className="mr-2 text-gray-500" />
                    {selectedOrder.shippingAddress?.fullName || 'N/A'}
                  </p>
                  <p className="flex items-center break-all">
                    <span className="w-4 h-4 mr-2 text-gray-500">@</span>
                    {selectedOrder.customerEmail || 'N/A'}
                  </p>
                  <p className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-gray-500">📞</span>
                    {selectedOrder.shippingAddress?.phone || 'N/A'}
                  </p>
                  <div className="flex items-start">
                    <MapPin size={14} className="mr-2 text-gray-500 mt-0.5" />
                    <span className="text-xs sm:text-sm">
                      {selectedOrder.shippingAddress?.address || 'N/A'}, {selectedOrder.shippingAddress?.city || 'N/A'}, {selectedOrder.shippingAddress?.state || 'N/A'} - {selectedOrder.shippingAddress?.pincode || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-4 sm:mt-6">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Order Items</h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-white p-2 sm:p-3 rounded-lg">
                      <img src={item.image || ''} alt={item.name || ''} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{item.name || 'N/A'}</p>
                        <p className="text-xs text-gray-600">Quantity: {item.quantity || 0}</p>
                      </div>
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm">₹{(item.price || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-4 sm:mt-6 bg-gray-50 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Payment Method</h3>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
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
      
      <Footer />
    </div>
  )
}