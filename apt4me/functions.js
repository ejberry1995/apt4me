const mongo = require('mongodb');

module.exports = {
    decodeID: function(id) {
        decodedID = Buffer.from(id, 'base64').toString('ascii');
        return new mongo.ObjectID(decodedID);
    },

    encodeID: function (id) {
        id = id.toString();
        encodedID = new Buffer(id);
        return encodedID.toString('base64');
    },

    loadDefaultTags: function (dbo, callback) {
        console.log('attempting to load default tags...')
        try {
            dbo.collection('config').findOne({}, function (err, doc) {
                if (err) throw err;
                console.log('Success!');

                if (doc === null || doc.defaultTags === null) {
                    var emptyArray = [];
                    return callback(emptyArray);
                }
                else
                    return callback(doc.defaultTags)
            });
        }
        catch(err) {
            console.log('Failed!');
            console.log(err);

            var emptyArray = [null];
            return callback(emptyArray);
        }
    },

    loadDefaultModifiers: function (dbo) {

    }

};