const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/ATLAS-FITNESS")
.then(() => {
    console.log('Database connected successfully');
})
.catch((err) => {
    console.error('Error connecting to database:', err);
});