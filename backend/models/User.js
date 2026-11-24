const mongoose = require('mongoose');
const { Schema } = mongoose;


const addressSchema = new Schema({
    title: String,
    lineOne: String,
    lineTwo: String,
    city: String,
    state: String,
    main: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    password: String,
    firstname: String,
    lastname: String,
    image: String,
    description: String,
    shippingAddress: [addressSchema]
}, { timestamps: true })


module.exports = mongoose.model('User', userSchema)