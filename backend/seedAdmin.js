const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });

    if (adminExists) {
      // Update admin privileges if not set
      if (!adminExists.isAdmin) {
        adminExists.isAdmin = true;
        await adminExists.save();
        console.log('Admin privileges updated');
      } else {
        console.log('Admin user already exists with correct privileges');
      }
    } else {
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);

      const admin = new User({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        isAdmin: true,
      });

      await admin.save();
      console.log('Admin user created successfully');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedAdmin();
