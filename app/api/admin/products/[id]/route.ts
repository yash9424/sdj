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
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    
    if (decoded.role !== 'admin' || decoded.email !== 'adminjwelery@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const formData = await request.formData()
    
    // Parse product details
    const productDetailsStr = formData.get('productDetails') as string
    let productDetails = {}
    if (productDetailsStr) {
      try {
        productDetails = JSON.parse(productDetailsStr)
      } catch (e) {
        console.error('Error parsing productDetails:', e)
      }
    }
    
    // Parse features
    const features = []
    for (let i = 1; i <= 4; i++) {
      const feature = formData.get(`feature${i}`) as string
      if (feature && feature.trim()) {
        features.push(feature.trim())
      }
    }
    
    // Handle image updates
    const timestamp = Date.now()
    const updateData: any = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: parseFloat(formData.get('discountedPrice') as string) || 0,
      mainPrice: parseFloat(formData.get('mainPrice') as string) || 0,
      description: formData.get('description') as string,
      stock: parseInt(formData.get('stock') as string) || 0,
      productDetails,
      features,
      inStock: parseInt(formData.get('stock') as string) > 0,
      updatedAt: new Date()
    }
    
    // Update main image if new one uploaded
    const mainImageFile = formData.get('mainImage') as File
    if (mainImageFile && mainImageFile.size > 0) {
      const uploadFormData = new FormData()
      uploadFormData.append('file', mainImageFile)
      const uploadResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/upload`, {
        method: 'POST',
        body: uploadFormData
      })
      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json()
        updateData.mainImage = uploadResult.url
        updateData.image = uploadResult.url
      }
    }
    
    // Update additional images if new ones uploaded
    const newImages = []
    for (let i = 1; i <= 4; i++) {
      const imageFile = formData.get(`image${i}`) as File
      if (imageFile && imageFile.size > 0) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
        const uploadResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/upload`, {
          method: 'POST',
          body: uploadFormData
        })
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          newImages.push(uploadResult.url)
        }
      }
    }
    if (newImages.length > 0) {
      updateData.images = newImages
    }

    const client = await clientPromise
    const db = client.db('jewelry_store')
    const products = db.collection('products')

    const result = await products.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
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