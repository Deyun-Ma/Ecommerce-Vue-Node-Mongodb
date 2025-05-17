import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get all products
// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product by ID
// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a product
// POST /api/products
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, inStock, quantity } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      user: req.user._id,
      imageUrl: imageUrl || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg',
      inStock: inStock !== undefined ? inStock : true,
      quantity: quantity || 0
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a product
// PUT /api/products/:id
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, inStock, quantity } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.category = category || product.category;
      product.imageUrl = imageUrl || product.imageUrl;
      product.inStock = inStock !== undefined ? inStock : product.inStock;
      product.quantity = quantity !== undefined ? quantity : product.quantity;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a product
// DELETE /api/products/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;