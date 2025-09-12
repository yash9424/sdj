import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()
    
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string }
    
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const users = db.collection('users')

    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12)
    
    await users.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { password: hashedNewPassword } }
    )

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}