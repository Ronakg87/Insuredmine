
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const controller = require("./controller");
const router = express.Router();

router.post('/upload', upload.single('file'), controller.uploadFile);

router.get('/search', controller.searchPolicy);

router.get('/policies/aggregate', controller.userPolicyData);

router.post('/schedule', controller.scheduleTime);

module.exports = router;

