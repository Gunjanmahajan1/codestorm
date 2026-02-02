require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../src/models/User.model');

const uri = process.env.MONGO_URI;

(async () => {
  try {
    await mongoose.connect(uri, { autoIndex: true });
    const admins = await User.find({ role: 'admin' }).select('-password');
    const students = await User.find({ role: 'student' }).select('-password').limit(10);
    console.log('Admins:', admins);
    console.log('Some students:', students);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();