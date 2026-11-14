const Product = require('../models/Product')



module.exports.createProduct = async (req, res) => {
    const { name, slug, category, price, description, stock, isActive } = req.body;
    const product = new Product({
        name,
        slug,
        category,
        price,
        description,
        stock,
        isActive
    })
    await product.save();
    console.log('this is the new product', product)
    res.json({
        messsage: 'Product added successfully',
        product
    })
}

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateProd = { ...req.body };
    const product = await Product.findByIdAndUpdate(id, { updateProd }, {
        returnDocument: 'after',
        runValidators: true
    });
    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        })
    }

    res.json({
        message: 'Product updated successfully',
        updateProd
    })
}

module.exports.softDeleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    product.isActive = !product.isActive
    await product.save()

    res.json({
        message: 'Product temporary deleted',
        product
    })
}