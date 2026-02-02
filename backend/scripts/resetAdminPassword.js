require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../src/models/User.model');

const uri = process.env.MONGO_URI;
const email = 'admin@codestrom.com';
const newPassword = 'Admin@123';

(async () => {
  try {
    await mongoose.connect(uri, { autoIndex: true });
    const user = await User.findOne({ email });
    if (!user) {
      console.error('Admin not found');
      process.exit(1);
    }
    user.password = newPassword;
    await user.save();
    console.log('Password reset successful for', email);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();