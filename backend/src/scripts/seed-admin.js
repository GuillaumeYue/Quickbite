require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN = {
  email: 'guillaume@gmail.com',
  password: 'Alexporter1004',
  name: 'Guillaume',
  role: 'admin'
};

async function run() {
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI is not set');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('connected to mongodb');

  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    existing.name = ADMIN.name;
    existing.role = ADMIN.role;
    existing.password = ADMIN.password;
    await existing.save();
    console.log('admin updated: ' + ADMIN.email);
  } else {
    const u = new User(ADMIN);
    await u.save();
    console.log('admin created: ' + ADMIN.email);
  }

  console.log('done');
  await mongoose.disconnect();
}

run().catch(function(err) {
  console.log('seed-admin failed:', err.message);
  process.exit(1);
});
