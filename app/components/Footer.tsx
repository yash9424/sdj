import { Sparkles, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-white py-16 px-6  border-t border-gray-300">
      <div className="max-w-6xl mx-auto">
        {/* Contact CTA Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12 text-center border border-gray-300">
          <div className="flex items-center justify-center mb-4">
            <Heart className="text-gray-800 mr-2" size={24} />
            <h3 className="text-2xl font-bold text-gray-800">Stay Connected</h3>
          </div>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our community for exclusive offers, styling tips, and first access to new collections!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 hover:scale-110 transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 hover:scale-110 transition-all duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 hover:scale-110 transition-all duration-300">
                <Facebook size={20} />
              </a>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="mr-2" size={16} />
                hello@luxejewelry.com
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="mr-2" size={16} />
                +1 (555) 123-4567
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Image src="/logo.png" alt="Logo" width={32} height={52} />
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold text-gray-800 tracking-wide">
                  Scottsdale & Diamond
                </span>
                <span className="text-sm font-medium text-gray-600 uppercase tracking-widest">
                  Company
                </span>
              </div>
            </motion.div>
          </Link>
            </div>
            <p className="text-gray-600 mb-4">
              Crafting beautiful jewelry for life's special moments.
            </p>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="mr-2" size={16} />
              <span className="text-sm">123 Luxury Ave, NYC 10001</span>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-800">Quick Links</h4>
            <div className="space-y-3">
              <Link href="/jewelry" className="block text-gray-600 hover:text-gray-800 transition-colors hover:translate-x-1 duration-300">
                → Jewelry Collection
              </Link>
              <Link href="/boutique" className="block text-gray-600 hover:text-gray-800 transition-colors hover:translate-x-1 duration-300">
                → Personal Styling
              </Link>
              <Link href="/blog" className="block text-gray-600 hover:text-gray-800 transition-colors hover:translate-x-1 duration-300">
                → Style Blog
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-800">Collections</h4>
            <div className="space-y-3">
              <Link href="/jewelry" className="block text-gray-600 hover:text-gray-800 transition-colors hover:translate-x-1 duration-300">
                → Combo Set
              </Link>
              <Link href="/jewelry" className="block text-gray-600 hover:text-gray-800 transition-colors hover:translate-x-1 duration-300">
                → Necklace
              </Link>
              <Link href="/jewelry" className="block text-gray-600 hover:text-gray-800 transition-colors hover:translate-x-1 duration-300">
                → Earring
              </Link>
              <Link href="/jewelry" className="block text-gray-600 hover:text-gray-800 transition-colors hover:translate-x-1 duration-300">
                → Bengals
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-800">Customer Care</h4>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">📞 Mon-Sat 9AM-7PM EST</p>
              <p className="text-gray-600 text-sm">✨ Free shipping over $200</p>
              <p className="text-gray-600 text-sm">🔄 30-day returns</p>
              <p className="text-gray-600 text-sm">💎 Lifetime warranty</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-xs sm:text-sm mb-4 md:mb-0 text-center md:text-left">
              © 2024 Scottsdale & Diamond Company. All rights reserved. <br />
              Designed & Developed by <a href="https://www.technovatechnologies.com/" target="_blank" rel="noopener noreferrer" className="text-gray-800 font-medium hover:text-gray-600 transition-colors">Technova Technologies</a>
            </p>

            <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-600">
              <a href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-800 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-800 transition-colors">Size Guide</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}