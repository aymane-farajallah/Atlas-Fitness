require('./backend/config/database');



const express = require('express');
var expressBusboy = require('express-busboy');
const App = express();
expressBusboy.extend(App);
const authroutesuser = require("./backend/routes/authroutesuser");
const authroutescoach = require("./backend/routes/authroutescoach");
const coachroutes = require('./backend/routes/coachroutes');
const reviewRoute = require('./backend/routes/reviewroutes');
const workoutRoute = require('./backend/routes/working-tracking-route');
const messageRoute = require('./backend/routes/messageRoute');
const { app, server } = require("./backend/utils/socket");
const swaggerUi = require('swagger-ui-express');
const specs = require('./backend/middlewares/swagger');
const morgan = require('morgan');
const cors = require('cors');


App.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true,
    }
));



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
App.use(morgan('dev'));




App.listen(process.env.PORT , (req ,res)=>{
    console.log("SERVER IS WORKING");
})

