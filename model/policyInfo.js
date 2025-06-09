const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    policyNumber: { type: String, required: true },
    policyStartDate: { type: Date, required: true },
    policyEndDate: { type: Date, required: true },
    policyCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyCategory', required: true },
    companyCollectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const PolicyInfo = mongoose.model('PolicyInfo', policySchema);
module.exports = PolicyInfo;
