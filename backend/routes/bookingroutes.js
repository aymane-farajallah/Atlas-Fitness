const express = require('express');
const bookingController = require('../controllers/bookingcontrollers');
const {isAuthenticated} = require('../middlewares/protectRoute');
const checkCoach = require('../middlewares/checkCoach');
const checkUser = require('../middlewares/checkUser');
const checkAdmin = require('../middlewares/checkAdmin');
const bookingrouter = express.Router();

bookingrouter.post('/postbooking/:coach_id' , isAuthenticated, checkUser, checkAdmin ,  bookingController.getCheckoutSession);
bookingrouter.get('/bookings', isAuthenticated , checkAdmin , bookingController.getAllBookings);
bookingrouter.get('/bookings/:id',isAuthenticated, checkAdmin , checkUser , bookingController.getBookingById);
bookingrouter.put('/bookings/:id', isAuthenticated, checkAdmin , checkUser , bookingController.updateBooking);
bookingrouter.delete('/bookings/:id', isAuthenticated, checkAdmin , checkUser , bookingController.deleteBooking);

module.exports = bookingrouter ;