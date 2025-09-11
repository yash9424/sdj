import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    
    if (decoded.role !== 'admin' || decoded.email !== 'adminjwelery@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db('jewelry_store')
    const users = db.collection('users')

    const allUsers = await users.find({}, { 
      projection: { username: 1, email: 1, mobile: 1, createdAt: 1, isBlocked: 1 }
    }).sort({ createdAt: -1 }).limit(1000).toArray()
    
    const formattedUsers = allUsers.map(user => ({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      createdAt: user.createdAt || new Date().toISOString(),
      isBlocked: user.isBlocked || false
    }))

    return NextResponse.json({ users: formattedUsers })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}