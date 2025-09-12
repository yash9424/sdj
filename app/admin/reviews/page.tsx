'use client'

import { useState, useEffect } from 'react'
import { Star, Trash2, MessageSquare } from 'lucide-react'

interface Review {
  _id: string
  productId: string
  productName: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`/api/admin/reviews/${reviewId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setReviews(reviews.filter(review => review._id !== reviewId))
        }
      } catch (error) {
        console.error('Failed to delete review:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        <div className="ml-3 text-gray-600">Loading reviews...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Reviews Management</h1>
        <div className="text-gray-600">
          Total Reviews: <span className="font-semibold">{reviews.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Review</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{review.productName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-700">{review.userName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({review.rating})</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-700 max-w-xs truncate">{review.comment}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => deleteReview(review._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {reviews.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">Reviews will appear here once customers start reviewing products.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}