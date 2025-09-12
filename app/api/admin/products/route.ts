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
      projection: { name: 1, category: 1, price: 1, mainPrice: 1, image: 1, mainImage: 1, images: 1, description: 1, material: 1, color: 1, style: 1, metalWeight: 1, purity: 1, stock: 1, features: 1, inStock: 1, productDetails: 1, createdAt: 1 }
    }).sort({ createdAt: -1 }).limit(1000).toArray()
    
    const formattedProducts = allProducts.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      category: product.category,
      price: product.price,
      mainPrice: product.mainPrice,
      image: product.image,
      mainImage: product.mainImage,
      images: product.images,
      description: product.description,
      material: product.material,
      color: product.color,
      style: product.style,
      metalWeight: product.metalWeight,
      purity: product.purity,
      stock: product.stock,
      features: product.features,
      productDetails: product.productDetails,
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
    
    // Handle image uploads
    let mainImageUrl = ''
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
        mainImageUrl = uploadResult.url
      }
    }
    
    const imageUrls = []
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
          imageUrls.push(uploadResult.url)
        }
      }
    }
    
    const productData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      mainPrice: parseFloat(formData.get('mainPrice') as string),
      price: parseFloat(formData.get('discountedPrice') as string),
      description: formData.get('description') as string,
      stock: parseInt(formData.get('stock') as string) || 0,
      productDetails,
      features: [
        formData.get('feature1') as string,
        formData.get('feature2') as string,
        formData.get('feature3') as string,
        formData.get('feature4') as string
      ].filter(f => f && f.trim()),
      mainImage: mainImageUrl,
      image: mainImageUrl,
      images: imageUrls,
      inStock: parseInt(formData.get('stock') as string) > 0,
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
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}