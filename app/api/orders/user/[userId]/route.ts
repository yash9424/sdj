import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const orders = db.collection('orders')

    const userOrders = await orders
      .find({ userId: params.userId })
      .sort({ createdAt: -1 })
      .toArray()

    const formattedOrders = userOrders.map(order => ({
      ...order,
      _id: order._id.toString()
    }))

    return NextResponse.json({ orders: formattedOrders })

  } catch (error) {
    console.error('User orders fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}