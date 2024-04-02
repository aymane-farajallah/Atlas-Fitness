require('./backend/config/database');
const express = require('express');
const App = express();
const port = 3111 ;
const authroutesuser = require("./backend/routes/authroutesuser");
const authroutescoach = require("./backend/routes/authroutescoach");
const coachroutes = require('./backend/routes/coachroutes');
const bookingRoutes = require('./backend/routes/bookingroutes');
const reviewRoute = require('./backend/routes/reviewroutes');
const workoutRoute = require('./backend/routes/working-tracking-routes');
const messageRoute = require('./backend/routes/messageRoute');
const { app, server } = require("./backend/utils/socket");


App.use(express.json());
require('dotenv').config();



App.use('/coaches', coachroutes);
App.use("/api", authroutesuser);
App.use("/api", authroutescoach);
App.use("/api", bookingRoutes);
App.use("/reviews", reviewRoute);
App.use("/workout", workoutRoute);
App.use("/messages", messageRoute);

App.listen(port , (req , res)=>{
    console.log("SERVER IS WORKING");
})