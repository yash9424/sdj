import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const products = db.collection('products')

    const allProducts = await products.find({ inStock: true }, { 
      projection: { 
        name: 1, 
        category: 1, 
        price: 1, 
        mainPrice: 1, 
        image: 1, 
        mainImage: 1, 
        images: 1, 
        description: 1, 
        material: 1, 
        features: 1, 
        rating: 1, 
        reviews: 1,
        productDetails: 1
      }
    }).sort({ createdAt: -1 }).toArray()
    
    const formattedProducts = allProducts.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      category: product.category,
      price: product.price,
      mainPrice: product.mainPrice,
      image: product.mainImage || product.image,
      images: product.images || [],
      description: product.description,
      material: product.material,
      features: product.features || [],
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      productDetails: product.productDetails || {}
    }))

    return NextResponse.json({ products: formattedProducts })

  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}