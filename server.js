require('./backend/config/database');
const express = require('express');
const app = express();
const port = 3111 ;
const authroutesuser = require("./backend/routes/authroutesuser");
const authroutescoach = require("./backend/routes/authroutescoach");
const coachroutes = require('./backend/routes/coachroutes');
const bookingRoutes = require('./backend/routes/bookingroutes');
app.use(express.json());


app.use('/coaches', coachroutes);
app.use("/api", authroutesuser);
app.use("/api", authroutescoach);
app.use("/api", bookingRoutes);

app.listen(port , (req , res)=>{
    console.log("SERVER IS WORKING");
})