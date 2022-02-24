import express from 'express';
import config from './config.js'
import fileUpload from 'express-fileupload';
import EventEmitter from 'events'
import { MongoClient } from 'mongodb';

export const get_help = express.Router();

get_help.use(fileUpload({
    //limits: { fileSize: 8 * 1024 * 1024 },
    //abortOnLimit: true
}))
get_help.post('/', function(req, res) {
    var response = {
        info: "",
        token: "",
        code: 200,
        state: true,
    }
    const event = new EventEmitter()

    event.on('end', function() {
        res.status(response.code)
        res.json(response)
    })

    if (response.state) {
        MongoClient.connect(config.database.url, function(err, dbms) {
            if (err) {
                response.code = 502;
                response.info = "Can't reach mongodb"
                console.log('Can\'t connect to MongoDB');
                response.state = false
                event.emit('end')
                dbms.close()
                throw err
            } else {
                let obj = {
                    latitude: req.body.latitude,
                    longtitude: req.body.longtitude,
                    username: req.user.username,
                    uid: req.user.oid,
                    time: new Date(Date.now()).toISOString(),
                    extra_info: req.body.extra_info,
                    done: false
                }

                dbms.db("UserData").collection("get_help").insertOne(obj, function(err, result) {
                    if (err) {
                        response.info = "DB err!"
                        response.state = false
                        event.emit("end")
                        dbms.close()
                        throw err
                    } else {
                        response.info = "query submitted"
                        event.emit('end')
                        dbms.close()
                    }
                });
            }
        });

    }

});