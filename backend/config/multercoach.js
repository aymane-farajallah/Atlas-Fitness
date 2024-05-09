const multer = require("multer");
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {       
        let folder;
        switch (file.fieldname) {
            case 'image':
                folder = 'image';
                break;
            case 'cin':
                folder = 'cin';
                break;
            case 'cv':
                folder = 'cv';
                break;
            default:
                folder = '';
        }     
        const uploadPath = path.join('uploads', folder);
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); 
    },
});

module.exports = multer({ storage: storage });