const mongoose = require('mongoose');

const license_model = new mongoose.Schema({
    key: String,
    firstname: String,
    lastname: String,
    number_use: String,
    max_use: String,
    active: Boolean
});

module.exports = mongoose.model('license_model', license_model);