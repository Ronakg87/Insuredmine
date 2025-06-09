const mongoose = require('mongoose');

const carrierSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
});

const PolicyCarrier = mongoose.model('PolicyCarrier', carrierSchema);
module.exports = PolicyCarrier;
