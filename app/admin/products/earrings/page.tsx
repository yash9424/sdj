'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ConfirmModal from '../../components/ConfirmModal'

interface Product {
  _id: string
  name: string
  category: string
  price: number
  mainPrice?: number
  image: string
  mainImage?: string
  images?: string[]
  description: string
  material?: string
  productDetails?: {
    earrings?: {
      material?: string
      color?: string
      style?: string
      weight?: string
      purity?: string
      closure?: string
      dropLength?: string
    }
  }
  stock?: number
  features?: string[]
  inStock: boolean
  createdAt: string
}

export default function EarringsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [materialFilter, setMaterialFilter] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 15
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} })

  useEffect(() => {
    fetchEarringsProducts()
  }, [])

  const fetchEarringsProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        const earringsProducts = data.products.filter((p: Product) => p.category === 'earrings')
        setProducts(earringsProducts)
      }
    } catch (error) {
      console.error('Failed to fetch earrings products:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Earrings',
      message: 'Are you sure you want to delete these earrings? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE'
          })
          if (response.ok) {
            setProducts(products.filter(product => product._id !== productId))
          }
        } catch (error) {
          console.error('Failed to delete product:', error)
        }
      }
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(product => product._id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const deleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) return
    
    setConfirmModal({
      isOpen: true,
      title: 'Delete Multiple Earrings',
      message: `Are you sure you want to delete ${selectedProducts.length} selected earrings? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const deletePromises = selectedProducts.map(productId => 
            fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
          )
          await Promise.all(deletePromises)
          setProducts(products.filter(product => !selectedProducts.includes(product._id)))
          setSelectedProducts([])
          setSelectAll(false)
        } catch (error) {
          console.error('Failed to delete products:', error)
        }
      }
    })
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'in-stock' && product.inStock) ||
      (stockFilter === 'out-of-stock' && !product.inStock)
    
    const price = product.price || 0
    const matchesPrice = priceFilter === 'all' ||
      (priceFilter === 'under-1k' && price < 1000) ||
      (priceFilter === '1k-3k' && price >= 1000 && price <= 3000) ||
      (priceFilter === '3k-5k' && price > 3000 && price <= 5000) ||
      (priceFilter === 'above-5k' && price > 5000)
    
    const material = product.productDetails?.earrings?.material || product.material || ''
    const matchesMaterial = materialFilter === 'all' || material.toLowerCase() === materialFilter.toLowerCase()
    
    return matchesSearch && matchesStock && matchesPrice && matchesMaterial
  })

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <div className="ml-3 text-gray-600">Loading earrings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products">
            <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft size={20} />
              <span>Back to Categories</span>
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">💍 EARRINGS Management</h1>
            <p className="text-gray-600">Manage elegant earrings for every occasion</p>
          </div>
        </div>
        <Link href="/admin/products/earrings/add">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600">
            <Plus size={16} />
            <span>Add Earrings</span>
          </button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search earrings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Prices</option>
          <option value="under-1k">Under ₹1,000</option>
          <option value="1k-3k">₹1,000 - ₹3,000</option>
          <option value="3k-5k">₹3,000 - ₹5,000</option>
          <option value="above-5k">Above ₹5,000</option>
        </select>
        <select
          value={materialFilter}
          onChange={(e) => setMaterialFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Materials</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="diamond">Diamond</option>
          <option value="platinum">Platinum</option>
          <option value="rose-gold">Rose Gold</option>
          <option value="white-gold">White Gold</option>
        </select>
        {selectedProducts.length > 0 && (
          <button 
            onClick={deleteSelectedProducts}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <Trash2 size={16} />
            <span>Delete Selected ({selectedProducts.length})</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Earrings</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Material</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.mainImage || product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border-2 border-green-200"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">Earrings</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">
                      <div className="font-semibold">₹{product.price.toLocaleString()}</div>
                      {product.mainPrice && (
                        <div className="text-sm text-gray-500 line-through">₹{product.mainPrice.toLocaleString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{product.productDetails?.earrings?.material || product.material || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{product.stock || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link href={`/admin/products/earrings/view/${product._id}`}>
                        <button 
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </Link>
                      <Link href={`/admin/products/earrings/edit/${product._id}`}>
                        <button 
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                          title="Edit Earrings"
                        >
                          <Edit size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        title="Delete Earrings"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {paginatedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💍</div>
            <div className="text-gray-500 mb-2">No earrings found</div>
            <p className="text-sm text-gray-400">Create your first earrings to get started</p>
            <Link href="/admin/products/earrings/add">
              <button className="mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600">
                Add First Earrings
              </button>
            </Link>
          </div>
        )}
      </div>

      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} earrings</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1">{currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}