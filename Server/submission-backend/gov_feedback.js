import express from 'express';
import config from './config.js'
import fileUpload from 'express-fileupload';
import { MongoClient } from 'mongodb';

var gov_feedback = express.Router();




gov_feedback.post('/', function(req, res) {
    var response = {
        info: "",
        token: "",
        code: 200,
        state: true,
        request_type: false,
    }
    const event = new EventEmitter()

    event.on('end', function() {
        res.status(response.code)
        res.json(response)
    })

    if (!req.files || Object.keys(req.files).length === 0) {
        response.code = 400
        response.info = 'No files were uploaded.'
        event.emit('end')
    }
    if (response.state) {
        MongoClient.connect(config.database.url, function(err, dbms) {
            if (err) {
                response.code = 502;
                response.info = "Can't reach mongodb"
                console.log('Can\'t connect to MongoDB');
                event.emit('end')
                dbms.close()
                throw err
            } else {
                let obj = {
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    username: req.user.username,
                    uid: req.user._id,
                    time: new Date(Date.now()).toISOString(),
                    details: req.body.details,
                    type: req.body.type //urgent or not
                }

                dbms.db("UserData").collection("user_submit").insertOne({ username: username, password: crypto.createHash('sha256').update(password).digest('hex'), fullname: fullname }, function(err, result) {
                    if (err) {
                        response.info = "DB err!"
                        event.emit("end")
                    } else {
                        uploadPath = __dirname + '../../Data Manipulation/report/';
                        req.files.file1.mv(uploadPath + result._id + '_' + req.files.file1.name, function(err) {
                            if (err) {
                                response.info = err
                                response.state = false
                            }
                        });
                        req.files.file2.mv(uploadPath + result._id + '_' + req.files.file2.name, function(err) {
                            if (err) {
                                response.info = err
                                response.state = false
                            }
                        });
                    }
                    dbms.close()
                    event.emit('end')
                });

            }

        });
    } else {
        event.emit("end");
    }
});

module.exports = gov_feedback;