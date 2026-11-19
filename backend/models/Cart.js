const mongoose = require('mongoose')
const { Schema } = mongoose;


const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }]
})




module.exports = mongoose.model('Cart', cartSchema)