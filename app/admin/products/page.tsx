'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, Package, TrendingUp, BarChart3, Sparkles } from 'lucide-react'
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
      gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
      bgPattern: 'bg-gradient-to-br from-violet-50 to-purple-50',
      iconBg: 'bg-violet-100',
      textColor: 'text-violet-700',
      buttonColor: 'bg-violet-600 hover:bg-violet-700'
    },
    {
      id: 'necklace',
      name: 'NECKLACES',
      description: 'Elegant necklaces for every occasion',
      icon: '📿',
      gradient: 'from-blue-600 via-indigo-600 to-cyan-600',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-700',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'earrings',
      name: 'EARRINGS',
      description: 'Beautiful earrings to complement your style',
      icon: '💍',
      gradient: 'from-emerald-600 via-teal-600 to-green-600',
      bgPattern: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      iconBg: 'bg-emerald-100',
      textColor: 'text-emerald-700',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-700'
    },
    {
      id: 'bracelet',
      name: 'BENGALS',
      description: 'Stunning bracelets and bangles',
      icon: '⚡',
      gradient: 'from-amber-600 via-orange-600 to-red-600',
      bgPattern: 'bg-gradient-to-br from-amber-50 to-orange-50',
      iconBg: 'bg-amber-100',
      textColor: 'text-amber-700',
      buttonColor: 'bg-amber-600 hover:bg-amber-700'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Product Management
                </h1>
              </div>
              <p className="text-gray-600 text-lg">Manage your jewelry collection across all categories</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="text-green-600" size={16} />
                  <span className="text-green-700 font-semibold">Active Products</span>
                  <span className="text-green-800 font-bold">
                    {Object.values(categoryStats).reduce((a, b) => a + b, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="group relative h-full">
              {/* Card */}
              <div className={`${category.bgPattern} rounded-3xl border border-white/60 shadow-xl backdrop-blur-sm overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full flex flex-col`}>
                {/* Gradient Header - Fixed Height */}
                <div className={`bg-gradient-to-r ${category.gradient} p-6 relative overflow-hidden h-48 flex-shrink-0`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 h-full">
                    <div className="flex items-start justify-between text-white h-full">
                      <div className="space-y-3 flex-1">
                        <div className="text-4xl drop-shadow-lg">{category.icon}</div>
                        <div>
                          <h3 className="text-lg font-bold tracking-wide leading-tight">{category.name}</h3>
                          <p className="text-sm opacity-90 font-medium leading-tight mt-1">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-2xl font-black drop-shadow-lg">
                          {categoryStats[category.id as keyof typeof categoryStats]}
                        </div>
                        <div className="text-xs opacity-90 font-semibold uppercase tracking-wider">Products</div>
                      </div>
                    </div>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
                </div>
                
                {/* Card Body - Flexible Height */}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  {/* Action Buttons */}
                  <div className="space-y-3 flex-1">
                    <Link href={`/admin/products/${category.id}`}>
                      <button className={`w-full flex items-center justify-center space-x-2 px-4 py-3 ${category.buttonColor} text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}>
                        <Package size={16} />
                        <span className="text-sm">Manage Collection</span>
                      </button>
                    </Link>
                    
                    <Link href={`/admin/products/${category.id}/add`}>
                      <button className={`w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-200 ${category.textColor} rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:border-gray-300 hover:bg-white/80`}>
                        <Plus size={16} />
                        <span className="text-sm">Add New Item</span>
                      </button>
                    </Link>
                  </div>
                  
                  {/* Stats - Fixed at Bottom */}
                  <div className="pt-4 border-t border-gray-200/60 mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Available Stock</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 ${category.iconBg} rounded-full`}></div>
                        <span className={`font-bold ${category.textColor} text-sm`}>
                          {categoryStats[category.id as keyof typeof categoryStats]} items
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Actions Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl">
              <BarChart3 className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="group flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                <Eye size={20} />
              </div>
              <div className="text-left">
                <div className="font-semibold">View All Products</div>
                <div className="text-sm opacity-90">Browse entire catalog</div>
              </div>
            </button>
            
            <button className="group flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                <Search size={20} />
              </div>
              <div className="text-left">
                <div className="font-semibold">Search Products</div>
                <div className="text-sm opacity-90">Find specific items</div>
              </div>
            </button>
            
            <button className="group flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl hover:from-rose-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                <Trash2 size={20} />
              </div>
              <div className="text-left">
                <div className="font-semibold">Bulk Actions</div>
                <div className="text-sm opacity-90">Manage multiple items</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}