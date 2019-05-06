var mongoose = require('mongoose');

var flowerSchema = new mongoose.Schema({
    name: String,
    number: Number,
    sn: String,
    description: String,
    picture: String,
    color: String,
    types: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    }]
});

var Flower = mongoose.model('Flower', flowerSchema);

module.exports = Flower;