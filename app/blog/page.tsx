'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Share2, Instagram, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '../components/Footer'

const blogPosts = [
  {
    id: 1,
    title: 'The Art of Layering Jewelry: A Modern Guide',
    excerpt: 'Discover how to master the art of jewelry layering with our expert tips and tricks for creating stunning, personalized looks.',
    image: 'https://www.nobbier.com/wp-content/uploads/2024/11/the-ultimate-guide-to-layering-jewelry-776166.webp',
    author: 'Sarah Chen',
    date: '2024-01-15',
    category: 'Style Guide',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Sustainable Jewelry: The Future is Ethical',
    excerpt: 'Learn about our commitment to sustainable practices and how ethical jewelry is shaping the future of luxury accessories.',
    image: 'https://images.utopia.org/rkOUrwUVyctzdRItWywYvjmpgc_YdeanexwwqGyOOn8/rt:fill/w:1152/h:864/g:ce/plain/2021/06/ethical-sustainable-jewelry-sc-instagram-omiwoods-shopsoko-210602-1280x720-1.jpg',
    author: 'Emma Rodriguez',
    date: '2024-01-12',
    category: 'Sustainability',
    readTime: '7 min read'
  },
  {
    id: 3,
    title: 'Caring for Your Precious Gems',
    excerpt: 'Essential tips for maintaining the brilliance and longevity of your favorite jewelry pieces.',
    image: 'data:image/jpeg;base64,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',
    author: 'Michael Kim',
    date: '2024-01-10',
    category: 'Care Tips',
    readTime: '4 min read'
  },
  {
    id: 4,
    title: 'Trending Now: Statement Earrings',
    excerpt: 'Bold, beautiful, and utterly captivating - explore this season\'s most coveted earring trends.',
    image: 'https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw3145d8dd/images/blog-images/perfect-pair-of-earrings-oval-face-hero-img.jpg',
    author: 'Lisa Park',
    date: '2024-01-08',
    category: 'Trends',
    readTime: '6 min read'
  },
  {
    id: 5,
    title: 'The History of Diamond Cuts',
    excerpt: 'Journey through time to discover how diamond cutting techniques have evolved to create today\'s stunning gems.',
    image: 'https://watchandwares.com/wp-content/uploads/2021/02/iStock-1186205506-1030x580.jpg',
    author: 'David Wilson',
    date: '2024-01-05',
    category: 'Education',
    readTime: '8 min read'
  },
  {
    id: 6,
    title: 'Bridal Jewelry Trends 2024',
    excerpt: 'From vintage-inspired pieces to modern minimalism, discover the bridal jewelry trends defining 2024.',
    image: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202408/4-key-jewellery-trends-to-know-in-2024-224105130-3x4.png?VersionId=0pNIvQAqdHODT9ZBD6O_X7jYySSgNkHx',
    author: 'Anna Thompson',
    date: '2024-01-03',
    category: 'Bridal',
    readTime: '5 min read'
  }
]

const categories = ['All', 'Style Guide', 'Sustainability', 'Care Tips', 'Trends', 'Education', 'Bridal']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [visiblePosts, setVisiblePosts] = useState(6)

  const filteredPosts = blogPosts.filter(post => 
    selectedCategory === 'All' || post.category === selectedCategory
  )

  const loadMore = () => {
    setVisiblePosts(prev => prev + 3)
  }

  return (
    <div className="min-h-screen flex flex-col pt-19 bg-white">
      <div className="max-w mx-auto flex-1 mb-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-96 flex items-center relative mb-16"
        >
          <div className="absolute inset-0 rounded-3xl mx-6 overflow-hidden shadow-2xl">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 via-gray-100/70 to-gray-800/80" />
          </div>
          
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center px-6 w-full flex items-center justify-center"
          >
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent w-20" />
                <span className="mx-4 text-3xl">💎</span>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent w-20" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-space font-bold text-gray-800 mb-4">
                Jewelry Journal
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                Stories, tips, and inspiration from the world of fine jewelry
              </p>
              
              <div className="flex items-center justify-center mt-6">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent w-32" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all backdrop-blur-sm ${
                selectedCategory === category
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mx-4 sm:mx-6 lg:mx-9"
        >
          {filteredPosts.slice(0, visiblePosts).map((post, index) => (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden group cursor-pointer shadow-xl border border-gray-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gray-800/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <User size={14} className="mr-2" />
                  <span className="mr-4">{post.author}</span>
                  <Calendar size={14} className="mr-2" />
                  <span className="mr-4">{post.date}</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h2>

                <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <Link href={`/blog/${post.id}`}>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="flex items-center text-gray-800 hover:text-gray-600 font-medium"
                    >
                      Read More
                      <ArrowRight size={16} className="ml-2" />
                    </motion.button>
                  </Link>

                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800"
                    >
                      <Share2 size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800"
                    >
                      <Instagram size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800"
                    >
                      <Twitter size={14} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Load More Button */}
        {visiblePosts < filteredPosts.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              className="bg-gradient-to-r from-[#D4AF37] to-[#CBAE8E] text-[#FFFAF3] px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
            >
              Load More Stories
            </motion.button>
          </motion.div>
        )}

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 bg-white backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-xl border border-gray-300 mx-4 sm:mx-6 lg:mx-9"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            Stay in the Loop
          </h3>
          <p className="text-gray-600 mb-6">
            Get the latest jewelry trends and styling tips delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 sm:gap-0">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-gray-100 border border-gray-300 rounded-l-lg px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-gray-800 focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-r-lg font-medium"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}