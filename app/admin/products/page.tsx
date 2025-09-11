'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, MoreVertical } from 'lucide-react'

interface Product {
  _id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  material: string
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
    purity: '',
    feature1: '',
    feature2: '',
    feature3: '',
    feature4: '',
    mainImage: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('mainPrice', formData.mainPrice)
    formDataToSend.append('discountedPrice', formData.discountedPrice)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('material', formData.material)
    formDataToSend.append('color', formData.color)
    formDataToSend.append('style', formData.style)
    formDataToSend.append('metalWeight', formData.metalWeight)
    formDataToSend.append('purity', formData.purity)
    formDataToSend.append('feature1', formData.feature1)
    formDataToSend.append('feature2', formData.feature2)
    formDataToSend.append('feature3', formData.feature3)
    formDataToSend.append('feature4', formData.feature4)
    
    if (formData.mainImage) formDataToSend.append('mainImage', formData.mainImage)
    if (formData.image1) formDataToSend.append('image1', formData.image1)
    if (formData.image2) formDataToSend.append('image2', formData.image2)
    if (formData.image3) formDataToSend.append('image3', formData.image3)
    if (formData.image4) formDataToSend.append('image4', formData.image4)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formDataToSend
      })
      
      if (response.ok) {
        setShowAddModal(false)
        fetchProducts()
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
          purity: '',
          feature1: '',
          feature2: '',
          feature3: '',
          feature4: '',
          mainImage: null,
          image1: null,
          image2: null,
          image3: null,
          image4: null
        })
      }
    } catch (error) {
      console.error('Failed to add product:', error)
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
          <option value="ring">Combo</option>
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
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === product._id ? null : product._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                      
                      {showActions === product._id && (
                        <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 text-gray-700">
                            <Eye size={16} />
                            <span>View Details</span>
                          </button>
                          <button className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 text-gray-700">
                            <Edit size={16} />
                            <span>Edit Product</span>
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-red-50 text-red-600"
                          >
                            <Trash2 size={16} />
                            <span>Delete Product</span>
                          </button>
                        </div>
                      )}
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
                  <input
                    type="text"
                    value={formData.metalWeight}
                    onChange={(e) => setFormData({...formData, metalWeight: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g., 5.0g"
                  />
                </div>

                {/* Purity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purity</label>
                  <input
                    type="text"
                    value={formData.purity}
                    onChange={(e) => setFormData({...formData, purity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g., 18K (75% Pure)"
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
                    onChange={(e) => setFormData({...formData, mainImage: e.target.files?.[0] || null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Additional Product Images */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Product Images (4 Images)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setFormData({...formData, image1: e.target.files?.[0] || null})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <input
                      type="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setFormData({...formData, image2: e.target.files?.[0] || null})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <input
                      type="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setFormData({...formData, image3: e.target.files?.[0] || null})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <input
                      type="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setFormData({...formData, image4: e.target.files?.[0] || null})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
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
    </div>
  )
}