import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ 
      message: 'Backend is working!', 
      timestamp: new Date().toISOString(),
      status: 'success'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Backend error', 
      details: error.message 
    }, { status: 500 })
  }
}