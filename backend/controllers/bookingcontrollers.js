const User = require('../models/user');
const Coach = require('../models/coach');
const Booking = require('../models/booking');
const jwt = require('jsonwebtoken');
const Stripe_Key = "sk_test_51NDw4VFcu0DV17ntoET434fmRVMakCc3fBnksrg8h0mzVwkOz3FpUpke3iYJe6DbBO4adbXXdr4luWdVJo5XinAi00so0l8EP3";
const Stripe = require("stripe");

const getCheckoutSession = async (req,res) => {
    try{

        const coach = await Coach.findById(req.params.coach_id)      
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token is missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'secret');

        const user = decoded.id;  
        const stripe = new Stripe(Stripe_Key);

        const sessionType = req.body.session_type;
        let location = '';
        if (sessionType === 'in-person') {
            location = user.location ;
        } else if(sessionType === 'online'){
            location = 'Google Meet';
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            success_url: 'http://localhost:3111/checkout-success' ,
            cancel_url: 'http://localhost:3111/checkout-failed' ,
            customer_email : user.email,
            client_reference_id : req.params.coach_id,
            line_items:[
                {
                    price_data :{
                        currency: "USD",
                        unit_amount: coach.price * 100,
                        product_data : {
                            name : coach.fullname,
                            description : coach.bio,

                        }
                    },
                    quantity : 1
                }
            ]
        }) 

        const booking = new Booking({
            coach_id: coach._id,
            user_id: user,
            price: coach.price,
            session: session.id,
            sessionType,
            location
        })

        await booking.save()
        res.status(200).json({success: true , message: 'Successfully Paid' , session});

    } catch (err){
        console.log(err);
        
        res
        .status(500)
        .json({success: false , message: 'Error Creating Checkout session'});
    }

}

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();

        res.status(200).json({bookings});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to retrieve bookings' });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        res.status(200).json({booking});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to update booking' });
    }
};

const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        await CalendarService.updateBookingInCalendar(booking);

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to update booking' });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if(!booking){
        res.status(404).json({message:'Booking Not Found'});
        }

        res.status(200).json({ success: true, data: {message: 'Booking Deleted'} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to delete booking' });
    }
};

module.exports = {
    getCheckoutSession,
    deleteBooking,
    updateBooking,
    getAllBookings,
    getBookingById
}