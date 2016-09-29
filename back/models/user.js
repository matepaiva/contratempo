// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    name:        { type: String, required: true },
    email:       { type: String, required: true, select: false, unique: true },
    password:    { type: String, required: true, select: false },
    tokenDate:   { type: Array },
    userSlug:    { type: String, required: true, unique: true },
    img:         { type: String },
    description: { type: String },
    isPremium:   { type: Boolean },
    isAdmin:     { type: Boolean }
}));
