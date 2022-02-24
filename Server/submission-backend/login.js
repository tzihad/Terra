import express from 'express'
import config from './config.js'
import crypto from 'crypto'
import EventEmitter from 'events'
import { MongoClient } from 'mongodb'
import jwt from 'jsonwebtoken'

export const login = express.Router()


login.post('/', function(req, res) {

    var response = {
        info: "",
        token: "",
        code: 200,
        state: true,
        data: {
            username: "",
            fullname: "",
        }
    }

    var username = typeof(req.body.username) == 'undefined' ? (response.state = false) : req.body.username.toString()
    var password = typeof(req.body.password) == 'undefined' ? (response.state = false) : req.body.password.toString()

    const event = new EventEmitter()

    event.on('end', function() {
        res.json(response)
    })

    if (response.state) {

        /* 
         * Main program
         */
        MongoClient.connect(config.database.url, function(err, dbms) {
            if (err) {
                response.code = 502;
                response.info = "Can't reach mongodb"
                dbms.close()
                event.emit('end')
                throw err
            } else {
                dbms.db("UserData").collection("userdata").findOne({ username: username, password: crypto.createHash('sha256').update(password).digest('hex') }, function(err, result) {
                    if (err) throw err
                    if (result != null) {
                        response.info = "Success"
                        response.data.username = username
                        response.data.fullname = result.fullname
                        response.data.contrib = result.contrib
                        response.data.type = result.type
                        response.token = jwt.sign({ username: username, type: result.type, oid: result._id.toString(), iat: Math.floor(Date.now() / 1000) - 30 }, config.secret.jwt_key, { expiresIn: '30day' })
                    } else {
                        response.state = false;
                        response.info = "Username and password doesn't match"
                    }
                    dbms.close()
                    event.emit('end')
                })
            }
        });
    } else {
        response.info = "User name / Password not provided"
        event.emit('end')
    }



})