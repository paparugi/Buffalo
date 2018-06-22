var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const assert = require('assert');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();





function s3Cloud ( user ) {
    this.accessKeyId = user.accessKeyId;
    this.secretAccessKey = user.secretAccessKey;
    this.cloudType = user.cloudType;

    try{

        this.s3Client = createConnection( this.accessKeyId, this.secretAccessKey );;

    } catch( e ) {
        //Update view to indicate a connection could not be made with given credentials.
        console.log(e);
    }

    this.directories =  listDirectories( this.s3Client ).then(function (data) {
        directories = data;
    });


    console.log( this.directories );

    function createConnection ( accessKeyId, secretAccessKey ) {
        console.log('createConnection() AWS');

        //Possibly change this so each s3 cloud updates config eavh time and only pulls in aws once? If there are 2 s3Cloud objects..
        //Function called on construction

        let AWS = require('aws-sdk');

        let credentials = {accessKeyId: accessKeyId, secretAccessKey: secretAccessKey};

        AWS.config.update(credentials);

        this.s3Client = new AWS.S3();

        return s3Client;
    }

    function listDirectories ( s3Client ) {
        console.log('listDirectories()');

        s3Client.listBuckets(function (err, data) {

            if (err) {

                console.log(err)

            } else {
                data;
            }

        });
    }

    function setDirectories ( data ) {
        console.log('setDirectories()');



    }



    function getDirectories ( s3Client, fn ) {
        console.log('getDirectories()');

        s3Client.listBuckets( function(err, data) {

            if (err) {

                console.log(err)

            } else {

                fn(data);
                console.log("Successfully uploaded data to myBucket/myKey");

            }

        });
    }
}

var cloud = new s3Cloud(user);
console.log(cloud.connectionVerified);

//
// var AWS = require('aws-sdk');
//
// AWS.config.update({
//     accessKeyId: "AKIAJTXN5JBFSQUOZFYA ",
//     secretAccessKey: "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",
// });
//
// var s3 = new AWS.S3();
//
// // Bucket names must be unique across all S3 users
//
// var myBucket = 'amazonherdtest3';
//
// var myKey = 'myBucketKey';
//
// s3.createBucket({Bucket: myBucket}, function(err, data) {
//
//     if (err) {
//
//         console.log(err);
//
//     } else {
//
//         params = {Bucket: myBucket, Key: myKey, Body: 'Hello!'};
//
//         s3.putObject(params, function(err, data) {
//
//             if (err) {
//
//                 console.log(err)
//
//             } else {
//
//                 console.log("Successfully uploaded data to myBucket/myKey");
//
//             }
//
//         });
//
//     }
//
// });



var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(uri, function(err, client) {
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    insertDocuments(db, function() {
        client.close();
    });
});

const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('glossary');
    // Insert some documents
    collection.insertMany([
        {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
