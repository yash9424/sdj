'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, Heart, ShoppingCart, Eye, Star, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { jewelryCategories, subcategories, materials, colors, sortOptions, priceRanges } from '../data/jewelryData'

interface Product {
  _id: string
  name: string
  category: string
  price: number
  mainPrice?: number
  image: string
  images: string[]
  description: string
  material: string
  features: string[]
  rating: number
  reviews: number
  productDetails: any
}

export default function JewelryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['all'])
  const [selectedColor, setSelectedColor] = useState('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { requireAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
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

  const allItems = products.map(p => ({
    id: p._id,
    name: p.name,
    category: p.category,
    price: `₹${p.price.toLocaleString()}`,
    priceValue: p.price,
    mainPrice: p.mainPrice,
    image: p.image,
    images: p.images,
    description: p.description,
    material: p.material || 'gold',
    color: 'gold',
    subcategory: p.category,
    rating: p.rating || 4.5,
    reviews: p.reviews || 0,
    features: p.features
  }))

  const filteredItems = allItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
    const typeMatch = selectedType === 'all' || item.category === selectedType
    const materialMatch = selectedMaterials.includes('all') || selectedMaterials.includes(item.material)
    const colorMatch = selectedColor === 'all' || item.color === selectedColor
    const subcategoryMatch = selectedSubcategory === 'all' || item.subcategory === selectedSubcategory
    const priceMatch = item.priceValue >= selectedPriceRange.min && item.priceValue <= selectedPriceRange.max
    
    return categoryMatch && typeMatch && materialMatch && colorMatch && subcategoryMatch && priceMatch
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.priceValue - b.priceValue
      case 'price-high':
        return b.priceValue - a.priceValue
      case 'popular':
        return b.reviews - a.reviews
      case 'rating':
        return b.rating - a.rating
      default:
        return a.id - b.id
    }
  })

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">FOR EVERY YOU</h1>
        <p className="text-gray-600 text-base sm:text-lg">Discover jewelry that matches your style</p>
      </div>

      {/* Category Filters - Horizontal */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide transition-all ${
              selectedCategory === 'all'
                ? 'bg-gray-800 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            All Jewelry
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('combo-set')}
            className={`px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide transition-all ${
              selectedCategory === 'combo-set'
                ? 'bg-gray-800 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            COMBO SET
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('necklace')}
            className={`px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide transition-all ${
              selectedCategory === 'necklace'
                ? 'bg-gray-800 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Necklaces
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('earrings')}
            className={`px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide transition-all ${
              selectedCategory === 'earrings'
                ? 'bg-gray-800 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Earrings
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('bracelet')}
            className={`px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide transition-all ${
              selectedCategory === 'bracelet'
                ? 'bg-gray-800 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Bengals
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white py-3 px-4 rounded-lg"
          >
            <Filter size={20} />
            <span>Filters</span>
            {showMobileFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <div className={`w-full lg:w-80 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-300 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Filters</h2>
            
            {/* Material */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Material</h3>
              <div className="space-y-2">
                {materials.map((material) => (
                  <label key={material} className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={(e) => {
                        if (material === 'all') {
                          setSelectedMaterials(['all'])
                        } else {
                          if (e.target.checked) {
                            setSelectedMaterials(prev => prev.filter(m => m !== 'all').concat(material))
                          } else {
                            const newMaterials = selectedMaterials.filter(m => m !== material)
                            setSelectedMaterials(newMaterials.length === 0 ? ['all'] : newMaterials)
                          }
                        }
                      }}
                      className="w-4 h-4 text-gray-800 bg-white border-gray-300 rounded focus:ring-gray-800 focus:ring-2"
                    />
                    <span className="text-sm text-gray-600">
                      {material.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <motion.button
                    key={range.label}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedPriceRange(range)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedPriceRange.label === range.label
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedCategory('all')
                setSelectedType('all')
                setSelectedMaterials(['all'])
                setSelectedColor('all')
                setSelectedSubcategory('all')
                setSelectedPriceRange(priceRanges[0])
                setSortBy('newest')
              }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Clear All Filters
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <span className="text-gray-800 font-medium text-lg">
              {filteredItems.length} items found
            </span>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                <option value="rating">Best Seller</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jewelry...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-300 max-w-md mx-auto">
                <div className="text-6xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Jewelry Found</h3>
                <p className="text-gray-600 mb-6">No jewelry matches your current selection. Try adjusting your filters.</p>
              </div>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8"
            >
            {filteredItems.slice(0, 12).map((item, index) => (
            <Link href={`/product/${item.id}`} key={item.id}>
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-200 hover:border-gray-400"
              >
              {/* Image Container */}
              <div className="relative w-full h-48 sm:h-64 lg:h-80 overflow-hidden rounded-t-3xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (isInWishlist(item.id)) {
                      removeFromWishlist(item.id)
                    } else {
                      addToWishlist({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        category: item.category
                      })
                    }
                  }}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all shadow-lg backdrop-blur-sm ${
                    isInWishlist(item.id) 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-white/90 text-gray-600 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Heart className={isInWishlist(item.id) ? 'fill-current' : ''} size={18} />
                </motion.button>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
                
                {/* Rating */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg border border-gray-300">
                  <Star className="text-gray-800 fill-current" size={14} />
                  <span className="text-sm font-semibold text-gray-600">{item.rating}</span>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="mb-3 lg:mb-4">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg mb-1 lg:mb-2 line-clamp-1">
                    {item.name}
                  </h3>
                  {/* Discounted Price */}
                  {item.mainPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      ₹{item.mainPrice.toLocaleString()}
                    </div>
                  )}
                </div>
                
                {/* Price and Rating */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                    {item.price}
                  </span>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 mt-1 sm:mt-0">
                    <Star className="text-gray-800 fill-current mr-1" size={14} />
                    <span className="font-semibold">{item.rating} ({item.reviews})</span>
                  </div>
                </div>

              </div>
              </motion.div>
            </Link>
            ))}
            </motion.div>
          )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}