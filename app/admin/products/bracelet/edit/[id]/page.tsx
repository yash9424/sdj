'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function EditBengalsPage() {
  const params = useParams()
  const productId = params.id as string
  
  const [formData, setFormData] = useState({
    name: '',
    mainPrice: '',
    discountedPrice: '',
    stock: '',
    description: '',
    material: 'gold',
    color: '',
    style: '',
    weight: '',
    weightUnit: 'g',
    purity: '',
    size: '',
    features: ['', '', '', ''],
    mainImage: null as File | null,
    images: [null, null, null, null] as (File | null)[]
  })

  const [currentImages, setCurrentImages] = useState({
    mainImage: '',
    images: [] as string[]
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error'
    message: string
  }>({ show: false, type: 'success', message: '' })

  const purityOptions = [
    { value: '24K', label: '24K (99.9% pure gold, very soft)' },
    { value: '22K', label: '22K (91.6% gold, for traditional jewellery)' },
    { value: '18K', label: '18K (75% gold, durable for fine jewellery)' },
    { value: '14K', label: '14K (58.3% gold, very durable for daily wear)' },
    { value: '10K', label: '10K (41.7% gold, durable and budget-friendly)' }
  ]

  const materialOptions = [
    'gold', 'silver', 'diamond', 'platinum', 'rose-gold', 'white-gold'
  ]

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        const product = data.product
        
        setFormData({
          name: product.name || '',
          mainPrice: product.mainPrice?.toString() || '',
          discountedPrice: product.price?.toString() || '',
          stock: product.stock?.toString() || '',
          description: product.description || '',
          material: product.productDetails?.bracelet?.material || 'gold',
          color: product.productDetails?.bracelet?.color || '',
          style: product.productDetails?.bracelet?.style || '',
          weight: product.productDetails?.bracelet?.weight?.replace(/[a-zA-Z]/g, '') || '',
          weightUnit: product.productDetails?.bracelet?.weight?.replace(/[0-9.]/g, '') || 'g',
          purity: product.productDetails?.bracelet?.purity || '',
          size: product.productDetails?.bracelet?.size || '',
          features: product.features?.length >= 4 ? product.features.slice(0, 4) : [...(product.features || []), ...Array(4 - (product.features?.length || 0)).fill('')],
          mainImage: null,
          images: [null, null, null, null]
        })

        setCurrentImages({
          mainImage: product.mainImage || product.image || '',
          images: product.images || []
        })
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      
      formDataToSend.append('name', formData.name)
      formDataToSend.append('category', 'bracelet')
      formDataToSend.append('mainPrice', formData.mainPrice)
      formDataToSend.append('discountedPrice', formData.discountedPrice)
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('description', formData.description)
      
      formDataToSend.append('productDetails', JSON.stringify({
        bracelet: {
          material: formData.material,
          color: formData.color,
          style: formData.style,
          weight: `${formData.weight}${formData.weightUnit}`,
          purity: formData.purity,
          size: formData.size
        }
      }))
      
      formData.features.forEach((feature, index) => {
        if (feature.trim()) {
          formDataToSend.append(`feature${index + 1}`, feature)
        }
      })
      
      if (formData.mainImage) {
        formDataToSend.append('mainImage', formData.mainImage)
      }
      formData.images.forEach((image, index) => {
        if (image) {
          formDataToSend.append(`image${index + 1}`, image)
        }
      })

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        body: formDataToSend
      })

      if (response.ok) {
        setNotification({
          show: true,
          type: 'success',
          message: 'Bengals updated successfully!'
        })
        setTimeout(() => {
          window.location.href = '/admin/products/bracelet'
        }, 1500)
      } else {
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to update bengals'
        })
      }
    } catch (error) {
      console.error('Error updating bengals:', error)
      setNotification({
        show: true,
        type: 'error',
        message: 'Error updating bengals'
      })
    } finally {
      setSaving(false)
    }
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const updateImage = (index: number, file: File | null) => {
    const newImages = [...formData.images]
    newImages[index] = file
    setFormData({ ...formData, images: newImages })
  }

  const savedAmount = formData.mainPrice && formData.discountedPrice 
    ? (parseFloat(formData.mainPrice) - parseFloat(formData.discountedPrice)).toFixed(0)
    : '0'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <div className="ml-3 text-gray-600">Loading bengals...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products/bracelet">
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft size={20} />
            <span>Back to Bengals</span>
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🔗 Edit Bengals</h1>
          <p className="text-gray-600">Update bengals information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Main Product Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-purple-200">Main Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter bengals name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.mainPrice}
                onChange={(e) => setFormData({...formData, mainPrice: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Original price"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.discountedPrice}
                onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Selling price"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Saved Amount</label>
              <input
                type="text"
                value={`₹${savedAmount}`}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Available quantity"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe the bengals"
              />
            </div>
          </div>
        </div>

        {/* Bengals Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-purple-200">🔗 Bengals Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <select
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {materialOptions.map(material => (
                  <option key={material} value={material}>{material.charAt(0).toUpperCase() + material.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Rose Gold, Silver"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <input
                type="text"
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Chain, Bangle, Cuff"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.0001"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.0000"
                />
                <select
                  value={formData.weightUnit}
                  onChange={(e) => setFormData({...formData, weightUnit: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Purity</option>
                {purityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 7 inches, Medium"
              />
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.features.map((feature, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feature {index + 1}</label>
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Enter feature ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Current Images */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Current Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentImages.mainImage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Main Image</label>
                <img src={currentImages.mainImage} alt="Current main" className="w-full h-32 object-cover rounded-lg border" />
              </div>
            )}
            {currentImages.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Additional Images</label>
                <div className="grid grid-cols-2 gap-2">
                  {currentImages.images.map((image, index) => (
                    <img key={index} src={image} alt={`Current ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Images */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Update Images</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">New Main Image</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setFormData({...formData, mainImage: file})
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {formData.mainImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Preview:</p>
                <img 
                  src={URL.createObjectURL(formData.mainImage)} 
                  alt="Main Preview" 
                  className="w-24 h-24 object-cover rounded-lg border-2 border-purple-200"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Additional Images (4 Images)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.images.map((image, index) => (
                <div key={index}>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      updateImage(index, file || null)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {image && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">Preview:</p>
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`} 
                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <Link href="/admin/products/bracelet">
            <button
              type="button"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Bengals'}
          </button>
        </div>
      </form>
      
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg border-2 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : (
              <XCircle className="text-red-500" size={20} />
            )}
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}