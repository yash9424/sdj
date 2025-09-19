import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    
    if (decoded.role === 'admin' && decoded.email === 'adminjwelery@gmail.com') {
      return NextResponse.json({
        admin: {
          id: 'admin',
          email: decoded.email,
          role: 'admin',
          username: 'Admin'
        }
      })
    }

    return NextResponse.json({ error: 'Not an admin' }, { status: 403 })

  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}