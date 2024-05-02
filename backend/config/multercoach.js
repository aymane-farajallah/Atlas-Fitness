const multer = require("multer");
const fs = require('fs');
const path = require('path');

const coachStorage = multer.diskStorage({
    destination: function (req, file, cb) {     
        console.log("hello");
  
        const uploadPath = path.join('uploads', 'coach');
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        
        cb(null, Date.now() + "-" + file.originalname); 
    },
});

const uploadCoach = multer({ storage: coachStorage });

module.exports = { uploadCoach };