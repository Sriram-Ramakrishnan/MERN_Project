const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');

const app = express();

// Create a GET request and send the response to the server
app.get('/', (req,res) => res.send('API running'));

// Setting a port for the app
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{ console.log(`SERVER STARTED on port ${PORT}`)})