const express = require('express');
const app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var debug = require('debug');

const MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/';

//routes
var indexRouter = require('./routes/index');
var apartmentRouter = require('./routes/apartments');

MongoClient.connect(url, { useUnifiedTopology: true },
    function (err, client) {
        if (err) throw err;
        console.log('Database connection established...');

        var dbo = client.db('apt4meDB');

        // ========================
        // Middlewares
        // ========================
        app.set('view engine', 'ejs');
        app.use(express.static(__dirname + '/public'));
        // uncomment after placing your favicon in /public
        //app.use(favicon(__dirname + '/public/favicon.ico'));
        app.use(logger('dev'));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(cookieParser());

        //make database accessible to http requests
        app.use(function (req, res, next) {
            req.db = dbo;
            next();
        });

        app.use('', indexRouter);
        app.use('/apartments', apartmentRouter);

        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });


        // ========================
        // Listen
        // ========================
        app.set('port', process.env.PORT || 3000);

        var server = app.listen(app.get('port'), function () {
            debug('Express server listening on port ' + server.address().port);
        });

    }
);