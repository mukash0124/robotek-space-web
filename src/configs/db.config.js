const mongoose = require('mongoose');

const MONGO_DB_URI = process.env.MONGO_DB_URI;

const connectToDB = async () => {
    try {
        console.log('Connecting to the database...');
        const DBConnection = await mongoose.connect(MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Connected to the database: ${DBConnection.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectToDB;