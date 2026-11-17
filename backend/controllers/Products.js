const Product = require('../models/Product')
const { uploadToCloudinary } = require('../cloudinary')

module.exports.allProducts = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const products = await Product.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    if (products.length === 0) {
        return res.status(404).json({
            message: 'No products found'
        })
    }

    const total = products.length;
    console.log('these are the products', products)
    res.json({
        products,
        pagination: {
            hasMore: (skip + products.length) < total
        }
    })

}

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

    if (req.files && req.files.length > 0) {

        const imageUrls = await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadToCloudinary(file.buffer);
                return result.secure_url;
            })
        );

        product.images = imageUrls;
    }
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