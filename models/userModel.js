const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    email: { type: String, unique: true },
    active: { type: Boolean, default: true },
    createdDate: { type: Date },
    updatedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('user', schema);