const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

const MONGO_URI = process.env.MONGO_URI;

// We will connect to the cluster. The URI can point to any DB, 
// we will switch programs inside the script.
async function migrate() {
    try {
        console.log("🚀 Starting Migration...");
        
        // 1. Connect to MongoDB
        const client = await mongoose.connect(MONGO_URI);
        const db = client.connection.db;

        // 2. Identify Source and Destination
        // Note: Based on your URI, we are connected to the cluster.
        // We will explicitly use 'test' as source and 'codestorm' as destination.
        const sourceDb = mongoose.connection.client.db("test");
        const destDb = mongoose.connection.client.db("codestorm");

        // 3. Get all collections from 'test'
        const collections = await sourceDb.listCollections().toArray();
        console.log(`Found ${collections.length} collections in 'test' database.`);

        for (let collection of collections) {
            const name = collection.name;
            console.log(`📦 Copying collection: ${name}...`);

            // Get original data
            const data = await sourceDb.collection(name).find({}).toArray();
            
            if (data.length > 0) {
                // Drop existing collection in destination to avoid duplicates
                try {
                    await destDb.collection(name).drop();
                } catch (e) {
                    // Collection might not exist, ignore error
                }

                // Insert into new database
                await destDb.collection(name).insertMany(data);
                console.log(`✅ Successfully copied ${data.length} documents to 'codestorm.${name}'`);
            } else {
                console.log(`⚠️ Collection '${name}' is empty, skipping.`);
            }
        }

        console.log("\n✨ Migration Complete! Your data is now in 'codestorm'.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration Failed:", error);
        process.exit(1);
    }
}

migrate();
