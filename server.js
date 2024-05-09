require('dotenv').config();
require('./backend/config/database');
const express = require('express');
const bodyParser = require("body-parser")
const App = express();

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer');
const port = 3111 ;
const authroutesuser = require("./backend/routes/authroutesuser");
const authroutescoach = require("./backend/routes/authroutescoach");
const coachroutes = require('./backend/routes/coachroutes');
const userroutes = require('./backend/routes/userroutes');
const bookingRoutes = require('./backend/routes/bookingroutes');
const reviewRoute = require('./backend/routes/reviewroutes');
const workoutRoute = require('./backend/routes/working-tracking-routes');
const reportRoute = require('./backend/routes/reportroutes');
const messageRoute = require('./backend/routes/messageRoute');
const { app, server } = require("./backend/utils/socket");
const swaggerUi = require('swagger-ui-express');
const specs = require('./backend/middlewares/swagger');


App.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
App.use('/users', userroutes);
App.use('/coaches', coachroutes);
App.use("/api", authroutesuser);
App.use("/api", authroutescoach);
App.use("/api", bookingRoutes);
App.use("/api", reviewRoute);
App.use("/api", reportRoute);
App.use("/workout", workoutRoute);
App.use("/messages", messageRoute);


App.listen(port , (req , res)=>{
    console.log("SERVER IS WORKING");
})

