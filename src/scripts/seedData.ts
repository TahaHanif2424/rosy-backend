import mongoose from 'mongoose';
import Category from '../models/Category';
import Product from '../models/Product';
import { config } from '../config/env';

const categories = [
  {
    name: 'Necklaces',
    description: 'Beautiful necklaces for every occasion',
  },
  {
    name: 'Earrings',
    description: 'Elegant earrings to complement your style',
  },
  {
    name: 'Bracelets',
    description: 'Stunning bracelets and bangles',
  },
  {
    name: 'Rings',
    description: 'Exquisite rings for special moments',
  },
];

const products = [
  // Necklaces
  {
    name: 'Diamond Pendant Necklace',
    category: 'Necklaces',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80',
    description: 'Elegant diamond pendant necklace with 18k gold chain',
  },
  {
    name: 'Pearl Strand Necklace',
    category: 'Necklaces',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
    description: 'Classic pearl strand necklace perfect for formal occasions',
  },
  {
    name: 'Rose Gold Chain Necklace',
    category: 'Necklaces',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
    description: 'Delicate rose gold chain with heart pendant',
  },
  {
    name: 'Statement Crystal Necklace',
    category: 'Necklaces',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80',
    description: 'Bold statement necklace with stunning crystals',
  },

  // Earrings
  {
    name: 'Diamond Stud Earrings',
    category: 'Earrings',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=500&q=80',
    description: 'Timeless diamond stud earrings in white gold',
  },
  {
    name: 'Hoop Earrings',
    category: 'Earrings',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80',
    description: 'Classic gold hoop earrings',
  },
  {
    name: 'Pearl Drop Earrings',
    category: 'Earrings',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1564042229876-a399970a5c2c?w=500&q=80',
    description: 'Elegant pearl drop earrings with silver setting',
  },
  {
    name: 'Crystal Dangle Earrings',
    category: 'Earrings',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&q=80',
    description: 'Sparkling crystal dangle earrings for special occasions',
  },

  // Bracelets
  {
    name: 'Tennis Bracelet',
    category: 'Bracelets',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
    description: 'Classic tennis bracelet with brilliant diamonds',
  },
  {
    name: 'Charm Bracelet',
    category: 'Bracelets',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=80',
    description: 'Silver charm bracelet with decorative charms',
  },
  {
    name: 'Gold Bangle Set',
    category: 'Bracelets',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
    description: 'Set of three gold bangles with intricate designs',
  },
  {
    name: 'Leather Wrap Bracelet',
    category: 'Bracelets',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1588444650700-67508a8d9f8e?w=500&q=80',
    description: 'Trendy leather wrap bracelet with gold accents',
  },

  // Rings
  {
    name: 'Solitaire Diamond Ring',
    category: 'Rings',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
    description: 'Stunning solitaire diamond engagement ring',
  },
  {
    name: 'Wedding Band Set',
    category: 'Rings',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
    description: 'Matching wedding band set in white gold',
  },
  {
    name: 'Stackable Ring Set',
    category: 'Rings',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=500&q=80',
    description: 'Set of five stackable rings in mixed metals',
  },
  {
    name: 'Gemstone Cocktail Ring',
    category: 'Rings',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=500&q=80',
    description: 'Bold cocktail ring with emerald gemstone',
  },
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create categories (one by one to trigger pre-save hook)
    const createdCategories = [];
    for (const cat of categories) {
      const category = await Category.create(cat);
      createdCategories.push(category);
    }
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create a map of category names to IDs
    const categoryMap = new Map();
    createdCategories.forEach((cat) => {
      categoryMap.set(cat.name, cat._id);
    });

    // Create products with category references
    const productsWithCategories = products.map((product) => ({
      ...product,
      category: categoryMap.get(product.category),
    }));

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Display summary
    console.log('\n📊 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    createdCategories.forEach((cat) => {
      const productCount = createdProducts.filter(
        (p) => p.category.toString() === cat._id.toString()
      ).length;
      console.log(`${cat.name}: ${productCount} products`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
