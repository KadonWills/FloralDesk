const router = require('express').Router();

var Type = require('./../models/Type');


router.get('/t/edit/:id', (req,res) => {
  Type.findById(req.params.id).then(type => {
      res.render('types/edit.html', {t :type, endpoint:'/types' + type._id.toString()});
  });
});

router.get('/t/new', (req, res) => {
    Type.find({}).then(t => {
      var type = new Type();
      res.render('types/edit.html', { t :type, types:t, endpoint:'/types'});
    })
});

router.get('/:type', (req, res) => {
  Type.findOne({ name : req.params.type}).populate('flowers').then( type => {
    if(!type) return res.status(404).send("Type Not Found")
    res.render('types/display.html', {
      type: type,
      flowers: type.flowers
    });
  }, err => console.log(err));
});


router.post('/:id?', (req, res) => {
  new Promise((resolve, reject) => {
    if (req.params.id) {
      Type.findById(req.params.id).then(resolve,reject);
    } else {
      resolve(new Type())
    }
  }).then(type => {
    type.name = req.body.name;
    type.color = req.body.color;

    return type.save();

  }).then(()  => {
    res.redirect('/');
  }, err => console.log(err));
});

module.exports = router;
