// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Counter', new Schema({
    userSlug:    { type: String, required: true },
    title:       { type: String, required: true, index: { unique: true} },
    description: { type: String, required: true },
    startTime:   { type: Date },
    counterSlug: { type: String, required: true },
    img:         { type: String },
    stars:       { type: Array },
    views:       { type: Number },
    isPromoted:  { type: Boolean }
}));
