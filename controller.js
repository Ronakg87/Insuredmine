
const path = require('path');
const { Worker } = require('worker_threads');
// const { User, PolicyInfo } = require('./model');
const User = require('./model/user');
const PolicyInfo = require('./model/policyInfo');
const schedule = require('node-schedule');
const Message = require('./model/message');
const moment = require('moment-timezone');


const uploadFile = async (req, res) => {
    const filePath = path.resolve(req.file.path);

    // Worker thread for file processing
    const worker = new Worker('./worker.js', { workerData: { filePath } });

    worker.on('message', (message) => {
        res.status(200).json({ message: 'File processed successfully', details: message });
    });

    worker.on('error', (err) => {
        res.status(500).json({ error: 'File processing failed', details: err.message });
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker exited with code ${code}`);
        }
    });
}

const searchPolicy = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Find the user by username
        const user = await User.findOne({ firstName: username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find policies associated with the user ID
        const policies = await PolicyInfo.find({ userId: user._id });

        if (policies.length === 0) {
            return res.status(404).json({ error: 'No policies found for this user' });
        }

        res.status(200).json({ policies });
    } catch (error) {
        console.error('Error fetching policy info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const userPolicyData = async(req, res) => {
    try {
        
        const aggregatedData = await PolicyInfo.aggregate([
            // Join with User collection
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                }
            },
            // Unwind user array to merge fields
            {
                $unwind: '$user',
            },
            // Group policies by userId
            {
                $group: {
                    _id: '$userId',
                    user: { $first: '$user' },
                    policies: {
                        $push: {
                            policyNumber: '$policyNumber',
                            startDate: '$policyStartDate',
                            endDate: '$policyEndDate',
                            category: '$policyCategoryId',
                            company: '$companyCollectionId',
                        },
                    },
                },
            },
            // Format the response
            {
                $project: {
                    _id: 0, // Exclude MongoDB's default _id
                    user: {
                        firstName: '$user.firstName',
                        email: '$user.email',
                        phone: '$user.phoneNumber',
                    },
                    policies: 1,
                },
            },
        ]);

        res.status(200).json(aggregatedData);
    } catch (error) {
        console.error('Error in aggregation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const scheduleTime = async (req, res) => {
    try {
        const { message, day, time } = req.body;

        // Validate inputs
        if (!message || !day || !time) {
            return res.status(400).json({ error: "Message, day, and time are required." });
        }

        // Parse day and time into a JavaScript Date object
        const userTimezone = "Asia/Kolkata"; // Your timezone
        const dateTimeString = `${day} ${time}`;
        const scheduleMoment = moment.tz(dateTimeString, "YYYY-MM-DD HH:mm:ss", userTimezone);
        //const scheduleTime = dateTimeString.toDate(); // Convert Moment object to Date object
        const jsDate = new Date(`${dateTimeString}Z`);
        // Check if the date is valid
        if (isNaN(jsDate.getTime())) {
            return res.status(400).json({ error: "Invalid day or time format." });
        }

        // Save to DB in local time
        const newMessage = new Message({
            message,
            scheduleTime: jsDate,
        });
        await newMessage.save();

        // Schedule the message insertion
        schedule.scheduleJob(scheduleTime, async () => {
            console.log(`Scheduled Task Executed: ${message}`);
        });

        res.status(200).json({
            message: "Message scheduled successfully.",
            scheduleTime: scheduleMoment.format("YYYY-MM-DD HH:mm:ss"), // Return human-readable local time
            data: newMessage,
        });
    } catch (error) {
        res.status(500).json({ error: "An error occurred.", details: error.message });
    }
};
module.exports = {
    uploadFile,
    searchPolicy,
    userPolicyData,
    scheduleTime
}