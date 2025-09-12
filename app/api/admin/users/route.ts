import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    // Skip auth for testing - remove this in production
    // const token = request.cookies.get('token')?.value
    // if (!token) {
    //   return NextResponse.json({ error: 'No token found' }, { status: 401 })
    // }

    const client = await clientPromise
    const db = client.db('jewelry_store')
    const usersCollection = db.collection('users')

    const allUsers = await usersCollection.find({}).toArray()
    
    const formattedUsers = allUsers.map(user => ({
      _id: user._id.toString(),
      username: user.username || 'Unknown',
      email: user.email || 'No email',
      mobile: user.mobile || null,
      createdAt: user.createdAt || new Date().toISOString(),
      isBlocked: user.isBlocked || false
    }))

    return NextResponse.json({ 
      users: formattedUsers,
      count: formattedUsers.length 
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message,
      users: [] 
    }, { status: 500 })
  }
}