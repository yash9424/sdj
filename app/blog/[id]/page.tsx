'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Share2, Instagram, Twitter, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '../../components/Footer'

const blogPosts = [
  {
    id: 1,
    title: 'The Art of Layering Jewelry: A Modern Guide',
    content: `
      <p>Jewelry layering has become one of the most exciting trends in modern fashion, allowing individuals to express their unique style through creative combinations of pieces.</p>

      <h2>Understanding the Basics</h2>
      <p>The key to successful jewelry layering lies in understanding balance, proportion, and harmony. Start with a focal point and build your layers by adding complementary pieces.</p>

      <h2>Necklace Layering Techniques</h2>
      <p>When layering necklaces, vary the lengths to create visual interest. Mix different chain styles and remember the rule of odd numbers for better balance.</p>

      <h2>Professional Tips</h2>
      <p>Start small and build your collection over time. Invest in versatile pieces that work with multiple outfits and occasions.</p>
    `,
    image: 'https://www.nobbier.com/wp-content/uploads/2024/11/the-ultimate-guide-to-layering-jewelry-776166.webp',
    author: 'Sarah Chen',
    date: '2024-01-15',
    category: 'Style Guide',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Sustainable Jewelry: Making Ethical Choices',
    content: `
      <p>In today's conscious world, sustainable jewelry has become more than just a trend—it's a responsibility. Learn how to make ethical choices that benefit both you and the planet.</p>

      <h2>What Makes Jewelry Sustainable?</h2>
      <p>Sustainable jewelry focuses on ethical sourcing, fair labor practices, and environmentally responsible production methods. This includes recycled metals, conflict-free gems, and transparent supply chains.</p>

      <h2>Choosing Ethical Brands</h2>
      <p>Look for certifications like Fairmined gold, recycled materials, and brands that support local communities. Research the company's values and practices before making a purchase.</p>

      <h2>Care and Longevity</h2>
      <p>Proper care extends the life of your jewelry, making it more sustainable. Regular cleaning, proper storage, and professional maintenance ensure your pieces last for generations.</p>
    `,
    image: 'https://images.utopia.org/rkOUrwUVyctzdRItWywYvjmpgc_YdeanexwwqGyOOn8/rt:fill/w:1152/h:864/g:ce/plain/2021/06/ethical-sustainable-jewelry-sc-instagram-omiwoods-shopsoko-210602-1280x720-1.jpg',
    author: 'Emma Rodriguez',
    date: '2024-01-12',
    category: 'Sustainability',
    readTime: '7 min read'
  },
  {
    id: 3,
    title: 'How to Clean Your Jewelry at Home',
    content: `
      <p>Keeping your jewelry sparkling doesn't always require professional cleaning. Learn safe and effective methods to clean your precious pieces at home.</p>

      <h2>Basic Cleaning Supplies</h2>
      <p>You'll need mild soap, soft brushes, microfiber cloths, and specific cleaners for different metals. Avoid harsh chemicals that can damage delicate stones or finishes.</p>

      <h2>Metal-Specific Care</h2>
      <p>Gold, silver, and platinum each require different care approaches. Understanding these differences helps maintain the beauty and integrity of your jewelry.</p>

      <h2>When to Seek Professional Help</h2>
      <p>Some pieces require professional attention, especially those with loose stones, intricate settings, or valuable gems. Know when to DIY and when to visit a jeweler.</p>
    `,
    image: 'https://watchandwares.com/wp-content/uploads/2021/02/iStock-1186205506-1030x580.jpg',
    author: 'Michael Kim',
    date: '2024-01-10',
    category: 'Care Tips',
    readTime: '4 min read'
  },
  {
    id: 4,
    title: 'Trending Now: Statement Earrings',
    content: `
      <p>Bold, beautiful, and utterly captivating - explore this season's most coveted earring trends that are making waves in the fashion world.</p>

      <h2>The Rise of Statement Pieces</h2>
      <p>Statement earrings have become the go-to accessory for adding drama and personality to any outfit. From oversized hoops to geometric designs, these pieces command attention.</p>

      <h2>Styling Tips</h2>
      <p>Balance is key when wearing statement earrings. Keep other jewelry minimal and let your earrings be the star. Consider your face shape and hair style for the most flattering look.</p>

      <h2>Investment Pieces</h2>
      <p>Choose versatile statement earrings that can transition from day to night. Quality craftsmanship ensures these bold pieces will remain stylish for years to come.</p>
    `,
    image: 'https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw3145d8dd/images/blog-images/perfect-pair-of-earrings-oval-face-hero-img.jpg',
    author: 'Lisa Park',
    date: '2024-01-08',
    category: 'Trends',
    readTime: '6 min read'
  },
  {
    id: 5,
    title: 'The History of Diamond Cuts',
    content: `
      <p>Journey through time to discover how diamond cutting techniques have evolved to create today's stunning gems, from ancient methods to modern precision.</p>

      <h2>Ancient Beginnings</h2>
      <p>Diamond cutting began in the 14th century with simple point cuts. Early craftsmen worked with the natural octahedral shape of rough diamonds, creating basic geometric forms.</p>

      <h2>The Renaissance Revolution</h2>
      <p>The 15th and 16th centuries brought significant advances, including the table cut and rose cut. These innovations began to unlock the diamond's potential for brilliance and fire.</p>

      <h2>Modern Precision</h2>
      <p>Today's round brilliant cut, perfected in 1919, maximizes light return through mathematical precision. Modern technology continues to push the boundaries of diamond cutting artistry.</p>
    `,
    image: 'https://watchandwares.com/wp-content/uploads/2021/02/iStock-1186205506-1030x580.jpg',
    author: 'David Wilson',
    date: '2024-01-05',
    category: 'Education',
    readTime: '8 min read'
  },
  {
    id: 6,
    title: 'Bridal Jewelry Trends 2024',
    content: `
      <p>From vintage-inspired pieces to modern minimalism, discover the bridal jewelry trends defining 2024 and find the perfect pieces for your special day.</p>

      <h2>Vintage Revival</h2>
      <p>Art Deco and Victorian-inspired pieces are making a comeback. Intricate details, milgrain work, and vintage cuts create timeless elegance for modern brides.</p>

      <h2>Minimalist Elegance</h2>
      <p>Clean lines and simple settings allow the beauty of the stones to shine. Delicate bands and understated designs appeal to contemporary sensibilities.</p>

      <h2>Colored Gemstones</h2>
      <p>Sapphires, emeralds, and other colored stones are gaining popularity as center stones and accents, adding personal meaning and unique beauty to bridal sets.</p>
    `,
    image: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202408/4-key-jewellery-trends-to-know-in-2024-224105130-3x4.png?VersionId=0pNIvQAqdHODT9ZBD6O_X7jYySSgNkHx',
    author: 'Anna Thompson',
    date: '2024-01-03',
    category: 'Bridal',
    readTime: '5 min read'
  }
]

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const blogPost = blogPosts.find(post => post.id === parseInt(params.id))
  
  if (!blogPost) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center mt-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-medium mt-6">
              Back to Blog
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-20 ">
      <div className="max-w-4xl mx-auto px-6 flex-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 mt-6"
        >
          <Link href="/blog">
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Blog
            </motion.button>
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-300 mb-6"
        >
          <div className="relative h-96">
            <Image
              src={blogPost.image}
              alt={blogPost.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="bg-gray-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4 inline-block">
                {blogPost.category}
              </span>
              <h1 className="text-4xl font-space font-bold text-white mb-4">
                {blogPost.title}
              </h1>
              <div className="flex items-center text-white/80 text-sm">
                <User size={16} className="mr-2" />
                <span className="mr-6">{blogPost.author}</span>
                <Calendar size={16} className="mr-2" />
                <span className="mr-6">{blogPost.date}</span>
                <span>{blogPost.readTime}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium"
                >
                  <Heart size={16} />
                  <span>Like</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </motion.button>
              </div>

              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800"
                >
                  <Instagram size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800"
                >
                  <Twitter size={18} />
                </motion.button>
              </div>
            </div>

            <div 
              className="text-gray-700 leading-relaxed space-y-6 prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />
          </div>
        </motion.article>
      </div>
      <Footer />
    </div>
  )
}