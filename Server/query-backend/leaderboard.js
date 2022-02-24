import express from 'express'
import config from '../submission-backend/config.js'
import EventEmitter from 'events'
import { MongoClient } from 'mongodb'
export const leaderboard = express.Router()


leaderboard.post('/', function(req, res) {

    var response = {
        info: "",
        token: "",
        code: 200,
        state: true,
        data: {}
    }
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
                dbms.db("UserData").collection("userdata").find({}, { projection: { fullname: 1, contrib: 1, _id: 0 } }).sort({ contrib: -1 }).limit(config.retrive.leaderboard).toArray(
                    function(err, result) {
                        if (err) {
                            response.info = "Err"
                            event.emit('end')
                            throw err
                        }
                        response.data = result;
                        var a = {
                            fullname: result.fullname,
                            contrib: result.contrib
                        }
                        dbms.close()
                        event.emit('end')
                    })
            }
        });
    } else {
        response.info = "Err"
        event.emit('end')
    }



})