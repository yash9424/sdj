import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const orders = db.collection('orders')

    const order = await orders.findOne({ _id: new ObjectId(params.id) })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const formattedOrder = {
      ...order,
      _id: order._id.toString()
    }

    return NextResponse.json({ order: formattedOrder })

  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}