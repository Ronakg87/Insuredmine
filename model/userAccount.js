const mongoose = require('mongoose');

const userAccountSchema = new mongoose.Schema({
    accountName: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const UserAccount = mongoose.model('UserAccount', userAccountSchema);
module.exports = UserAccount;
