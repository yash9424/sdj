export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

export interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface Order {
  _id?: string
  orderId: string
  userId?: string
  customerEmail: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'cod' | 'online'
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: Date
  updatedAt: Date
}