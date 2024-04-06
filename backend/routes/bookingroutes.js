const express = require('express');
const bookingController = require('../controllers/bookingcontrollers');
const {isAuthenticated} = require('../middlewares/protectRoute');
const checkCoach = require('../middlewares/checkCoach');
const checkUser = require('../middlewares/checkUser');
const bookingrouter = express.Router();

bookingrouter.post('/postbooking/:coach_id' , isAuthenticated, checkUser, bookingController.getCheckoutSession);
bookingrouter.get('/bookings', isAuthenticated , bookingController.getAllBookings);
bookingrouter.get('/bookings/:id',isAuthenticated, checkUser , bookingController.getBookingById);
bookingrouter.put('/bookings/:id', isAuthenticated, checkUser , bookingController.updateBooking);
bookingrouter.delete('/bookings/:id', isAuthenticated, checkUser , bookingController.deleteBooking);

module.exports = bookingrouter ;