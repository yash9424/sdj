'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, Package } from 'lucide-react'
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
  createdAt: string
}

export default function ProductsPage() {
  const [categoryStats, setCategoryStats] = useState({
    'combo-set': 0,
    'necklace': 0,
    'earrings': 0,
    'bracelet': 0
  })
  const [loading, setLoading] = useState(true)

  const categories = [
    {
      id: 'combo-set',
      name: 'COMBO SET',
      description: 'Complete jewelry sets with matching pieces',
      icon: '💎',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'necklace',
      name: 'NECKLACES',
      description: 'Elegant necklaces for every occasion',
      icon: '📿',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'earrings',
      name: 'EARRINGS',
      description: 'Beautiful earrings to complement your style',
      icon: '💍',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'bracelet',
      name: 'BENGALS',
      description: 'Stunning bracelets and bangles',
      icon: '⚡',
      color: 'from-orange-500 to-red-500'
    }
  ]

  useEffect(() => {
    fetchCategoryStats()
  }, [])

  const fetchCategoryStats = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        const stats = {
          'combo-set': data.products.filter((p: Product) => p.category === 'combo-set').length,
          'necklace': data.products.filter((p: Product) => p.category === 'necklace').length,
          'earrings': data.products.filter((p: Product) => p.category === 'earrings').length,
          'bracelet': data.products.filter((p: Product) => p.category === 'bracelet').length
        }
        setCategoryStats(stats)
      }
    } catch (error) {
      console.error('Failed to fetch category stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        <div className="ml-3 text-gray-600">Loading categories...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <p className="text-gray-600">Manage products by category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{categoryStats[category.id as keyof typeof categoryStats]}</div>
                  <div className="text-sm opacity-90">Products</div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                <Link href={`/admin/products/${category.id}`}>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                    <Package size={16} />
                    <span>Manage {category.name}</span>
                  </button>
                </Link>
                
                <Link href={`/admin/products/${category.id}/add`}>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Plus size={16} />
                    <span>Add New</span>
                  </button>
                </Link>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>In Stock:</span>
                  <span className="font-medium">{categoryStats[category.id as keyof typeof categoryStats]}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Eye size={16} />
            <span>View All Products</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Search size={16} />
            <span>Search Products</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            <Trash2 size={16} />
            <span>Bulk Actions</span>
          </button>
        </div>
      </div>
    </div>
  )
}