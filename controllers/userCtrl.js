const UserRepo = require('../repositories/userRepo');

// When user enter the duplicate email
const emailExists = (err) => err.message 
    && err.message.indexOf('duplicate key error') > -1;

const add = async(req,res) => {
    try{
        const playload = req.body;
        playload.createdDate = new Date();

        // If the user is added
        console.log(`User added:`,playload); 
        await UserRepo.add(playload);

        res.status(201).send('Created');
    }catch(err) {
        console.error(err.message);
        if(emailExists(err)) {
            res.status(400).send('Email Already Exists');
        }else{
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = {
    add,
}