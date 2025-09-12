import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const reviews = db.collection('reviews')

    const productReviews = await reviews.find({ productId: params.id }).toArray()
    
    const totalReviews = productReviews.length
    const averageRating = totalReviews > 0 
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0

    return NextResponse.json({ 
      reviews: productReviews,
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10
    })

  } catch (error) {
    console.error('Product reviews API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}