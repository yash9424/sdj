import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    
    // Test connection
    await db.admin().ping()
    
    // Get collections
    const collections = await db.listCollections().toArray()
    
    // Count users
    const usersCollection = db.collection('users')
    const userCount = await usersCollection.countDocuments()
    
    // Count products
    const productsCollection = db.collection('products')
    const productCount = await productsCollection.countDocuments()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      database: 'jewelry_store',
      collections: collections.map(c => c.name),
      counts: {
        users: userCount,
        products: productCount
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 })
  }
}