'use client'

import { motion } from 'framer-motion'
import { Heart, Star, Minus, Plus, Share2, ArrowLeft, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { jewelryItems } from '../../data/jewelryData'
import Footer from '../../components/Footer'

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
  stock: number
  inStock: boolean
}

export default function ProductDetailPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState('7')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('details')
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '', name: '' })
  const [productReviews, setProductReviews] = useState({ reviews: [], totalReviews: 0, averageRating: 0 })
  
  const productId = params.id as string
  
  useEffect(() => {
    fetchProduct()
    fetchProductReviews()
  }, [productId])
  
  const fetchProductReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setProductReviews(data)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    }
  }
  
  const fetchProduct = async () => {
    try {
      // Try to fetch from database first
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct({
          ...data.product,
          id: data.product._id,
          priceValue: data.product.price,
          price: `₹${data.product.price.toLocaleString()}`
        })
      } else {
        // Fallback to mock data
        const mockProduct = jewelryItems.find(item => item.id === parseInt(productId))
        setProduct(mockProduct)
      }
    } catch (error) {
      // Fallback to mock data
      const mockProduct = jewelryItems.find(item => item.id === parseInt(productId))
      setProduct(mockProduct)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/" className="text-gray-800 hover:underline">Return to Home</Link>
        </div>
      </div>
    )
  }

  const images = [product.image, product.image, product.image, product.image]
  const sizes = ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9']
  
  const originalPrice = product.mainPrice || (product.priceValue * 1.2)
  const savings = originalPrice - product.priceValue
  
  const getMetalWeight = () => {
    switch(product.category) {
      case 'ring': return '3.2g'
      case 'necklace': return '8.5g'
      case 'earrings': return '2.1g'
      case 'bracelet': return '12.3g'
      default: return '5.0g'
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-white mt-6">
      <div className="max-w-7xl mx-auto px-4">
 
        <Link href="/jewelry">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium mb-6"
                  >
                    Continue Shopping
                  </motion.button>
                </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 bg-white backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-8 shadow-xl border border-gray-300">
          {/* Left - Images */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-1 sm:gap-2 lg:gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-full h-16 sm:h-20 lg:h-24 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-gray-800 shadow-md' : 'border-gray-300 hover:border-gray-500'
                  }`}
                >
                  <Image 
                    src={img} 
                    alt={`Product view ${index + 1}`} 
                    fill 
                    className="object-cover object-center" 
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="text-gray-600 text-sm uppercase tracking-wide">{product.category}s</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mt-2">{product.name}</h1>
              
              <div className="flex items-center space-x-2 mt-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={i < Math.floor(productReviews.averageRating) ? "fill-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <span className="text-gray-600">({productReviews.totalReviews} reviews)</span>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="text-gray-800 hover:underline ml-4"
                >
                  Write a review
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800">₹{product.priceValue.toLocaleString()}</span>
              {product.mainPrice && (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                  <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    Save ₹{savings.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Ring Size */}
            {product.category === 'ring' && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3">Ring Size</h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 sm:px-4 rounded-lg border text-center text-sm sm:text-base ${
                        selectedSize === size
                          ? 'border-gray-800 bg-gray-100 text-gray-800'
                          : 'border-gray-300 hover:border-gray-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="text-gray-800 hover:underline text-xs sm:text-sm">Size Guide</button>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 sm:px-4 py-2 min-w-[50px] sm:min-w-[60px] text-center text-sm sm:text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-green-600 font-medium text-sm sm:text-base">In Stock</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      category: product.category,
                      size: selectedSize
                    })
                  }
                }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>Add to Cart</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id)
                  } else {
                    addToWishlist(product)
                  }
                }}
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Heart 
                  size={24} 
                  className={isInWishlist(product.id) ? "text-gray-800 fill-gray-800" : "text-gray-600"} 
                />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <Share2 size={24} className="text-gray-600" />
              </motion.button>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{product.description}</p>
            </div>

            {/* Basic Product Info */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 font-medium capitalize">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <span className="ml-2 font-medium">{product.stock || 'Available'}</span>
                </div>
                {!product.productDetails && (
                  <>
                    <div>
                      <span className="text-gray-500">Material:</span>
                      <span className="ml-2 font-medium capitalize">{product.material}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Metal Weight:</span>
                      <span className="ml-2 font-medium">{getMetalWeight()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features && product.features.length > 0 ? (
                  product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-xs sm:text-sm">Premium Quality {product.material || 'Jewelry'}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-xs sm:text-sm">Lifetime Warranty</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-xs sm:text-sm">Free Shipping & Returns</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-8 sm:mt-12 lg:mt-16 px-4 sm:px-0">
          {/* Mobile/Tablet Accordion */}
          <div className="md:hidden space-y-2">
            {product.category === 'combo-set' && product.productDetails && (
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setActiveTab(activeTab === 'details' ? '' : 'details')}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  <span>Product Details</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'details' ? 'rotate-180' : ''}`} />
                </button>
                {activeTab === 'details' && (
                  <div className="px-4 pb-4 border-t border-gray-200">
                    <div className="prose max-w-none">
                      <h4 className="text-base sm:text-lg font-semibold mb-3">Complete Set Details</h4>
                      <div className="space-y-4 sm:space-y-6">
                        {product.productDetails.necklace && (
                          <div>
                            <h5 className="font-semibold text-black mb-2 text-sm sm:text-base">📿 Necklace Specifications</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-gray-700 pl-2 sm:pl-4 text-xs sm:text-sm">
                              <div><strong>Material:</strong> {product.productDetails.necklace.material}</div>
                              <div><strong>Color:</strong> {product.productDetails.necklace.color || 'N/A'}</div>
                              <div><strong>Weight:</strong> {product.productDetails.necklace.weight || 'N/A'}</div>
                              <div><strong>Purity:</strong> {product.productDetails.necklace.purity || 'N/A'}</div>
                              <div><strong>Style:</strong> {product.productDetails.necklace.style || 'N/A'}</div>
                              <div><strong>Chain Type:</strong> {product.productDetails.necklace.chainType || 'N/A'}</div>
                              <div><strong>Chain Length:</strong> {product.productDetails.necklace.chainLength || 'N/A'}</div>
                            </div>
                          </div>
                        )}
                        {product.productDetails.bengals && (
                          <div>
                            <h5 className="font-semibold text-black mb-2 text-sm sm:text-base">⚡ Bengals Specifications</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-gray-700 pl-2 sm:pl-4 text-xs sm:text-sm">
                              <div><strong>Material:</strong> {product.productDetails.bengals.material}</div>
                              <div><strong>Color:</strong> {product.productDetails.bengals.color || 'N/A'}</div>
                              <div><strong>Weight:</strong> {product.productDetails.bengals.weight || 'N/A'}</div>
                              <div><strong>Purity:</strong> {product.productDetails.bengals.purity || 'N/A'}</div>
                              <div><strong>Style:</strong> {product.productDetails.bengals.style || 'N/A'}</div>
                              <div><strong>Size:</strong> {product.productDetails.bengals.size || 'N/A'}</div>
                            </div>
                          </div>
                        )}
                        {product.productDetails.earrings && (
                          <div>
                            <h5 className="font-semibold text-black mb-2 text-sm sm:text-base">💍 Earrings Specifications</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-gray-700 pl-2 sm:pl-4 text-xs sm:text-sm">
                              <div><strong>Material:</strong> {product.productDetails.earrings.material}</div>
                              <div><strong>Color:</strong> {product.productDetails.earrings.color || 'N/A'}</div>
                              <div><strong>Weight:</strong> {product.productDetails.earrings.weight || 'N/A'}</div>
                              <div><strong>Purity:</strong> {product.productDetails.earrings.purity || 'N/A'}</div>
                              <div><strong>Style:</strong> {product.productDetails.earrings.style || 'N/A'}</div>
                              <div><strong>Closure:</strong> {product.productDetails.earrings.closure || 'N/A'}</div>
                              <div><strong>Drop Length:</strong> {product.productDetails.earrings.dropLength || 'N/A'}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setActiveTab(activeTab === 'care' ? '' : 'care')}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                <span>Care Instructions</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'care' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'care' && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <div className="prose max-w-none">
                    <h4 className="text-base sm:text-lg font-semibold mb-3">Care Instructions</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Clean with a soft, lint-free cloth</li>
                      <li>• Store in a jewelry box or soft pouch</li>
                      <li>• Avoid contact with chemicals, perfumes, and lotions</li>
                      <li>• Remove before swimming, showering, or exercising</li>
                      <li>• Professional cleaning recommended every 6 months</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setActiveTab(activeTab === 'shipping' ? '' : 'shipping')}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                <span>Shipping & Returns</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'shipping' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'shipping' && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <div className="prose max-w-none">
                    <h4 className="text-base sm:text-lg font-semibold mb-3">Shipping & Returns</h4>
                    <div className="space-y-4 text-gray-700">
                      <div>
                        <h5 className="font-medium mb-2">Free Shipping</h5>
                        <ul className="space-y-1">
                          <li>• Free standard shipping on orders over $500</li>
                          <li>• Express shipping available for $25</li>
                          <li>• International shipping rates vary by location</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Delivery Time</h5>
                        <ul className="space-y-1">
                          <li>• Standard: 5-7 business days</li>
                          <li>• Express: 2-3 business days</li>
                          <li>• International: 10-14 business days</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Returns</h5>
                        <ul className="space-y-1">
                          <li>• 30-day return policy</li>
                          <li>• Items must be in original condition</li>
                          <li>• Free return shipping on defective items</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setActiveTab(activeTab === 'size' ? '' : 'size')}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                <span>Size Guide</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'size' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'size' && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <div className="prose max-w-none">
                    <h4 className="text-base sm:text-lg font-semibold mb-3">Size Guide</h4>
                    <div className="space-y-4 text-gray-700">
                      <div>
                        <h5 className="font-medium mb-2">Ring Sizing Tips</h5>
                        <ul className="space-y-1">
                          <li>• Measure your finger at the end of the day when it's largest</li>
                          <li>• The ring should fit snugly but slide over your knuckle easily</li>
                          <li>• Consider the width of the band - wider bands fit tighter</li>
                          <li>• Cold weather can make fingers smaller</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Desktop/Tablet Tabs */}
          <div className="hidden md:block border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap gap-4 md:gap-6 lg:gap-8">
              {product.category === 'combo-set' && product.productDetails && (
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`border-b-2 py-2 px-1 text-sm font-medium ${
                    activeTab === 'details' 
                      ? 'border-gray-800 text-gray-800' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Product Details
                </button>
              )}
              <button 
                onClick={() => setActiveTab('care')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  activeTab === 'care' 
                    ? 'border-gray-800 text-gray-800' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Care Instructions
              </button>
              <button 
                onClick={() => setActiveTab('shipping')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  activeTab === 'shipping' 
                    ? 'border-gray-800 text-gray-800' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Shipping & Returns
              </button>
              <button 
                onClick={() => setActiveTab('size')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  activeTab === 'size' 
                    ? 'border-gray-800 text-gray-800' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Size Guide
              </button>
            </nav>
          </div>
          <div className="py-4 sm:py-6 px-4 sm:px-0">
            {activeTab === 'details' && product.category === 'combo-set' && product.productDetails && (
              <div className="prose max-w-none">
                <h4 className="text-base sm:text-lg font-semibold mb-3">Complete Set Details</h4>
                <div className="space-y-4 sm:space-y-6">
                  {/* Necklace Details */}
                  {product.productDetails.necklace && (
                    <div>
                      <h5 className="font-semibold text-black mb-2 text-sm sm:text-base">📿 Necklace Specifications</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-gray-700 pl-2 sm:pl-4 text-xs sm:text-sm">
                        <div><strong>Material:</strong> {product.productDetails.necklace.material}</div>
                        <div><strong>Color:</strong> {product.productDetails.necklace.color || 'N/A'}</div>
                        <div><strong>Weight:</strong> {product.productDetails.necklace.weight || 'N/A'}</div>
                        <div><strong>Purity:</strong> {product.productDetails.necklace.purity || 'N/A'}</div>
                        <div><strong>Style:</strong> {product.productDetails.necklace.style || 'N/A'}</div>
                        <div><strong>Chain Type:</strong> {product.productDetails.necklace.chainType || 'N/A'}</div>
                        <div><strong>Chain Length:</strong> {product.productDetails.necklace.chainLength || 'N/A'}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Bengals Details */}
                  {product.productDetails.bengals && (
                    <div>
                      <h5 className="font-semibold text-black mb-2 text-sm sm:text-base">⚡ Bengals Specifications</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-gray-700 pl-2 sm:pl-4 text-xs sm:text-sm">
                        <div><strong>Material:</strong> {product.productDetails.bengals.material}</div>
                        <div><strong>Color:</strong> {product.productDetails.bengals.color || 'N/A'}</div>
                        <div><strong>Weight:</strong> {product.productDetails.bengals.weight || 'N/A'}</div>
                        <div><strong>Purity:</strong> {product.productDetails.bengals.purity || 'N/A'}</div>
                        <div><strong>Style:</strong> {product.productDetails.bengals.style || 'N/A'}</div>
                        <div><strong>Size:</strong> {product.productDetails.bengals.size || 'N/A'}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Earrings Details */}
                  {product.productDetails.earrings && (
                    <div>
                      <h5 className="font-semibold text-black mb-2 text-sm sm:text-base">💍 Earrings Specifications</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-gray-700 pl-2 sm:pl-4 text-xs sm:text-sm">
                        <div><strong>Material:</strong> {product.productDetails.earrings.material}</div>
                        <div><strong>Color:</strong> {product.productDetails.earrings.color || 'N/A'}</div>
                        <div><strong>Weight:</strong> {product.productDetails.earrings.weight || 'N/A'}</div>
                        <div><strong>Purity:</strong> {product.productDetails.earrings.purity || 'N/A'}</div>
                        <div><strong>Style:</strong> {product.productDetails.earrings.style || 'N/A'}</div>
                        <div><strong>Closure:</strong> {product.productDetails.earrings.closure || 'N/A'}</div>
                        <div><strong>Drop Length:</strong> {product.productDetails.earrings.dropLength || 'N/A'}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'care' && (
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold mb-3">Care Instructions</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Clean with a soft, lint-free cloth</li>
                  <li>• Store in a jewelry box or soft pouch</li>
                  <li>• Avoid contact with chemicals, perfumes, and lotions</li>
                  <li>• Remove before swimming, showering, or exercising</li>
                  <li>• Professional cleaning recommended every 6 months</li>
                </ul>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold mb-3">Shipping & Returns</h4>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h5 className="font-medium mb-2">Free Shipping</h5>
                    <ul className="space-y-1">
                      <li>• Free standard shipping on orders over $500</li>
                      <li>• Express shipping available for $25</li>
                      <li>• International shipping rates vary by location</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Delivery Time</h5>
                    <ul className="space-y-1">
                      <li>• Standard: 5-7 business days</li>
                      <li>• Express: 2-3 business days</li>
                      <li>• International: 10-14 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Returns</h5>
                    <ul className="space-y-1">
                      <li>• 30-day return policy</li>
                      <li>• Items must be in original condition</li>
                      <li>• Free return shipping on defective items</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'size' && (
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold mb-3">Size Guide</h4>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h5 className="font-medium mb-2">Ring Sizing Tips</h5>
                    <ul className="space-y-1">
                      <li>• Measure your finger at the end of the day when it's largest</li>
                      <li>• The ring should fit snugly but slide over your knuckle easily</li>
                      <li>• Consider the width of the band - wider bands fit tighter</li>
                      <li>• Cold weather can make fingers smaller</li>
                    </ul>
                  </div>

                </div>
              </div>
            )}
          </div>
          
          {/* Desktop Content */}
          <div className="hidden md:block py-6">
            {activeTab === 'details' && product.category === 'combo-set' && product.productDetails && (
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold mb-3">Complete Set Details</h4>
                <div className="space-y-6">
                  {product.productDetails.necklace && (
                    <div>
                      <h5 className="font-semibold text-black mb-2">📿 Necklace Specifications</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 pl-4">
                        <div><strong>Material:</strong> {product.productDetails.necklace.material}</div>
                        <div><strong>Color:</strong> {product.productDetails.necklace.color || 'N/A'}</div>
                        <div><strong>Weight:</strong> {product.productDetails.necklace.weight || 'N/A'}</div>
                        <div><strong>Purity:</strong> {product.productDetails.necklace.purity || 'N/A'}</div>
                        <div><strong>Style:</strong> {product.productDetails.necklace.style || 'N/A'}</div>
                        <div><strong>Chain Type:</strong> {product.productDetails.necklace.chainType || 'N/A'}</div>
                        <div><strong>Chain Length:</strong> {product.productDetails.necklace.chainLength || 'N/A'}</div>
                      </div>
                    </div>
                  )}
                  {product.productDetails.bengals && (
                    <div>
                      <h5 className="font-semibold text-black mb-2">⚡ Bengals Specifications</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 pl-4">
                        <div><strong>Material:</strong> {product.productDetails.bengals.material}</div>
                        <div><strong>Color:</strong> {product.productDetails.bengals.color || 'N/A'}</div>
                        <div><strong>Weight:</strong> {product.productDetails.bengals.weight || 'N/A'}</div>
                        <div><strong>Purity:</strong> {product.productDetails.bengals.purity || 'N/A'}</div>
                        <div><strong>Style:</strong> {product.productDetails.bengals.style || 'N/A'}</div>
                        <div><strong>Size:</strong> {product.productDetails.bengals.size || 'N/A'}</div>
                      </div>
                    </div>
                  )}
                  {product.productDetails.earrings && (
                    <div>
                      <h5 className="font-semibold text-black mb-2">💍 Earrings Specifications</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 pl-4">
                        <div><strong>Material:</strong> {product.productDetails.earrings.material}</div>
                        <div><strong>Color:</strong> {product.productDetails.earrings.color || 'N/A'}</div>
                        <div><strong>Weight:</strong> {product.productDetails.earrings.weight || 'N/A'}</div>
                        <div><strong>Purity:</strong> {product.productDetails.earrings.purity || 'N/A'}</div>
                        <div><strong>Style:</strong> {product.productDetails.earrings.style || 'N/A'}</div>
                        <div><strong>Closure:</strong> {product.productDetails.earrings.closure || 'N/A'}</div>
                        <div><strong>Drop Length:</strong> {product.productDetails.earrings.dropLength || 'N/A'}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'care' && (
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold mb-3">Care Instructions</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Clean with a soft, lint-free cloth</li>
                  <li>• Store in a jewelry box or soft pouch</li>
                  <li>• Avoid contact with chemicals, perfumes, and lotions</li>
                  <li>• Remove before swimming, showering, or exercising</li>
                  <li>• Professional cleaning recommended every 6 months</li>
                </ul>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold mb-3">Shipping & Returns</h4>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h5 className="font-medium mb-2">Free Shipping</h5>
                    <ul className="space-y-1">
                      <li>• Free standard shipping on orders over $500</li>
                      <li>• Express shipping available for $25</li>
                      <li>• International shipping rates vary by location</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Delivery Time</h5>
                    <ul className="space-y-1">
                      <li>• Standard: 5-7 business days</li>
                      <li>• Express: 2-3 business days</li>
                      <li>• International: 10-14 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Returns</h5>
                    <ul className="space-y-1">
                      <li>• 30-day return policy</li>
                      <li>• Items must be in original condition</li>
                      <li>• Free return shipping on defective items</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'size' && (
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold mb-3">Size Guide</h4>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h5 className="font-medium mb-2">Ring Sizing Tips</h5>
                    <ul className="space-y-1">
                      <li>• Measure your finger at the end of the day when it's largest</li>
                      <li>• The ring should fit snugly but slide over your knuckle easily</li>
                      <li>• Consider the width of the band - wider bands fit tighter</li>
                      <li>• Cold weather can make fingers smaller</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Write a Review</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={reviewData.name}
                  onChange={(e) => setReviewData({...reviewData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData({...reviewData, rating: star})}
                      className={`text-xl sm:text-2xl ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                  placeholder="Share your experience with this product..."
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/reviews', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        productId: product.id,
                        productName: product.name,
                        userName: reviewData.name,
                        rating: reviewData.rating,
                        comment: reviewData.comment
                      })
                    })
                    if (response.ok) {
                      alert('Review submitted successfully!')
                      fetchProductReviews() // Refresh reviews
                    }
                  } catch (error) {
                    alert('Failed to submit review')
                  }
                  setShowReviewModal(false)
                  setReviewData({ rating: 5, comment: '', name: '' })
                }}
                className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                Submit Review
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false)
                  setReviewData({ rating: 5, comment: '', name: '' })
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}