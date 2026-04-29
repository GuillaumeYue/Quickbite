require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const items = [
  {
    name: 'Cheeseburger Deluxe',
    description: 'Beef patty with cheddar, fried egg, bacon, lettuce, tomato and red onion on a sesame bun. Served with fries.',
    price: 14.99,
    category: 'mains',
    imageUrl: '/images/burger.png',
    available: true
  },
  {
    name: 'Spicy Tonkotsu Ramen',
    description: 'Rich pork bone broth with chashu, soft boiled egg, corn, scallions and bok choy. House made noodles.',
    price: 13.50,
    category: 'mains',
    imageUrl: '/images/ramen.png',
    available: true
  },
  {
    name: 'Garlic Shrimp Pasta',
    description: 'Pan seared shrimp tossed with angel hair pasta, cherry tomatoes, fresh chives and a hint of chili.',
    price: 16.99,
    category: 'mains',
    imageUrl: '/images/seafood-pasta.png',
    available: true
  },
  {
    name: 'Italian Meatballs',
    description: 'House made beef and pork meatballs over fresh arugula, finished with olive oil and sea salt.',
    price: 9.50,
    category: 'sides',
    imageUrl: '/images/meatballs.png',
    available: true
  },
  {
    name: 'Tomato Bisque',
    description: 'Creamy roasted tomato soup with fresh herbs and a swirl of basil oil.',
    price: 6.99,
    category: 'sides',
    imageUrl: '/images/soup.png',
    available: true
  },
  {
    name: 'Berry French Toast',
    description: 'Brioche soaked in vanilla custard, pan fried golden, topped with bananas, blueberries and maple syrup.',
    price: 10.99,
    category: 'dessert',
    imageUrl: '/images/french-toast.png',
    available: true
  },
  {
    name: 'Iced Lemon Tea',
    description: 'House brewed black tea with fresh lemon and a touch of honey, served over ice.',
    price: 4.50,
    category: 'drinks',
    imageUrl: '',
    available: true
  },
  {
    name: 'Sparkling Water',
    description: 'Chilled sparkling water, 500ml bottle.',
    price: 3.00,
    category: 'drinks',
    imageUrl: '',
    available: true
  }
];

async function run() {
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI is not set');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('connected to mongodb');

  const args = process.argv.slice(2);
  if (args.indexOf('--clear') !== -1) {
    const r = await MenuItem.deleteMany({});
    console.log('removed ' + r.deletedCount + ' existing items');
  }

  let added = 0;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const existing = await MenuItem.findOne({ name: it.name });
    if (existing) {
      console.log('skip (already exists): ' + it.name);
      continue;
    }
    await MenuItem.create(it);
    added = added + 1;
    console.log('added: ' + it.name);
  }

  console.log('done. ' + added + ' new items added.');
  await mongoose.disconnect();
}

run().catch(function(err) {
  console.log('seed failed:', err.message);
  process.exit(1);
});
