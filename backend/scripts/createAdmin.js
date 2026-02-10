require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../src/models/User.model');

const adminData = {
    name: "Admin User",
    email: "workspacelocked@gmail.com",
    password: "codestormadmin",
    role: "admin"
};

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin with this email already exists.');
        } else {
            const admin = new User(adminData);
            await admin.save();
            console.log('✅ Admin user created successfully!');
            console.log('Email:', adminData.email);
            console.log('Password:', adminData.password);
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
})();
