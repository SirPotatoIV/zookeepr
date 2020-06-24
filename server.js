const express = require('express');
const path = require('path');
// non-module variables
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const PORT = process.env.PORT || 3001;

const app = express();

// --- MIDDLEWARE ---
// ===================================
// parse incoming string or array data
app.use(express.urlencoded({extended: true}));
// parse incoming JSON data
app.use(express.json());
// serve static files
app.use(express.static('public'))
// ===================================

// --- Routes ---
// ===================================
// intialize api routes
app.use('/api', apiRoutes);
// intialize html routes
app.use('/', htmlRoutes);

app.listen(PORT, ()=>{
    console.log(`API server now on port ${PORT}!`);
})