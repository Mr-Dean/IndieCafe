const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CafeSchema = new Schema({
    name: String,
    description: String,
    address: String
})

module.exports = mongoose.model('Cafe', CafeSchema);