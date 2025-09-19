import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile, message } = await request.json()

    if (!name || !email || !mobile || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('jewelry')
    
    const newMessage = {
      name,
      email,
      mobile,
      message,
      status: 'unread',
      createdAt: new Date(),
    }

    await db.collection('messages').insertOne(newMessage)

    return NextResponse.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('Error saving message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('jewelry')
    const messages = await db.collection('messages').find({}).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}