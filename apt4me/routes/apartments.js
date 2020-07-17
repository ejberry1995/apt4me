const mongo = require('mongodb');
var express = require('express');
var router = express.Router();
var functions = require("../functions")

router.get('/:id', function (req, res) {
    console.log('GET apartments');
    console.log(req.params.id);
    var dbo = req.db;
    
    //NWYwMzg0NzY3YmZjNmQzZTNjM2E5ODZi
    id = functions.decodeID(req.params.id);

    var query = {
        '_id': id
    };

    dbo.collection('sessions').findOne(query, function (err, doc) {
        if (err) throw err;
        console.log('Successful retrieval');
        console.log(doc);

        var apartments = [];
        if (doc.apartments)
            apartments = apartments.concat(doc.apartments);

        res.render('apartments.ejs', { 'status': 200, 'apartments': apartments });
    });
});

router.get('/:id/all', function (req, res) {
    console.log('GET apartments');
    console.log(req.params.id);
    var dbo = req.db;

    //NWYwMzg0NzY3YmZjNmQzZTNjM2E5ODZi
    id = functions.decodeID(req.params.id);

    var query = {
        '_id': id
    };

    dbo.collection('sessions').findOne(query, function (err, doc) {
        if (err) throw err;
        console.log('Successful retrieval');
        console.log(doc);

        var apartments = [];
        if (doc.apartments)
            apartments = apartments.concat(doc.apartments);

        res.status(200).json({ 'status': 200, 'apartments': apartments });
    });
});

router.post('/:id/new', function (req, res) {
    var dbo = req.db;
    id = functions.decodeID(req.params.id);

    var query = {
        '_id': id
    };

    dbo.collection('sessions').findOne(query, function (err, doc) {
        if (err) throw err;
        console.log('Successful retrieval');
        console.log(doc);

        var apartments = [];
        if (doc.apartments)
            apartments = apartments.concat(doc.apartments);

        apartments.push(req.body.apartment);

        var newValues = {
            $set: { "apartments": apartments }
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
    //res.status(400).json({ 'success': false }); //look up specific status code
})

router.put('/:id/edit', function (req, res) {
    console.log('PUT edited apartment')
    var dbo = req.db;
    console.log('attempting put request');
    index = req.body.index;
    console.log('index: ' + index)

    id = functions.decodeID(req.params.id);

    var query = {
        '_id': id
    };

    try {
        dbo.collection('sessions').findOne(query, function (err, doc) {
            if (err) throw err;
            console.log('Successful retrieval');

            updatedApt = req.body.apartment;

            apt = `apartments.${index}`;
            var newValues = {
                $set: { [apt]: updatedApt }
            }

            try {
                dbo.collection("sessions").updateOne(query, newValues, function (err, doc) {
                    if (err) throw err;
                    console.log("document updated successfully");
                    res.status(200).json({ 'success': true });
                })
            }
            catch {
                console.log('failed to update apartment');
            }
        });
    }
    catch {
        console.log('failed to retrieve apartment to update');
    }

});

router.delete('/:id/delete', function (req, res) {
    console.log('DELETE apartment')
    var dbo = req.db;
    console.log('attempting delete request');
    index = req.body.index;
    console.log('index: ' + index)

    id = functions.decodeID(req.params.id);

    var query = {
        '_id': id
    };

    try {
        dbo.collection('sessions').findOne(query, function (err, doc) {
            if (err) throw err;
            console.log('Successful retrieval');

            apartments = doc.apartments;

            console.log(apartments);

            apartments.splice(index, 1);

            console.log(apartments);

            var newValues = {
                $set: { "apartments": apartments }
            }

            try {
                dbo.collection("sessions").updateOne(query, newValues, function (err, doc) {
                    if (err) throw err;
                    console.log("document updated successfully");
                    res.status(200).json({ 'success': true });
                })
            }
            catch {
                console.log('failed to delete apartment');
            }
        });
    }
    catch {
        console.log('failed to retrieve apartment to delete');
    }

});

router.get('/:id/details', function (req, res) {
    console.log('GET apartment details')
    var dbo = req.db;
    console.log("index: " + req.query.index)
    index = req.query.index;
    id = functions.decodeID(req.params.id);

    var query = {
        '_id': id
    };

    try {
        dbo.collection('sessions').findOne(query, function (err, doc) {
            if (err) throw err;
            console.log('Successful retrieval');
            console.log(doc.apartments[index]);

            res.status(200).json({ 'success': true, 'apartment': doc.apartments[index] });
        });
    }
    catch {
        console.log('retrieval failed');
    }
    //send the details as json
});

router.get('/:id/tags', function (req, res) {
    var dbo = req.db;

    var id = functions.decodeID(req.params.id);
    var query = {
        '_id': id
    };

    functions.loadDefaultTags(dbo, function (defaultTags) {
        console.log(defaultTags);

        dbo.collection('sessions').findOne(query, function (err, doc) {
            if (err) throw err;
            console.log(doc.customTags);
            var customTags = doc.customTags;

            var tags = defaultTags.concat(customTags);

            res.status(200).json({ 'success': true, 'tags': tags });
        });
    });
})

router.post('/:id/tag', function (req, res) {
    var dbo = req.db;

    var id = functions.decodeID(req.params.id);
    var query = {
        '_id': id
    };

    dbo.collection('sessions').findOne(query, function (err, doc) {
        if (err) throw err;
        console.log('Successful retrieval');
        console.log(doc);

        if (doc['customTags'][0] === "")
            doc['customTags'][0] = req.body.newTag;
        else
            doc['customTags'].push(req.body.newTag);

        console.log('after push');
        console.log(doc);
        var newValues = {
            $set: { "customTags": doc.customTags }
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

})

module.exports = router;