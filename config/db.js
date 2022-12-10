// Required modules:
const mongoose  = require("mongoose");
mongoose.set('strictQuery', false);
const config  = require("config");
// Fetch this from default.json
// Store your mongoDB URI there!
const db = config.get('mongoURI');

// Async await function
const connectDB = async ()=> {
    try {
        await mongoose.connect(db);
        console.log("MongoDB Connected")
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

// Export to use in server.js
module.exports = connectDB;