import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { productId, productName, userName, rating, comment } = await request.json()

    const client = await clientPromise
    const db = client.db('jewelry_store')
    const reviews = db.collection('reviews')

    const newReview = {
      productId,
      productName,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString()
    }

    const result = await reviews.insertOne(newReview)

    return NextResponse.json({ 
      success: true, 
      reviewId: result.insertedId.toString() 
    })

  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}