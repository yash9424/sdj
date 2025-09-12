'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function EditComboSetPage({ params }: { params: { id: string } }) {
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error'
    message: string
  }>({ show: false, type: 'success', message: '' })
  
  const [formData, setFormData] = useState({
    // Main Product Info
    name: '',
    mainPrice: '',
    discountedPrice: '',
    stock: '',
    description: '',
    
    // Product Details - Common for all three types
    necklace: {
      material: 'gold',
      color: '',
      style: '',
      weight: '',
      weightUnit: 'g',
      purity: '',
      chainType: '',
      chainLength: ''
    },
    bengals: {
      material: 'gold',
      color: '',
      style: '',
      weight: '',
      weightUnit: 'g',
      purity: '',
      size: ''
    },
    earrings: {
      material: 'gold',
      color: '',
      style: '',
      weight: '',
      weightUnit: 'g',
      purity: '',
      closure: '',
      dropLength: ''
    },
    
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

        setFormData({
          name: product.name || '',
          mainPrice: product.mainPrice?.toString() || '',
          discountedPrice: product.price?.toString() || '',
          stock: product.stock?.toString() || '',
          description: product.description || '',
          
          necklace: {
            material: product.productDetails?.necklace?.material || 'gold',
            color: product.productDetails?.necklace?.color || '',
            style: product.productDetails?.necklace?.style || '',
            ...parseWeight(product.productDetails?.necklace?.weight || ''),
            purity: product.productDetails?.necklace?.purity || '',
            chainType: product.productDetails?.necklace?.chainType || '',
            chainLength: product.productDetails?.necklace?.chainLength || ''
          },
          bengals: {
            material: product.productDetails?.bengals?.material || 'gold',
            color: product.productDetails?.bengals?.color || '',
            style: product.productDetails?.bengals?.style || '',
            ...parseWeight(product.productDetails?.bengals?.weight || ''),
            purity: product.productDetails?.bengals?.purity || '',
            size: product.productDetails?.bengals?.size || ''
          },
          earrings: {
            material: product.productDetails?.earrings?.material || 'gold',
            color: product.productDetails?.earrings?.color || '',
            style: product.productDetails?.earrings?.style || '',
            ...parseWeight(product.productDetails?.earrings?.weight || ''),
            purity: product.productDetails?.earrings?.purity || '',
            closure: product.productDetails?.earrings?.closure || '',
            dropLength: product.productDetails?.earrings?.dropLength || ''
          },
          
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
      formDataToSend.append('category', 'combo-set')
      formDataToSend.append('mainPrice', formData.mainPrice)
      formDataToSend.append('discountedPrice', formData.discountedPrice)
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('description', formData.description)
      
      // Product details for all three types
      formDataToSend.append('productDetails', JSON.stringify({
        necklace: {
          ...formData.necklace,
          weight: `${formData.necklace.weight}${formData.necklace.weightUnit}`
        },
        bengals: {
          ...formData.bengals,
          weight: `${formData.bengals.weight}${formData.bengals.weightUnit}`
        },
        earrings: {
          ...formData.earrings,
          weight: `${formData.earrings.weight}${formData.earrings.weightUnit}`
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
        setNotification({
          show: true,
          type: 'success',
          message: 'Combo set updated successfully!'
        })
        setTimeout(() => {
          window.location.href = '/admin/products/combo-set'
        }, 1500)
      } else {
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to update combo set'
        })
      }
    } catch (error) {
      console.error('Error updating combo set:', error)
      setNotification({
        show: true,
        type: 'error',
        message: 'Error updating combo set'
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
        <div className="ml-3 text-gray-600">Loading combo set...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products/combo-set">
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft size={20} />
            <span>Back to Combo Sets</span>
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">💎 Edit Combo Set</h1>
          <p className="text-gray-600">Update combo set details</p>
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
                placeholder="Enter combo set name"
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
                placeholder="Describe the combo set"
              />
            </div>
          </div>
        </div>

        {/* Product Details for Each Type */}
        {/* Necklace Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-blue-200">📿 Necklace Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <select
                value={formData.necklace.material}
                onChange={(e) => setFormData({...formData, necklace: {...formData.necklace, material: e.target.value}})}
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
                value={formData.necklace.color}
                onChange={(e) => setFormData({...formData, necklace: {...formData.necklace, color: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Rose Gold, Silver"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <input
                type="text"
                value={formData.necklace.style}
                onChange={(e) => setFormData({...formData, necklace: {...formData.necklace, style: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Traditional, Modern"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.0001"
                  value={formData.necklace.weight}
                  onChange={(e) => setFormData({...formData, necklace: {...formData.necklace, weight: e.target.value}})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.0000"
                />
                <select
                  value={formData.necklace.weightUnit}
                  onChange={(e) => setFormData({...formData, necklace: {...formData.necklace, weightUnit: e.target.value}})}
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
                value={formData.necklace.purity}
                onChange={(e) => setFormData({...formData, necklace: {...formData.necklace, purity: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                value={formData.necklace.chainType}
                onChange={(e) => setFormData({...formData, necklace: {...formData.necklace, chainType: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Box Chain, Cable Chain"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chain Length</label>
              <input
                type="text"
                value={formData.necklace.chainLength}
                onChange={(e) => setFormData({...formData, necklace: {...formData.necklace, chainLength: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 18 inches, 20 inches"
              />
            </div>
          </div>
        </div>

        {/* Bengals Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-orange-200">⚡ Bengals Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <select
                value={formData.bengals.material}
                onChange={(e) => setFormData({...formData, bengals: {...formData.bengals, material: e.target.value}})}
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
                value={formData.bengals.color}
                onChange={(e) => setFormData({...formData, bengals: {...formData.bengals, color: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Rose Gold, Silver"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <input
                type="text"
                value={formData.bengals.style}
                onChange={(e) => setFormData({...formData, bengals: {...formData.bengals, style: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Traditional, Modern"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.0001"
                  value={formData.bengals.weight}
                  onChange={(e) => setFormData({...formData, bengals: {...formData.bengals, weight: e.target.value}})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.0000"
                />
                <select
                  value={formData.bengals.weightUnit}
                  onChange={(e) => setFormData({...formData, bengals: {...formData.bengals, weightUnit: e.target.value}})}
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
                value={formData.bengals.purity}
                onChange={(e) => setFormData({...formData, bengals: {...formData.bengals, purity: e.target.value}})}
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
                value={formData.bengals.size}
                onChange={(e) => setFormData({...formData, bengals: {...formData.bengals, size: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 2.4, 2.6, 2.8"
              />
            </div>
          </div>
        </div>

        {/* Earrings Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-green-200">💍 Earrings Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <select
                value={formData.earrings.material}
                onChange={(e) => setFormData({...formData, earrings: {...formData.earrings, material: e.target.value}})}
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
                value={formData.earrings.color}
                onChange={(e) => setFormData({...formData, earrings: {...formData.earrings, color: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Rose Gold, Silver"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <input
                type="text"
                value={formData.earrings.style}
                onChange={(e) => setFormData({...formData, earrings: {...formData.earrings, style: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Traditional, Modern"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.0001"
                  value={formData.earrings.weight}
                  onChange={(e) => setFormData({...formData, earrings: {...formData.earrings, weight: e.target.value}})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.0000"
                />
                <select
                  value={formData.earrings.weightUnit}
                  onChange={(e) => setFormData({...formData, earrings: {...formData.earrings, weightUnit: e.target.value}})}
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
                value={formData.earrings.purity}
                onChange={(e) => setFormData({...formData, earrings: {...formData.earrings, purity: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Purity</option>
                {purityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Closure</label>
              <input
                type="text"
                value={formData.earrings.closure}
                onChange={(e) => setFormData({...formData, earrings: {...formData.earrings, closure: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Push Back, Screw Back"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Drop Length</label>
              <input
                type="text"
                value={formData.earrings.dropLength}
                onChange={(e) => setFormData({...formData, earrings: {...formData.earrings, dropLength: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 1 inch, 2 inches"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          <Link href="/admin/products/combo-set">
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
            {saving ? 'Updating...' : 'Update Combo Set'}
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