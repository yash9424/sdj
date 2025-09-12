'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditNecklacePage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    // Main Product Info
    name: '',
    mainPrice: '',
    discountedPrice: '',
    stock: '',
    description: '',
    
    // Necklace Details
    material: 'gold',
    color: '',
    style: '',
    weight: '',
    weightUnit: 'g',
    purity: '',
    chainType: '',
    chainLength: '',
    
    // Key Features
    features: ['', '', '', ''],
    
    // Images
    mainImage: null as File | null,
    images: [null, null, null, null] as (File | null)[],
    existingMainImage: '',
    existingImages: [] as string[]
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
  }, [])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        const product = data.product
        
        // Parse weight values to separate number and unit
        const parseWeight = (weight: string) => {
          if (!weight) return { weight: '', weightUnit: 'g' }
          const match = weight.match(/^(\d*\.?\d*)([a-zA-Z]*)$/)
          return {
            weight: match?.[1] || '',
            weightUnit: match?.[2] || 'g'
          }
        }

        const necklaceDetails = product.productDetails?.necklace || {}
        const weightData = parseWeight(necklaceDetails.weight || '')

        setFormData({
          name: product.name || '',
          mainPrice: product.mainPrice?.toString() || '',
          discountedPrice: product.price?.toString() || '',
          stock: product.stock?.toString() || '',
          description: product.description || '',
          
          material: necklaceDetails.material || 'gold',
          color: necklaceDetails.color || '',
          style: necklaceDetails.style || '',
          weight: weightData.weight,
          weightUnit: weightData.weightUnit,
          purity: necklaceDetails.purity || '',
          chainType: necklaceDetails.chainType || '',
          chainLength: necklaceDetails.chainLength || '',
          
          features: [
            product.features?.[0] || '',
            product.features?.[1] || '',
            product.features?.[2] || '',
            product.features?.[3] || ''
          ],
          
          mainImage: null,
          images: [null, null, null, null],
          existingMainImage: product.mainImage || product.image || '',
          existingImages: product.images || []
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
      
      // Main product info
      formDataToSend.append('name', formData.name)
      formDataToSend.append('category', 'necklace')
      formDataToSend.append('mainPrice', formData.mainPrice)
      formDataToSend.append('discountedPrice', formData.discountedPrice)
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('description', formData.description)
      
      // Necklace details
      formDataToSend.append('productDetails', JSON.stringify({
        necklace: {
          material: formData.material,
          color: formData.color,
          style: formData.style,
          weight: `${formData.weight}${formData.weightUnit}`,
          purity: formData.purity,
          chainType: formData.chainType,
          chainLength: formData.chainLength
        }
      }))
      
      // Features
      formData.features.forEach((feature, index) => {
        if (feature.trim()) {
          formDataToSend.append(`feature${index + 1}`, feature)
        }
      })
      
      // Images
      if (formData.mainImage) {
        formDataToSend.append('mainImage', formData.mainImage)
      }
      formData.images.forEach((image, index) => {
        if (image) {
          formDataToSend.append(`image${index + 1}`, image)
        }
      })

      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        body: formDataToSend
      })

      if (response.ok) {
        alert('Necklace updated successfully!')
        window.location.href = '/admin/products/necklace'
      } else {
        alert('Failed to update necklace')
      }
    } catch (error) {
      console.error('Error updating necklace:', error)
      alert('Error updating necklace')
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <div className="ml-3 text-gray-600">Loading necklace...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products/necklace">
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft size={20} />
            <span>Back to Necklaces</span>
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📿 Edit Necklace</h1>
          <p className="text-gray-600">Update necklace details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Main Product Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-blue-200">Main Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter necklace name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.mainPrice}
                onChange={(e) => setFormData({...formData, mainPrice: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the necklace"
              />
            </div>
          </div>
        </div>

        {/* Necklace Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-blue-200">📿 Necklace Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <select
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Rose Gold, Silver"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <input
                type="text"
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Traditional, Modern"
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0000"
                />
                <select
                  value={formData.weightUnit}
                  onChange={(e) => setFormData({...formData, weightUnit: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Purity</option>
                {purityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chain Type</label>
              <input
                type="text"
                value={formData.chainType}
                onChange={(e) => setFormData({...formData, chainType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Box Chain, Cable Chain"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chain Length</label>
              <input
                type="text"
                value={formData.chainLength}
                onChange={(e) => setFormData({...formData, chainLength: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 18 inches, 20 inches"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter feature ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Images</h2>
          
          {/* Main Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Image (Card & Product Page)</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setFormData({...formData, mainImage: file})
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 flex space-x-4">
              {formData.mainImage && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">New Image:</p>
                  <img 
                    src={URL.createObjectURL(formData.mainImage)} 
                    alt="New Main Preview" 
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
              )}
              {formData.existingMainImage && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                  <div className="w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
                    {formData.existingMainImage ? (
                      <img 
                        src={formData.existingMainImage} 
                        alt="Current Main" 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="text-gray-400 text-xs">Not found</div>';
                        }}
                      />
                    ) : (
                      <div className="text-gray-400 text-xs">No Image</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images (4 Images)</label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-2 flex space-x-2">
                    {image && (
                      <div>
                        <p className="text-xs text-gray-600">New:</p>
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`New Preview ${index + 1}`} 
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    {formData.existingImages[index] && formData.existingImages[index].trim() !== '' && (
                      <div>
                        <p className="text-xs text-gray-600">Current:</p>
                        <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                          <img 
                            src={formData.existingImages[index]} 
                            alt={`Current ${index + 1}`} 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = '<div class="text-gray-400 text-xs">No Image</div>';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <Link href="/admin/products/necklace">
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
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Necklace'}
          </button>
        </div>
      </form>
    </div>
  )
}