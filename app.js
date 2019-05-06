const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png');
    }
});

var upload = multer({ storage: storage })

mongoose.connect('mongodb://localhost/floraldesk', { useNewUrlParser: true }).then().catch(err => {
    console.log('no connection to db: ' + err);
})

require('./models/Flower');
require('./models/Type');

var app = express();

app.use(upload.single('file'));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/img', express.static(__dirname + '/img'));


app.use('/types', require('./routes/types'));
app.use('/', require('./routes/flowers'));

app.use('/uploads', express.static(__dirname + '/uploads'));

nunjucks.configure('views', {
    autoescape: true,
    express: app
})

console.error("FloralDesk Developed with M.E.A.N Technology", "red");
console.log(" Developed By : Kapol brondon, M. Saphir, E. Merveille, Ekambi A.");
console.log("[ FloralDesk ] is running on ==> localhost:3000");
app.listen(3000);