require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product')

const sampleProducts = [
    {
        name: 'Wireless Mechanical Keyboard',
        slug: 'wireless-mechanical-keyboard',
        price: 129.99,
        description: 'Compact 75% wireless mechanical keyboard with hot-swappable tactile switches and RGB backlighting.',
        images: [
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
            'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
        ],
        category: 'Electronics',
        stock: 42,
        isActive: true,
    },
    {
        name: 'Ergonomic Mesh Office Chair',
        slug: 'ergonomic-mesh-office-chair',
        price: 289.00,
        description: 'Breathable high-back mesh desk chair with adjustable lumbar support and 3D armrests.',
        images: [
            'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800',
        ],
        category: 'Furniture',
        stock: 15,
        isActive: true,
    },
    {
        name: 'Insulated Stainless Steel Tumbler',
        slug: 'insulated-stainless-steel-tumbler',
        price: 24.50,
        description: 'Double-wall vacuum insulated 24oz travel tumbler that keeps drinks cold for 24 hours.',
        images: [
            'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        ],
        category: 'Drinkware',
        stock: 110,
        isActive: true,
    },
    {
        name: 'Minimalist Leather Backpack',
        slug: 'minimalist-leather-backpack',
        price: 159.00,
        description: 'Full-grain water-resistant leather everyday backpack with a padded 16-inch laptop sleeve.',
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        ],
        category: 'Accessories',
        stock: 8,
        isActive: true,
    },
    {
        name: 'USB-C Multiport Hub Adapter',
        slug: 'usb-c-multiport-hub-adapter',
        price: 45.00,
        description: '7-in-1 aluminum USB-C hub featuring 4K HDMI, 100W Power Delivery, SD card reader, and USB 3.0 ports.',
        images: [
            'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=800',
        ],
        category: 'Electronics',
        stock: 0,
        isActive: false,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing products before inserting fresh seed data
        await Product.deleteMany({});
        console.log('Cleared existing products.');

        const inserted = await Product.insertMany(sampleProducts);
        console.log(`Seeded ${inserted.length} products successfully.`);
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

seedDB();