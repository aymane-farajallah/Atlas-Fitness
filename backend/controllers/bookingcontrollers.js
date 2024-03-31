const User = require('../models/user');
const Coach = require('../models/coach');
const Booking = require('../models/booking');
const Stripe_Key = "sk_test_51NDw4VFcu0DV17ntoET434fmRVMakCc3fBnksrg8h0mzVwkOz3FpUpke3iYJe6DbBO4adbXXdr4luWdVJo5XinAi00so0l8EP3";
const Stripe = require("stripe");

const getCheckoutSession = async (req,res) => {
    try{

        const coach = await Coach.findById(req.params.coach_id)      
        const user = await User.findById(req.body.user_id)     
        const stripe = new Stripe(Stripe_Key);

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
                    quantity : 11
                }
            ]
        }) 

        const booking = new Booking({
            coach_id: coach._id,
            user_id: user._id,
            price: coach.price,
            session: session.id,
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

module.exports = {
    getCheckoutSession
}