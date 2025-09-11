import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
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

    const allProducts = await products.find({}, { 
      projection: { name: 1, category: 1, price: 1, image: 1, description: 1, material: 1, inStock: 1, createdAt: 1 }
    }).sort({ createdAt: -1 }).limit(1000).toArray()
    
    const formattedProducts = allProducts.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
      material: product.material,
      inStock: product.inStock || true,
      createdAt: product.createdAt || new Date().toISOString()
    }))

    return NextResponse.json({ products: formattedProducts })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    
    const productData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      mainPrice: parseFloat(formData.get('mainPrice') as string),
      discountedPrice: parseFloat(formData.get('discountedPrice') as string),
      price: parseFloat(formData.get('discountedPrice') as string),
      description: formData.get('description') as string,
      material: formData.get('material') as string,
      color: formData.get('color') as string,
      style: formData.get('style') as string,
      metalWeight: formData.get('metalWeight') as string,
      purity: formData.get('purity') as string,
      features: [
        formData.get('feature1') as string,
        formData.get('feature2') as string,
        formData.get('feature3') as string,
        formData.get('feature4') as string
      ].filter(f => f),
      mainImage: formData.get('mainImage') ? 'uploaded' : '',
      images: [
        formData.get('image1') ? 'uploaded' : '',
        formData.get('image2') ? 'uploaded' : '',
        formData.get('image3') ? 'uploaded' : '',
        formData.get('image4') ? 'uploaded' : ''
      ].filter(img => img),
      image: formData.get('mainImage') ? 'uploaded' : '',
      inStock: true,
      rating: 4.5,
      reviews: 0,
      createdAt: new Date()
    }

    const client = await clientPromise
    const db = client.db('jewelry_store')
    const products = db.collection('products')

    const result = await products.insertOne(productData)

    return NextResponse.json({ 
      message: 'Product added successfully',
      productId: result.insertedId
    })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}