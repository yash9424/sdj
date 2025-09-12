import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const token = cookies().get('token')?.value
    let userId = null
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        userId = decoded.userId
      } catch (error) {
        // Continue without user ID if token is invalid
      }
    }

    const orderData = await request.json()
    
    // Generate order ID
    const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
    
    const order = new Order({
      orderId,
      userId,
      customerInfo: {
        name: orderData.name,
        email: orderData.email,
        mobile: orderData.mobile,
        secondMobile: orderData.secondMobile || null
      },
      shippingAddress: {
        address: orderData.address,
        state: orderData.state,
        city: orderData.city,
        pincode: orderData.pincode
      },
      items: orderData.items,
      pricing: {
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total
      },
      paymentMethod: orderData.paymentMethod,
      status: 'pending',
      createdAt: new Date()
    })

    await order.save()

    return NextResponse.json({ 
      success: true, 
      orderId: order.orderId,
      message: 'Order placed successfully' 
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const token = cookies().get('token')?.value
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const orders = await Order.find({ userId: decoded.userId }).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, orders })

  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}