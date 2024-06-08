const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const homeRoutes = require('./routes/homeRoutes');

const app = express();

const port = 3000;
app.listen(port,()=>{
    console.log(`The server is running on http://localhost:${port}`);
});

function home(req,res) {
    res.send('Welcome to Express Page');
}

app.use(express.json());
// The name of the db is 'bitMages-db'
mongoose.connect('mongodb://localhost:27017/bitMages-db');

app.use(userRoutes);
app.use('/',homeRoutes);