const express = require('express');

const app = express();

const port = 3000;
app.listen(port,()=>{
    console.log(`The server is running on http://localhost:${port}`);
});

function home(req,res) {
    res.send('Welcome to Express Page');
}

app.get('/',home);