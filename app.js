require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const app = express();
const Sentry = require('./libs/sentry');
const routes = require('./api/auth/routes');

const notifController = require('./api/notification/controllers');

const path = require('path');
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');


app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(logger('dev'));
app.use(express.json());

app.get('/', (req, res) => {
        res.json({
            status: true,
            message: 'Hello world!',
            data: null
        });
});

app.use(routes);

app.get('/forgot-password', (req, res) => {
    res.render('forgotPassword.ejs'); 
});

app.get('/reset-password', (req, res) => {
    const token = req.query.token;
    res.render('resetPassword.ejs', { token });
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/notifications', async (req, res) => {
    const notif =await notifController.getNotif();
    res.render('notif',  {notif} );
});
// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// 500 error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: false,
        message: err.message,
        data: null
    });
});

// 404 error handler
app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: `are you lost? ${req.method} ${req.url} is not registered!`,
        data: null
    });
});

module.exports = app;