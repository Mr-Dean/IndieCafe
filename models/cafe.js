const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CafeSchema = new Schema({
    name: String,
    description: String,
    address: String,
    image: String
})

module.exports = mongoose.model('Cafe', CafeSchema);