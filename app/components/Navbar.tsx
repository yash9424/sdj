'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Heart, Search, User, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import ProfileDrawer from './ProfileDrawer'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Jewelry', href: '/jewelry' },
  { name: 'About Us', href: '/about' },
  { name: 'Boutique', href: '/boutique' },
  { name: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false)
  const { items } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { user, isLoggedIn } = useAuth()
  const isCategoryPage = pathname.startsWith('/category/')
  const isWishlistOrCartPage = pathname === '/wishlist' || pathname === '/cart'
  const isProductPage = pathname.startsWith('/product/')
  const isJewelryPage = pathname === '/jewelry'

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 50)
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left Side - Logo */}
          <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={32} height={52} className=" sm:h-11 sm:w-8" />
              <div className="flex flex-col leading-none">
                <span className="text-sm sm:text-lg font-bold text-gray-800 tracking-wide">
                  Scottsdale & Diamond
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-widest">
                  Company
                </span>
              </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className={`text-base font-medium tracking-wide ${
                pathname === item.href
                  ? 'text-gray-800 border-b-2 border-gray-800 pb-1'
                  : 'text-gray-600 hover:text-gray-800'
              }`}>
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Icons & Menu */}
          <div className="flex items-center space-x-2">
            <div className="hidden lg:block relative group">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full border bg-white border-gray-300">
                <Search className="h-4 w-4 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-32 text-gray-600 placeholder:text-gray-400"
                />
              </div>
            </div>
            
            <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100">
              <Heart className="h-5 w-5 text-gray-600" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                  {items.length}
                </span>
              )}
            </Link>
            
            {isLoggedIn ? (
              <button 
                onClick={() => setIsProfileDrawerOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <User className="h-5 w-5 text-gray-600" />
              </button>
            ) : (
              <Link href="/login" className="p-2 rounded-full hover:bg-gray-100">
                <User className="h-5 w-5 text-gray-600" />
              </Link>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 ml-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-300 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`px-4 py-2 text-base font-medium ${
                    pathname === item.href ? 'text-gray-800' : 'text-gray-600'
                  }`}>
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <ProfileDrawer 
        isOpen={isProfileDrawerOpen} 
        onClose={() => setIsProfileDrawerOpen(false)} 
      />
    </nav>
  )
}