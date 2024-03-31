const express = require('express');
const {getCheckoutSession} = require('../controllers/bookingcontrollers');
const bookingrouter = express.Router();

bookingrouter.post('/checkout-session/:coach_id' , getCheckoutSession);

module.exports = bookingrouter ;