'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, MoreVertical } from 'lucide-react'

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
  material: string
  color?: string
  style?: string
  metalWeight?: string
  purity?: string
  stock?: number
  features?: string[]
  inStock: boolean
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showActions, setShowActions] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'combo-set',
    mainPrice: '',
    discountedPrice: '',
    description: '',
    material: 'diamond',
    color: '',
    style: '',
    metalWeight: '',
    weightUnit: 'g',
    purity: '',
    stock: '',
    feature1: '',
    feature2: '',
    feature3: '',
    feature4: '',
    mainImage: null as File | string | null,
    image1: null as File | string | null,
    image2: null as File | string | null,
    image3: null as File | string | null,
    image4: null as File | string | null
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setProducts(products.filter(product => product._id !== productId))
          setShowActions(null)
        }
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
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
    
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) {
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
  }

  const viewProduct = (productId: string) => {
    const product = products.find(p => p._id === productId)
    if (product) {
      setSelectedProduct(product)
      setShowViewModal(true)
      setShowActions(null)
    }
  }

  const editProduct = (productId: string) => {
    const product = products.find(p => p._id === productId)
    if (product) {
      setSelectedProduct(product)
      setFormData({
        name: product.name,
        category: product.category,
        mainPrice: product.mainPrice?.toString() || '',
        discountedPrice: product.price?.toString() || '',
        description: product.description,
        material: product.material,
        color: product.color || '',
        style: product.style || '',
        metalWeight: product.metalWeight?.replace(/[^0-9.]/g, '') || '',
        weightUnit: product.metalWeight?.replace(/[0-9.]/g, '') || 'g',
        purity: product.purity || '',
        stock: product.stock?.toString() || '',
        feature1: product.features?.[0] || '',
        feature2: product.features?.[1] || '',
        feature3: product.features?.[2] || '',
        feature4: product.features?.[3] || '',
        mainImage: product.mainImage || product.image || null,
        image1: product.images?.[0] || null,
        image2: product.images?.[1] || null,
        image3: product.images?.[2] || null,
        image4: product.images?.[3] || null
      })
      setShowEditModal(true)
      setShowActions(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (showEditModal && selectedProduct) {
        // Edit mode - use simple JSON
        const response = await fetch(`/api/admin/products/${selectedProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            discountedPrice: formData.discountedPrice,
            description: formData.description,
            material: formData.material,
            stock: formData.stock
          })
        })
        
        if (response.ok) {
          setShowEditModal(false)
          fetchProducts()
          alert('Product updated successfully!')
        } else {
          alert('Failed to update product')
        }
      } else {
        // Add mode - use FormData
        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name)
        formDataToSend.append('category', formData.category)
        formDataToSend.append('mainPrice', formData.mainPrice)
        formDataToSend.append('discountedPrice', formData.discountedPrice)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('material', formData.material)
        formDataToSend.append('color', formData.color)
        formDataToSend.append('style', formData.style)
        formDataToSend.append('metalWeight', `${formData.metalWeight}${formData.weightUnit}`)
        formDataToSend.append('purity', formData.purity)
        formDataToSend.append('stock', formData.stock)
        formDataToSend.append('feature1', formData.feature1)
        formDataToSend.append('feature2', formData.feature2)
        formDataToSend.append('feature3', formData.feature3)
        formDataToSend.append('feature4', formData.feature4)
        
        if (formData.mainImage && typeof formData.mainImage !== 'string') formDataToSend.append('mainImage', formData.mainImage)
        if (formData.image1 && typeof formData.image1 !== 'string') formDataToSend.append('image1', formData.image1)
        if (formData.image2 && typeof formData.image2 !== 'string') formDataToSend.append('image2', formData.image2)
        if (formData.image3 && typeof formData.image3 !== 'string') formDataToSend.append('image3', formData.image3)
        if (formData.image4 && typeof formData.image4 !== 'string') formDataToSend.append('image4', formData.image4)

        const response = await fetch('/api/admin/products', {
          method: 'POST',
          body: formDataToSend
        })
        
        if (response.ok) {
          setShowAddModal(false)
          fetchProducts()
          alert('Product added successfully!')
        } else {
          alert('Failed to add product')
        }
      }
      
      setFormData({
        name: '',
        category: 'combo-set',
        mainPrice: '',
        discountedPrice: '',
        description: '',
        material: 'diamond',
        color: '',
        style: '',
        metalWeight: '',
        weightUnit: 'g',
        purity: '',
        stock: '',
        feature1: '',
        feature2: '',
        feature3: '',
        feature4: '',
        mainImage: null as File | string | null,
        image1: null as File | string | null,
        image2: null as File | string | null,
        image3: null as File | string | null,
        image4: null as File | string | null
      })
    } catch (error) {
      console.error('Failed to handle product:', error)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.material.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        <div className="ml-3 text-gray-600">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">All Categories</option>
          <option value="combo-set">Combo Set</option>
          <option value="necklace">Necklaces</option>
          <option value="earrings">Earrings</option>
          <option value="bracelet">Bengals</option>
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
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-sky-600 bg-white border-gray-300 rounded focus:ring-sky-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
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
                      className="w-4 h-4 text-sky-600 bg-white border-gray-300 rounded focus:ring-sky-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.material}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{product.category}</td>
                  <td className="px-6 py-4 text-gray-600">₹{product.price.toLocaleString()}</td>
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
                      <button 
                        onClick={() => viewProduct(product._id)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => editProduct(product._id)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        title="Delete Product"
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
        
        {paginatedProducts.length === 0 && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No products found</div>
            <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products</span>
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="combo-set">COMBO SET</option>
                    <option value="necklace">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelet">Bengals</option>
                  </select>
                </div>

                {/* Main Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Price ($)</label>
                  <input
                    type="number"
                    value={formData.mainPrice}
                    onChange={(e) => setFormData({...formData, mainPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Original price"
                  />
                </div>

                {/* Discounted Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price ($)</label>
                  <input
                    type="number"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Selling price"
                  />
                </div>

                {/* Saved Amount (Auto-calculated) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Saved Amount</label>
                  <input
                    type="text"
                    value={formData.mainPrice && formData.discountedPrice ? `$${(parseFloat(formData.mainPrice) - parseFloat(formData.discountedPrice)).toFixed(0)}` : '$0'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                  <select
                    value={formData.material}
                    onChange={(e) => setFormData({...formData, material: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="diamond">Diamond</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="pearl">Pearl</option>
                    <option value="rose-gold">Rose Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g., White, Gold, Silver"
                  />
                </div>

                {/* Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                  <input
                    type="text"
                    value={formData.style}
                    onChange={(e) => setFormData({...formData, style: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g., Daily, Office, Party, Bridal"
                  />
                </div>

                {/* Metal Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Metal Weight</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={formData.metalWeight}
                      onChange={(e) => setFormData({...formData, metalWeight: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="5.0"
                    />
                    <select
                      value={formData.weightUnit || 'g'}
                      onChange={(e) => setFormData({...formData, weightUnit: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="g">g</option>
                      <option value="mg">mg</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>

                {/* Purity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purity</label>
                  <select
                    value={formData.purity}
                    onChange={(e) => setFormData({...formData, purity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Select Purity</option>
                    <option value="24K (100% Pure)">24K (100% Pure)</option>
                    <option value="22K (91.6% Gold)">22K (91.6% Gold)</option>
                    <option value="18K (75% Gold)">18K (75% Gold)</option>
                    <option value="14K (58.3% Gold)">14K (58.3% Gold)</option>
                    <option value="10K (41.7% Gold)">10K (41.7% Gold)</option>
                  </select>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter stock quantity"
                    min="0"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Product description"
                  />
                </div>

                {/* Key Features */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={formData.feature1}
                      onChange={(e) => setFormData({...formData, feature1: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Feature 1"
                    />
                    <input
                      type="text"
                      value={formData.feature2}
                      onChange={(e) => setFormData({...formData, feature2: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Feature 2"
                    />
                    <input
                      type="text"
                      value={formData.feature3}
                      onChange={(e) => setFormData({...formData, feature3: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Feature 3"
                    />
                    <input
                      type="text"
                      value={formData.feature4}
                      onChange={(e) => setFormData({...formData, feature4: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Feature 4"
                    />
                  </div>
                </div>

                {/* Main Product Image */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Product Image (Card & Product Page)</label>
                  <input
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData({...formData, mainImage: file})
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  {formData.mainImage && (
                    <div className="mt-2">
                      <img 
                        src={typeof formData.mainImage === 'string' ? formData.mainImage : URL.createObjectURL(formData.mainImage)} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Additional Product Images */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Product Images (4 Images)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData({...formData, image1: file})
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
                      />
                      {formData.image1 && (
                        <img 
                          src={typeof formData.image1 === 'string' ? formData.image1 : URL.createObjectURL(formData.image1)} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg border mt-1"
                        />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData({...formData, image2: file})
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
                      />
                      {formData.image2 && (
                        <img 
                          src={typeof formData.image2 === 'string' ? formData.image2 : URL.createObjectURL(formData.image2)} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg border mt-1"
                        />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData({...formData, image3: file})
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
                      />
                      {formData.image3 && (
                        <img 
                          src={typeof formData.image3 === 'string' ? formData.image3 : URL.createObjectURL(formData.image3)} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg border mt-1"
                        />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData({...formData, image4: file})
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
                      />
                      {formData.image4 && (
                        <img 
                          src={typeof formData.image4 === 'string' ? formData.image4 : URL.createObjectURL(formData.image4)} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg border mt-1"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="md:col-span-2 flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-lg" />
                </div>
                <div className="space-y-4">
                  <div><strong>Name:</strong> {selectedProduct.name}</div>
                  <div><strong>Category:</strong> {selectedProduct.category}</div>
                  <div><strong>Price:</strong> ₹{selectedProduct.price}</div>
                  <div><strong>Material:</strong> {selectedProduct.material}</div>
                  <div><strong>Stock:</strong> {selectedProduct.stock || 0}</div>
                  <div><strong>Description:</strong> {selectedProduct.description}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="combo-set">COMBO SET</option>
                    <option value="necklace">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelet">Bengals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Price ($)</label>
                  <input
                    type="number"
                    value={formData.mainPrice}
                    onChange={(e) => setFormData({...formData, mainPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Original price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price ($)</label>
                  <input
                    type="number"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Selling price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Saved Amount</label>
                  <input
                    type="text"
                    value={formData.mainPrice && formData.discountedPrice ? `$${(parseFloat(formData.mainPrice) - parseFloat(formData.discountedPrice)).toFixed(0)}` : '$0'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                  <select
                    value={formData.material}
                    onChange={(e) => setFormData({...formData, material: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="diamond">Diamond</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="pearl">Pearl</option>
                    <option value="rose-gold">Rose Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g., White, Gold, Silver"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                  <input
                    type="text"
                    value={formData.style}
                    onChange={(e) => setFormData({...formData, style: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g., Daily, Office, Party, Bridal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Metal Weight</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={formData.metalWeight}
                      onChange={(e) => setFormData({...formData, metalWeight: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="5.0"
                    />
                    <select
                      value={formData.weightUnit || 'g'}
                      onChange={(e) => setFormData({...formData, weightUnit: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="g">g</option>
                      <option value="mg">mg</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purity</label>
                  <select
                    value={formData.purity}
                    onChange={(e) => setFormData({...formData, purity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Select Purity</option>
                    <option value="24K (100% Pure)">24K (100% Pure)</option>
                    <option value="22K (91.6% Gold)">22K (91.6% Gold)</option>
                    <option value="18K (75% Gold)">18K (75% Gold)</option>
                    <option value="14K (58.3% Gold)">14K (58.3% Gold)</option>
                    <option value="10K (41.7% Gold)">10K (41.7% Gold)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter stock quantity"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Product description"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={formData.feature1}
                      onChange={(e) => setFormData({...formData, feature1: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Feature 1"
                    />
                    <input
                      type="text"
                      value={formData.feature2}
                      onChange={(e) => setFormData({...formData, feature2: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Feature 2"
                    />
                    <input
                      type="text"
                      value={formData.feature3}
                      onChange={(e) => setFormData({...formData, feature3: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Feature 3"
                    />
                    <input
                      type="text"
                      value={formData.feature4}
                      onChange={(e) => setFormData({...formData, feature4: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Feature 4"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Product Image (Card & Product Page)</label>
                  <input
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData({...formData, mainImage: file})
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  {formData.mainImage && (
                    <div className="mt-2">
                      <img 
                        src={URL.createObjectURL(formData.mainImage)} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Product Images (4 Images)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData({...formData, image1: file})
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
                      />
                      {formData.image1 && (
                        <img 
                          src={URL.createObjectURL(formData.image1)} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg border mt-1"
                        />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData({...formData, image2: file})
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
                      />
                      {formData.image2 && (
                        <img 
                          src={URL.createObjectURL(formData.image2)} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg border mt-1"
                        />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData({...formData, image3: file})
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
                      />
                      {formData.image3 && (
                        <img 
                          src={URL.createObjectURL(formData.image3)} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg border mt-1"
                        />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData({...formData, image4: file})
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
                      />
                      {formData.image4 && (
                        <img 
                          src={URL.createObjectURL(formData.image4)} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg border mt-1"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}