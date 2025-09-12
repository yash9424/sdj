import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const reviews = db.collection('reviews')

    const allReviews = await reviews.find({}).sort({ createdAt: -1 }).toArray()
    
    const formattedReviews = allReviews.map(review => ({
      _id: review._id.toString(),
      productId: review.productId,
      productName: review.productName,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    }))

    return NextResponse.json({ reviews: formattedReviews })

  } catch (error) {
    console.error('Reviews API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}