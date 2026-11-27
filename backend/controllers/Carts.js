const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { listeners } = require('../models/User');


module.exports.addTocart = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    // const { price = product.price, quantity = 1 } = req.body;
    const quantity = 1
    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        })
    }

    let cart = await Cart.findOne({ user: req.user.userId })
    if (!cart) {
        cart = new Cart({
            user: req.user.userId,
            items: [{
                product: productId,
                quantity
            }]
        })
    } else {
        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        )
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 0) + quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
    }

    await cart.save()
    await cart.populate('items.product', 'name slug price images stock isActive')
    res.json({
        message: 'Item added to card',
        cart
    })
}


module.exports.updateQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
        return res.status(400).json({ message: 'Quantity must be a number' });
    }
    const updatedCart = await Cart.findOneAndUpdate(
        { user: req.user.userId, "items.product": productId },
        { $set: { "items.$.quantity": quantity } },
        { returnDocument: 'after' }
    ).populate('items.product', 'name slug price images stock isActive')
    if (!updatedCart) {
        return res.status(404).json({
            message: 'Item not found'
        })
    }
    res.json({
        message: 'Quantity updated',
        updatedCart
    })

}





module.exports.deleteFromCart = async (req, res) => {
    const { productId } = req.params;
    const cart = await Cart.findOneAndUpdate(
        { user: req.user.userId },
        { $pull: { items: { product: productId } } },
        { returnDocument: true }
    )

    if (!cart) {
        return res.status(404).json({
            message: 'Item not found'
        })
    }
    res.json({
        message: 'Item removed this cart',
        cart
    })
    console.log('item removed')
}

module.exports.userCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    if (!cart) {
        return res.status(404).json({
            message: 'Your cart is currently empty'
        })
    }
    // console.log(cart.items)
    res.json(cart)
}