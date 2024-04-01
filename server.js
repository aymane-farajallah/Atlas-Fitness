require('./backend/config/database');
const express = require('express');
const app = express();
const port = 3111 ;
const authroutesuser = require("./backend/routes/authroutesuser");
const authroutescoach = require("./backend/routes/authroutescoach");
const coachroutes = require('./backend/routes/coachroutes');
const reviewRoute = require('./backend/routes/reviewroutes');
const workoutRoute = require('./backend/routes/working-tracking-route');
const messageRoute = require('./backend/routes/messageRoute');
import { app, server } from "./utils/socket.js";



app.use(express.json());
require('dotenv').config();


app.use('/coaches', coachroutes);
app.use("/api", authroutesuser);
app.use("/api", authroutescoach);
app.use("/reviews", reviewRoute);
app.use("/workout", workoutRoute);
app.use("/message", messageRoute);


app.listen(port , (req , res)=>{
    console.log("SERVER IS WORKING");
})