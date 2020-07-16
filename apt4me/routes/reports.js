const mongo = require('mongodb');
var express = require('express');
var router = express.Router();
var functions = require("../functions")


//define point values somewhere else - avoid magic numbers!!!
var multiplier = 100;
var priorityTagValue = 5;
var bonusTagValue = 3;
var otherTagValue = 1;

router.get('/:id', function (req, res) {
    console.log('GET apartments');
    console.log(req.params.id);
    var dbo = req.db;

    //NWYwMzg0NzY3YmZjNmQzZTNjM2E5ODZi
    id = functions.decodeID(req.params.id);

    var query = {
        '_id': id
    };
    /// IF NO OPTIONS ARE FOUND LOAD THE OPTIONS PAGE WITH SOME KIND OF ALERT SAYING TO SET THE OPTIONS FIRST
    // or load a version of the report page that makes them set the options first either by redirecting them or by doing it on the same page
    dbo.collection('sessions').findOne(query, function (err, doc) {
        if (err) throw err;
        console.log('Successful retrieval');
        console.log(doc);

        var alerts = [null]
        var scores = [];
        var options = doc.options;
        var apartments = doc.apartments;

        if (apartments.length !== 0 && options.length !== 0) {
            apartments.forEach(apartment => {
                score = calculatePoints(apartment, options);
                console.log("score: " + score);
                scores.push(score);
            });
        }
        else {
            if (apartments.length === 0)
                alerts.push('No apartments to calculate scores. There must be at least 1 apartment saved to generate a score report');
            if (options.length === 0)
                alerts.push('Preferences not set. Please Navigate to the Options page to set your apartment preferences.')
        }

        var data = { 'apartments': apartments, 'scores': scores, 'alerts': alerts };
        //res.status(200).json({'status': 200, 'scores': scores})
        res.render('report.ejs', { 'status': 200, 'data': data });
    });
  
});

function calculatePoints(apartment, options) {
    var points = 0;
    var targetRent = options.targetRent;
    var priorityTags = options.priorityTags;
    //var bonusTags = config.bonusTags;
    var rent = apartment.rent;
    var tags = [];

    //calculate points based on rent
    points = (targetRent / rent) * multiplier;
        //use modifier based on rent per sqft?
    console.log(points);

    if (apartment.hasOwnProperty('tags')) {
        tags = apartment.tags;
        if (Array.isArray(tags) || tags.length) {
            tags.forEach(tag => {
                if (priorityTags.includes(tag))
                    points += priorityTagValue;
                //else if (bonusTags.includes(tag))
                //    points += bonusTagValue;
                else
                    points += otherTagValue;
                console.log(points);
            });
        }
    }

    return Math.round(points);
}

module.exports = router;