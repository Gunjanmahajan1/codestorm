require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');

// Connection Strings
const OLD_URI = "mongodb+srv://codestormadmin:codestorm@myatlasclusteredu.obntslx.mongodb.net/codestrom";
const NEW_URI = process.env.MONGO_URI;

// Import Models
const CoreTeam = require('../src/models/CoreTeam.model');
const Contact = require('../src/models/Contact.model');

const models = [
    { name: 'CoreTeam', model: CoreTeam },
    { name: 'Contact', model: Contact }
];

async function migrateSpecific() {
    let oldConn, newConn;
    try {
        console.log('Connecting to Old Database...');
        oldConn = await mongoose.createConnection(OLD_URI, { serverSelectionTimeoutMS: 5000 }).asPromise();
        console.log('✅ Connected to Old Database.');

        console.log('Connecting to New Database...');
        newConn = await mongoose.createConnection(NEW_URI, { serverSelectionTimeoutMS: 5000 }).asPromise();
        console.log('✅ Connected to New Database.');

        for (const item of models) {
            console.log(`Fetching data for ${item.name} from Old DB...`);
            const OldModel = oldConn.model(item.name, item.model.schema);
            const data = await OldModel.find({}).lean();

            console.log(`Found ${data.length} documents. Inserting into New DB...`);
            if (data.length > 0) {
                const NewModel = newConn.model(item.name, item.model.schema);
                await NewModel.deleteMany({});
                await NewModel.insertMany(data);
                console.log(`✅ ${item.name} migration complete.`);
            } else {
                console.log(`ℹ️ No documents found for ${item.name}.`);
            }
        }

        console.log('\n🌟 Specific Migration Completed Successfully!');
    } catch (error) {
        console.error('❌ Migration Failed:', error);
    } finally {
        if (oldConn) await oldConn.close();
        if (newConn) await newConn.close();
        process.exit(0);
    }
}

migrateSpecific();
