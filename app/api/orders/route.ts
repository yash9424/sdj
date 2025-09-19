import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { Order } from '@/models/Order'

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const orders = db.collection('orders')

    const orderData: Omit<Order, '_id'> = await request.json()
    
    // Generate order ID
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    const newOrder = {
      ...orderData,
      orderId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending',
      paymentStatus: 'pending'
    }

    const result = await orders.insertOne(newOrder)
    
    return NextResponse.json({ 
      success: true, 
      orderId: result.insertedId,
      orderNumber: orderId 
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const orders = db.collection('orders')

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const query = userId ? { userId } : {}
    const allOrders = await orders.find(query).sort({ createdAt: -1 }).toArray()
    
    const formattedOrders = allOrders.map(order => ({
      ...order,
      _id: order._id.toString()
    }))

    return NextResponse.json({ orders: formattedOrders })

  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}