const Cart = require('../models/Cart');
const Product = require('../models/Product');


module.exports.addTocart = async (req, res) => {
    const { productId } = req.params;
    const { price, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        })
    }
    if (price !== undefined && product.price !== price) {
        return res.status(400).json({
            message: 'You have an outdated price'
        });
    }
    if (quantity > product.stock) {
        return res.status(404).json({
            message: 'Product out of stock'
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
            (item) => item.product.toString === productId
        )
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            cart.items.push({ product: productId, quantity });
        }
    }

    // const 

    console.log(cart)
    await cart.save()
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
        { $inc: { "items.$.quantity": quantity } },
        { new: true }
    );
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
        message: 'Item removed this cart item',
        cart
    })
    console.log('item removed')
}

module.exports.userCart = async (req, res) => {
    const cart = await Cart.find({ user: req.user.userId });
    if (!cart) {
        res.status(404).json({
            message: 'Your cart is currently empty'
        })
    }
    console.log(cart.items)
    res.json(cart)
}