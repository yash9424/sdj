import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const client = await clientPromise
    const db = client.db('jewelry_store')

    const result = await db.collection('messages').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating message status:', error)
    return NextResponse.json({ error: 'Failed to update message status' }, { status: 500 })
  }
}