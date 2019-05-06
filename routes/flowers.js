const router = require('express').Router();
const icons = require('glyphicons');

var Flower = require('./../models/Flower');

var Type = require('./../models/Type');

var User = require('../models/users');

router.get('/', (req, res) => {

    if (User.name == "admin" && User.pass == "admin") {
        Flower.find({}).populate('types').then(flowers => {
            res.render('flowers/index.html', { flowers: flowers, icons: icons });
            console.log('moving to flower page');
        });
    } else {
        res.render('flowers/login.html', { user: User });
        console.log('moving to login page');

    }

});

router.get('/logout', (req, res) => {
    User.name = "";
    User.pass = "";
    res.render('flowers/login.html', { user: User });
    console.log('logout');

});

router.get('/new', (req, res) => {
    Type.find({}).then(types => {
        var flower = new Flower();
        var max = 0;

        Flower.find({}).then(f => {
            for (i of f)
                if (i.number > max) {
                    console.log(i.number + " > " + max);
                    max = i.number;
                }
            return max;
        }).then(n => {
            flower.number = n + 1;
            console.log("max: " + flower.number);
            res.render('flowers/edit.html', { flower: flower, types: types, endpoint: '/' });
        });
    });
});

router.get('/edit/:id', (req, res) => {
    Type.find({}).then(types => {
        Flower.findById(req.params.id).then(flower => {
            res.render('flowers/edit.html', { flower: flower, types: types, endpoint: '/' + flower._id.toString() });
        });
    });
});


router.get('/delete/:id', (req, res) => {
    Flower.findOneAndRemove({ _id: req.params.id }).then(() => {
        res.redirect('/');
    }, err => res.status(500).send(err));
});


router.get('/:id', (req, res) => {
    Flower.findById(req.params.id).populate('types').then(flower => {
            res.render('flowers/display.html', { flower: flower });
        },
        err => res.status(500).send(err));
});

router.post('/', (req, res) => {

    if (User.name) {
        Flower.find({}).populate('types').then(flowers => {
            User.name = "admin";
            User.pass = "admin";
            res.render('flowers/index.html', { flowers: flowers });
            console.log('moving to flower page');
        });
    } else {
        res.render('flowers/login.html', { user: User });
        console.log('moving to login page');

    }

});

router.post('/:id?', (req, res) => {
    //req.file.filename = req.file.originalname;
    new Promise((resolve, reject) => {
        if (req.params.id) {
            Flower.findById(req.params.id).then(resolve, reject);
        } else {
            resolve(new Flower())
        }
    }).then(flower => {
        flower.name = req.body.name;
        flower.color = req.body.color;
        flower.sn = req.body.sn.toLowerCase();
        flower.description = req.body.description;
        flower.number = req.body.number;
        flower.types = req.body.types;

        if (req.file) flower.picture = req.file.filename

        return flower.save();

    }).then(() => {

        res.redirect('/');
    }, err => console.log(err));
});

module.exports = router;