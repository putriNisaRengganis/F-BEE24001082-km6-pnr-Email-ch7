const routes = require('express').Router();
const { register, forgotPassword, resetPassword, login } = require('./controllers');

routes.post('/register', register);
routes.post('/forgotPassword', forgotPassword);
routes.post('/resetPassword', resetPassword);
routes.post('/api-login', login);

module.exports = routes;