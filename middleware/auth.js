const jwt = require('jsonwebtoken');
const config = require('../config/index');

function tokenAuth(req,res,next) {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);  // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI.....
    
    if(!authHeader){
        res.status(401).send('Unauthorized');
    }

    const tokens = authHeader.split(' ');
    const authToken = tokens[1];

    // Token verify
    jwt.verify(authToken,config.jwtSecret,(err,decoded) => {
        if(err){
            console.log(err);
            res.status(401).send('Unauthorized');
        }else{
            console.log(decoded); // { email: 'admin@cgc.com', iat: 1711017469, exp: 1711103869 }
            next();
        }
    });
}

module.exports = tokenAuth;