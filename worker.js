const { workerData, parentPort } = require("worker_threads");
const xlsx = require('xlsx');
const fs = require('fs');
const mongoose = require('mongoose');
// require('dotenv').config();
const connetctTOMongo = require('./config/db');
const Agent = require('./model/agent');
const User = require('./model/user');
const UserAccount = require('./model/userAccount');
const PolicyCategory = require('./model/policyCategory');
const PolicyCarrier = require('./model/policyCarrier');
const PolicyInfo = require('./model/policyInfo');
// const { Agent, User, UserAccount, PolicyCategory, PolicyCarrier, PolicyInfo } = require('./model');

// mongoose.connect(process.env.MONGOURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
connetctTOMongo();

(async () => {
    try{
        const workbook = xlsx.readFile(workerData.filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        const userMap = new Map(); // key: firstname, value: user ID
        const categoryMap = new Map(); // key: categoryName, value: category ID
        const companyMap = new Map(); // key: companyName, value: company ID

        for(const row of data) {
            if(row['agent']){
                const agent = await Agent.create({ name: row['agent']});
            }
            
            if (row['firstname'] && row['dob']) {
                let user;
                if (!userMap.has(row['firstname'])) {
                    user = await User.create({
                        firstName: row['firstname'],
                        dob: new Date(row['dob']),
                        address: row['address'],
                        phoneNumber: row['phone'],
                        state: row['state'],
                        zipCode: row['zip'],
                        email: row['email'],
                        gender: row['gender'],
                        userType: row['userType'],
                    });
                    userMap.set(row['firstname'], user._id);
                }
            }
            if (row['account_name']) {
                const userId = userMap.get(row['firstname']);
                await UserAccount.create({ 
                    accountName: row['account_name'],
                    userId: userId,
                 });
            }
            if (row['category_name']) {
                let category;
                if (!categoryMap.has(row['category_name'])) {
                    category = await PolicyCategory.create({ categoryName: row['category_name'] });
                    categoryMap.set(row['category_name'], category._id);
                }
            }
            if (row['company_name']) {
                let company;
                if (!companyMap.has(row['company_name'])) {
                    company = await PolicyCarrier.create({ companyName: row['company_name'] });
                    companyMap.set(row['company_name'], company._id)
                }
            }
            if (row['policy_number'] && row['policy_start_date'] && row['policy_end_date']) {
                const userId = userMap.get(row['firstname']);
                const categoryId = categoryMap.get(row['category_name']);
                const companyId = companyMap.get(row['company_name']);

                if (!userId || !categoryId || !companyId) {
                    if (!userId) console.error(`User not found for: ${row['firstname']}`);
                    if (!categoryId) console.error(`Category not found for: ${row['category_name']}`);
                    if (!companyId) console.error(`Company not found for: ${row['company_name']}`);
                    continue; // Skip this row if references are missing
                }

                await PolicyInfo.create({
                    policyNumber: row['policy_number'],
                    policyStartDate: new Date(row['policy_start_date']),
                    policyEndDate: new Date(row['policy_end_date']),
                    policyCategoryId: categoryId,
                    companyCollectionId: companyId,
                    userId: userId,
                });
            }
        }

        parentPort.postMessage('Data inserted successfully!');
    } catch (error) {
        parentPort.postMessage(`Error Occured: ${error.message}`);
    } finally {
        fs.unlinkSync(workerData.filePath);
        mongoose.connection.close();
    }
})();