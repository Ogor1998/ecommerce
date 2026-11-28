const mongoose = require('mongoose')
const { Schema } = mongoose;




const productSchema = new Schema({
    name: String,
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    price: Number,
    description: String,
    images: [String],
    category: String,
    stock: Number,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: { type: Date, default: Date.now }
})



module.exports = mongoose.model('Product', productSchema)

