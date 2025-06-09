const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

app.use(cors());

const Routes = require('./routes');
app.use('/api', Routes);

app.use((req, res, next) => {
    const error = new Error('Route not found. All routes should start with /api');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'An unexpected error occurred.',
        },
    });
});

module.exports = app;

