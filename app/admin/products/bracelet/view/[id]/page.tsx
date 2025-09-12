'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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
  productDetails?: {
    bracelet?: {
      material?: string
      color?: string
      style?: string
      weight?: string
      purity?: string
      size?: string
    }
  }
  stock?: number
  features?: string[]
  inStock: boolean
  createdAt: string
}

export default function ViewBengalsPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const productId = params.id as string

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`)
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
        <div className="ml-3 text-gray-600">Loading bengals...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">Bengals not found</div>
        <Link href="/admin/products/bracelet">
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            Back to Bengals
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products/bracelet">
            <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft size={20} />
              <span>Back to Bengals</span>
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🔗 View Bengals</h1>
            <p className="text-gray-600">Bengals details and specifications</p>
          </div>
        </div>
        <Link href={`/admin/products/bracelet/edit/${productId}`}>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600">
            <Edit size={16} />
            <span>Edit Bengals</span>
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Images</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                <img
                  src={product.mainImage || product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg border-2 border-purple-200"
                />
              </div>
              {product.images && product.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Product Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900 font-medium">{product.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <p className="text-gray-900 font-medium">₹{product.price.toLocaleString()}</p>
                  </div>
                  {product.mainPrice && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Original Price</label>
                      <p className="text-gray-900 font-medium">₹{product.mainPrice.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <p className="text-gray-900 font-medium">{product.stock || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Bengals Specifications */}
            {product.productDetails?.bracelet && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 Bengals Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Material</label>
                    <p className="text-gray-900 capitalize">{product.productDetails.bracelet.material || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Color</label>
                    <p className="text-gray-900">{product.productDetails.bracelet.color || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Style</label>
                    <p className="text-gray-900">{product.productDetails.bracelet.style || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight</label>
                    <p className="text-gray-900">{product.productDetails.bracelet.weight || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purity</label>
                    <p className="text-gray-900">{product.productDetails.bracelet.purity || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Size</label>
                    <p className="text-gray-900">{product.productDetails.bracelet.size || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}