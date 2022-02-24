import express from 'express'
import config from './config.js'
import crypto from 'crypto'
import EventEmitter from 'events'
import { MongoClient } from 'mongodb'

export const signup = express.Router();

signup.post('/', function(req, res) {
    var response = {
        info: "",
        token: "",
        code: 200,
        state: true,
        request_type: false,
        data: {
            user_indb: false,
            reg_done: false,
        }
    }
    var username, password, fullname;

    if (typeof(req.body) != 'undefined') {
        username = req.body.username.toString().trim()
        password = req.body.password.toString().trim()
        fullname = req.body.fullname.toString().trim()
        if (password == "" && fullname == "") {
            response.request_type = true
            response.state = false
            if (username = "") {
                response.request_type = false;
            }
        }
    } else {
        response.state = false;
    }
    /*
     * Will add validation and checking if we go for producion
     */
    const event = new EventEmitter()

    event.on('end', function() {
        res.json(response)
    })

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
                dbms.db("UserData").collection("userdata").findOne({ username: username }, function(err, result) {
                    if (result == null) {
                        dbms.db("UserData").collection("userdata").insertOne({
                            username: username,
                            password: crypto.createHash('sha256').update(password).digest('hex'),
                            fullname: fullname,
                            contrib: 0,
                            type: "civil"
                        }, function(err, result) {
                            if (err) {
                                response.info = "Registration failed!"
                                response.state = false
                            } else {
                                response.data.reg_done = true;
                            }
                            event.emit('end')
                        });
                    } else {
                        response.data.user_indb = true;
                        response.state = false
                        response.info = "user exists";
                        event.emit('end')
                    }
                });

            }
        });
    } else if (response.request_type) {
        MongoClient.connect(config.database.url, function(err, dbms) {
            if (err) {
                response.code = 502;
                response.info = "Can't reach mongodb"
                console.log('Can\'t connect to MongoDB');
                event.emit('end')
                dbms.close()
                throw err
            }
            dbms.db("UserData").collection("userdata").findOne({ username: username }, function(err, result) {
                if (err) {
                    response.info = "db_err"
                    response.data.user_indb = true;
                    response.state = false
                    event.emit('end')
                }
                if (result == null) {
                    event.emit('end')
                } else {
                    response.data.user_indb = true;
                    response.state = false
                    event.emit('end')
                }
            });
        });
    } else {
        response.info = "All data not provided"
        event.emit('end');
    }
})