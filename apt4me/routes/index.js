var express = require('express');
var router = express.Router();

router.get('', function (req, res) {
    var dbo = req.db;
    console.log('GET index');

    res.render('index.ejs', { 'status': 200 });
});

module.exports = router;