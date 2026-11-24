const mongoose = require('mongoose')
const { Schema } = mongoose;




const productSchema = new Schema({
    name: String,
    slug: String,
    price: Number,
    description: String,
    images: [String],
    category: String,
    stock: Number,
    isActive: Boolean,
    createdAt: { type: Date, default: Date.now }
})



module.exports = mongoose.model('Product', productSchema)

