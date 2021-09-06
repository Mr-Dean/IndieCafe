const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CafeSchema = new Schema({
    name: String,
    description: String,
    address: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CafeSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Cafe', CafeSchema);