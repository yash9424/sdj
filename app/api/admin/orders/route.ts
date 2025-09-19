import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const orders = db.collection('orders')

    const allOrders = await orders.find({}).sort({ createdAt: -1 }).toArray()
    
    const formattedOrders = allOrders.map(order => ({
      ...order,
      _id: order._id.toString()
    }))

    return NextResponse.json({ orders: formattedOrders })

  } catch (error) {
    console.error('Admin orders fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const orders = db.collection('orders')

    const { orderId, status, paymentStatus } = await request.json()

    const result = await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { 
        $set: { 
          status,
          paymentStatus,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const orders = db.collection('orders')

    const { orderId } = await request.json()

    const result = await orders.deleteOne(
      { _id: new ObjectId(orderId) }
    )

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Order delete error:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}