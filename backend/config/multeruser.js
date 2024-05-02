const multer = require("multer");
const fs = require('fs');
const path = require('path');

const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {     
  
        const uploadPath = path.join('uploads', 'user');
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        
        cb(null, Date.now() + "-" + file.originalname); 
    },
});

const uploaduser = multer({ storage: userStorage });

module.exports = { uploaduser };