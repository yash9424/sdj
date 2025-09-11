import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const products = db.collection('products')

    const product = await products.findOne({ _id: new ObjectId(params.id) })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT request received for ID:', params.id)
    
    const formData = await request.formData()
    console.log('FormData received')
    
    const updateData = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: parseFloat(formData.get('discountedPrice') as string) || 0,
      description: formData.get('description'),
      material: formData.get('material'),
      stock: parseInt(formData.get('stock') as string) || 0,
      updatedAt: new Date()
    }
    
    console.log('Update data:', updateData)

    const client = await clientPromise
    const db = client.db('jewelry_store')
    const products = db.collection('products')

    const result = await products.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    console.log('Update result:', result)
    
    return NextResponse.json({ message: 'Product updated successfully' })

  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const products = db.collection('products')

    const result = await products.deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Product deleted successfully' })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}