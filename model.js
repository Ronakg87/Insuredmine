const mongoose = require('mongoose');

const agentSchema =  new mongoose.Schema({ name: String });
const userSchema = new mongoose.Schema({ 
    firstName: String,
    dob: Date,
    address: String,
    phoneNumber: String,
    state: String,
    zipCode: String,
    email: String,
    gender: String,
    userType: String,
});
const userAccountSchema = new mongoose.Schema({ accountName: String });
const policyCategorySchema = new mongoose.Schema({ categoryName: String });
const policyCarrierSchema = new mongoose.Schema({ companyName: String});
const policyInfoSchema = new mongoose.Schema({ 
    policyNumber: String,
    policyStartDate: Date,
    policyEndDate: Date,
    policyCategoryId: mongoose.Schema.Types.ObjectId,
    companyCollectionId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
});

const Agent = mongoose.model('Agent', agentSchema);
const User = mongoose.model('User', userSchema);
const UserAccount = mongoose.model('UserAccount', userAccountSchema);
const PolicyCategory = mongoose.model('PolicyCategory', policyCategorySchema);
const PolicyCarrier = mongoose.model('PolicyCarrier', policyCarrierSchema);
const PolicyInfo = mongoose.model('PolicyInfo', policyInfoSchema);

module.exports = {
    Agent,
    User,
    UserAccount,
    PolicyCategory,
    PolicyCarrier,
    PolicyInfo
}