const express = require('express');
const mongoose = require('mongoose');

const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');
const tokenAuth = require('./middleware/auth');

const app = express();

const port = 3000;
app.listen(port,()=>{
    console.log(`The server is running on http://localhost:${port}`);
});

app.use(express.json());
// The name of the db is 'bitMages-db'

// mongoose.connect('mongodb://localhost:27017/bitMages-db');
const dbConnect = process.env.dbConStr || 'mongodb+srv://admin:admin@samadscluster.a4s9jvf.mongodb.net/bitMages-db';
mongoose.connect(dbConnect);

app.use(userRoutes);
app.use(homeRoutes);

app.use(tokenAuth);