import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    secondMobile: { type: String, default: null }
  },
  shippingAddress: {
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  items: [{
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    priceValue: { type: Number },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true }
  }],
  pricing: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  paymentMethod: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)