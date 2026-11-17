const mongoose = require('mongoose')
const { Schema } = mongoose;



const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,

    }],
    totalAmount: Number,
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: String,
    paymentStatus: String,
    paymentReference: String,
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', orderSchema)