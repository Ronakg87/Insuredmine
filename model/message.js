
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    scheduleTime: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
