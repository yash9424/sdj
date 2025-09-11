import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { username, email, mobile, password } = await request.json()

    const client = await clientPromise
    const db = client.db('jewelry_store')
    const users = db.collection('users')

    const existingUser = await users.findOne({ email }, { projection: { _id: 1 } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 4)

    const result = await users.insertOne({
      username,
      email,
      mobile,
      password: hashedPassword,
      createdAt: new Date()
    })

    return NextResponse.json({ 
      message: 'User created successfully',
      userId: result.insertedId 
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}