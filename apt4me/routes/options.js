var express = require('express');
var router = express.Router();
var functions = require("../functions")

router.get('/:id', function (req, res) {
    var dbo = req.db;
    var id = functions.decodeID(req.params.id);

    var query = {
        '_id': id
    };

    functions.loadDefaultTags(dbo, function (defaultTags) {
        console.log(defaultTags);

        try {
            console.log('loading user options...')
            dbo.collection("sessions").findOne(query, function (err, doc) {
                if (err) throw err;

                console.log('success');

                var allTags;
                var targetRent;
                var priorityTags = [];

                if (doc.options) {
                    if (doc.options.targetRent)
                        targetRent = doc.options.targetRent;

                    if (doc.options.priorityTags)
                        priorityTags = priorityTags.concat(doc.options.priorityTags);
                }
                if (doc.customTags)
                    allTags = defaultTags.concat(doc.customTags);
                else
                    allTags = defaultTags;

                data = { 'allTags': allTags, 'priorityTags':priorityTags, 'targetRent': targetRent };
                res.render('options.ejs', { 'status': 200, 'data': data });
            });
        }
        catch(err) {
            console.log('Failed to load user options');
            console.log(err)
            res.status(500).json({ 'success': false });
        }

    });

});

router.put('/:id', function (req, res) {
    var dbo = req.db;
    id = functions.decodeID(req.params.id);

    var query = {
        '_id': id
    };

    var targetRent = req.body.targetRent;
    var priorityTags = req.body.priorityTags;

    var options = { 'targetRent': targetRent, 'priorityTags': priorityTags }

    var newValues = {
        $set: { "options": options }
    }

    try {
        dbo.collection("sessions").updateOne(query, newValues, function (err, doc) {
            if (err) throw err;
            console.log("Document updated successfully");
            res.status(200).json({ 'success': true });
        });
    }
    catch {
        console.log("Failed to Update");
    }
});

module.exports = router;