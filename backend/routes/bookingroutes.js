const express = require('express');
const bookingController = require('../controllers/bookingcontrollers');
const bookingrouter = express.Router();

bookingrouter.post('/checkout-session/:coach_id' , bookingController.getCheckoutSession);
bookingrouter.get('/bookings', bookingController.getAllBookings);
bookingrouter.get('/bookings/:id', bookingController.getBookingById);
bookingrouter.put('/bookings/:id', bookingController.updateBooking);
bookingrouter.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = bookingrouter ;