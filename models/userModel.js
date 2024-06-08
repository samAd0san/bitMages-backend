const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    firstName: { type: String, required : [true,'First Name field is mandatory']},
    lastName: { type: String },
    password: { type: String, required : [true,'Password field is mandatory']},
    email: { type: String, unique: true, required : [true,'Email field is mandatory'] },
    active: { type: Boolean, default: true },
    createdDate: { type: Date },
    updatedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('user', schema);