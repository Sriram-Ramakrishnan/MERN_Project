const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const connectDB = require('./config/db')

const app = express();

// Connect the database:
connectDB();

// Init Middleware:
app.use(express.json({extended: false }))

// Create a GET request and send the response to the server
app.get('/', (req,res) => res.send('API running'));
// Define and access routes:
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));



// Setting a port for the app
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{ console.log(`SERVER STARTED on port ${PORT}`)})