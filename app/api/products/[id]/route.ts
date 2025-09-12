import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('jewelry_store')
    const products = db.collection('products')

    const product = await products.findOne({ _id: new ObjectId(params.id) })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const formattedProduct = {
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
      productDetails: product.productDetails || {},
      stock: product.stock || 0,
      inStock: product.inStock
    }

    return NextResponse.json({ product: formattedProduct })

  } catch (error) {
    console.error('Product API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}