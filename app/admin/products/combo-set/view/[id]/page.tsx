'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'

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
  productDetails?: {
    necklace?: any
    bengals?: any
    earrings?: any
  }
  createdAt: string
}

export default function ViewComboSetPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <div className="ml-3 text-gray-600">Loading combo set...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💎</div>
        <div className="text-gray-500 mb-2">Combo set not found</div>
        <Link href="/admin/products/combo-set">
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            Back to Combo Sets
          </button>
        </Link>
      </div>
    )
  }

  const savedAmount = product.mainPrice && product.price 
    ? (product.mainPrice - product.price).toFixed(0)
    : '0'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products/combo-set">
            <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft size={20} />
              <span>Back to Combo Sets</span>
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">💎 View Combo Set</h1>
            <p className="text-gray-600">{product.name}</p>
          </div>
        </div>
        <Link href={`/admin/products/combo-set/edit/${product._id}`}>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600">
            <Edit size={16} />
            <span>Edit Combo Set</span>
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Main Product Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-purple-200">Main Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <p className="text-gray-900 font-medium">{product.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <p className="text-gray-900 capitalize">{product.category}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Price</label>
              <p className="text-gray-900 font-medium">₹{product.mainPrice?.toLocaleString()}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price</label>
              <p className="text-gray-900 font-medium">₹{product.price.toLocaleString()}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saved Amount</label>
              <p className="text-green-600 font-medium">₹{savedAmount}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <p className="text-gray-900">{product.stock || 0}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Product Details for Each Type */}
        {product.productDetails && (
          <>
            {/* Necklace Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-blue-200">📿 Necklace Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <p className="text-gray-900 capitalize">{product.productDetails.necklace?.material || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <p className="text-gray-900">{product.productDetails.necklace?.color || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                  <p className="text-gray-900">{product.productDetails.necklace?.style || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <p className="text-gray-900">{product.productDetails.necklace?.weight || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purity</label>
                  <p className="text-gray-900">{product.productDetails.necklace?.purity || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chain Type</label>
                  <p className="text-gray-900">{product.productDetails.necklace?.chainType || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chain Length</label>
                  <p className="text-gray-900">{product.productDetails.necklace?.chainLength || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Bengals Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-orange-200">⚡ Bengals Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <p className="text-gray-900 capitalize">{product.productDetails.bengals?.material || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <p className="text-gray-900">{product.productDetails.bengals?.color || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                  <p className="text-gray-900">{product.productDetails.bengals?.style || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <p className="text-gray-900">{product.productDetails.bengals?.weight || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purity</label>
                  <p className="text-gray-900">{product.productDetails.bengals?.purity || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <p className="text-gray-900">{product.productDetails.bengals?.size || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Earrings Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-green-200">💍 Earrings Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <p className="text-gray-900 capitalize">{product.productDetails.earrings?.material || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <p className="text-gray-900">{product.productDetails.earrings?.color || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                  <p className="text-gray-900">{product.productDetails.earrings?.style || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <p className="text-gray-900">{product.productDetails.earrings?.weight || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purity</label>
                  <p className="text-gray-900">{product.productDetails.earrings?.purity || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Closure</label>
                  <p className="text-gray-900">{product.productDetails.earrings?.closure || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drop Length</label>
                  <p className="text-gray-900">{product.productDetails.earrings?.dropLength || 'N/A'}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Key Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feature {index + 1}</label>
                  <p className="text-gray-900">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Images</h2>
          
          {/* Main Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
            <div className="w-48 h-48 bg-gray-100 rounded-lg border-2 border-purple-200 flex items-center justify-center">
              {(product.mainImage || product.image) ? (
                <img
                  src={product.mainImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="text-gray-500 text-sm">Image not found</div>';
                  }}
                />
              ) : (
                <div className="text-gray-500 text-sm">No Image</div>
              )}
            </div>
          </div>
          
          {/* Additional Images */}
          {product.images && product.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.images && product.images.length > 0 ? (
                  product.images.filter(image => image && image.trim() !== '').map((image, index) => (
                    <div key={index} className="w-32 h-32 bg-gray-100 rounded-lg border flex items-center justify-center">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="text-gray-400 text-xs">No Image</div>';
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm col-span-4">No additional images</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <label className="block font-medium mb-1">Created At</label>
              <p>{new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block font-medium mb-1">Product ID</label>
              <p className="font-mono">{product._id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}