import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const reviews = db.collection('reviews')

    await reviews.deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete review error:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { rating, comment } = await request.json()
    
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const reviews = db.collection('reviews')

    await reviews.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { rating, comment } }
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Update review error:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}