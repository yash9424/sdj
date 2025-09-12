'use client'

import { useState, useEffect } from 'react'
import { Star, Trash2, MessageSquare, Edit, Check, X } from 'lucide-react'
import ConfirmModal from '../components/ConfirmModal'

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
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [editingReview, setEditingReview] = useState<string | null>(null)
  const [editData, setEditData] = useState({ rating: 5, comment: '' })
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} })

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
    setConfirmModal({
      isOpen: true,
      title: 'Delete Review',
      message: 'Are you sure you want to delete this review? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/reviews/${reviewId}`, {
            method: 'DELETE'
          })
          if (response.ok) {
            setReviews(reviews.filter(review => review._id !== reviewId))
            setSelectedReviews(selectedReviews.filter(id => id !== reviewId))
          }
        } catch (error) {
          console.error('Failed to delete review:', error)
        }
      }
    })
  }

  const bulkDeleteReviews = async () => {
    if (selectedReviews.length === 0) return
    setConfirmModal({
      isOpen: true,
      title: 'Delete Multiple Reviews',
      message: `Are you sure you want to delete ${selectedReviews.length} selected reviews? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await Promise.all(
            selectedReviews.map(id => 
              fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
            )
          )
          setReviews(reviews.filter(review => !selectedReviews.includes(review._id)))
          setSelectedReviews([])
        } catch (error) {
          console.error('Failed to delete reviews:', error)
        }
      }
    })
  }

  const updateReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })
      if (response.ok) {
        setReviews(reviews.map(review => 
          review._id === reviewId 
            ? { ...review, rating: editData.rating, comment: editData.comment }
            : review
        ))
        setEditingReview(null)
      }
    } catch (error) {
      console.error('Failed to update review:', error)
    }
  }

  const toggleSelectAll = () => {
    if (selectedReviews.length === filteredReviews.length) {
      setSelectedReviews([])
    } else {
      setSelectedReviews(filteredReviews.map(review => review._id))
    }
  }

  const toggleSelectReview = (reviewId: string) => {
    if (selectedReviews.includes(reviewId)) {
      setSelectedReviews(selectedReviews.filter(id => id !== reviewId))
    } else {
      setSelectedReviews([...selectedReviews, reviewId])
    }
  }

  const filteredReviews = ratingFilter 
    ? reviews.filter(review => review.rating === ratingFilter)
    : reviews

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Reviews Management</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Rating Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setRatingFilter(null)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  ratingFilter === null 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setRatingFilter(rating)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-sm font-medium transition-colors ${
                    ratingFilter === rating 
                      ? 'bg-yellow-400 text-gray-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{rating}</span>
                  <Star size={12} className="fill-current" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {selectedReviews.length > 0 && (
              <button
                onClick={bulkDeleteReviews}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete Selected ({selectedReviews.length})</span>
              </button>
            )}
            <div className="text-gray-600">
              Total Reviews: <span className="font-semibold">{filteredReviews.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Review</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review._id} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedReviews.includes(review._id) ? 'bg-blue-50' : ''}`}>
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedReviews.includes(review._id)}
                        onChange={() => toggleSelectReview(review._id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{review.productName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-700">{review.userName}</div>
                    </td>
                    <td className="py-4 px-4">
                      {editingReview === review._id ? (
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setEditData({...editData, rating: star})}
                              className={`text-lg ${star <= editData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      ) : (
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
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {editingReview === review._id ? (
                        <textarea
                          value={editData.comment}
                          onChange={(e) => setEditData({...editData, comment: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          rows={2}
                        />
                      ) : (
                        <div className="text-gray-700 max-w-xs truncate">{review.comment}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        {editingReview === review._id ? (
                          <>
                            <button
                              onClick={() => updateReview(review._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Save Changes"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => setEditingReview(null)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingReview(review._id)
                                setEditData({ rating: review.rating, comment: review.comment })
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Review"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteReview(review._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredReviews.length === 0 && reviews.length > 0 && (
              <div className="text-center py-12">
                <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Reviews Found</h3>
                <p className="text-gray-600">No reviews match the selected {ratingFilter}-star rating filter.</p>
                <button
                  onClick={() => setRatingFilter(null)}
                  className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Filter
                </button>
              </div>
            )}
            
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
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}