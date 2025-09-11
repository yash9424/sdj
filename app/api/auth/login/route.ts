import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Check for admin credentials
    if (email === 'adminjwelery@gmail.com' && password === 'admin123') {
      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      )

      const response = NextResponse.json({
        message: 'Admin login successful',
        user: { email, role: 'admin', username: 'Admin' },
        isAdmin: true
      })

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      return response
    }

    // Regular user login
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const users = db.collection('users')

    const user = await users.findOne({ email }, { projection: { username: 1, email: 1, mobile: 1, password: 1, isBlocked: 1 } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (user.isBlocked) {
      return NextResponse.json({ error: 'Account has been blocked. Please contact support.' }, { status: 403 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile
      }
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return response

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}