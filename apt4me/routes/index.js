var express = require('express');
var router = express.Router();
var functions = require("../functions")

router.get('', function (req, res) {
    console.log('GET index');

    res.render('index.ejs', { 'status': 200 });
});

router.put('', function (req, res) {
    var dbo = req.db;
    console.log(req.body.email)
    var email = req.body.email;
    console.log(email)
    var query = { "email": email };

    var newValues = {
        $set: { "email": email } 
    }

    dbo.collection('sessions').updateOne(query, newValues, upsert=true, function (err, doc) {
        if (err) throw err;

        dbo.collection('sessions').findOne(query, function (err, doc) {
            if (err) throw err;
            console.log(doc._id);

            var id = doc["_id"];
            id = functions.encodeID(id);

            res.status(200).json({ 'status': 200, 'id': id });

        });


    });
});

module.exports = router;