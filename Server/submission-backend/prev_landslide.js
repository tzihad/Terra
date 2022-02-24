import express from 'express';
import config from './config.js'
import { MongoClient, ObjectId } from 'mongodb';
import EventEmitter from 'events'

import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

export const prev_landslide = express.Router();
prev_landslide.use(fileUpload({
    //limits: { fileSize: 8 * 1024 * 1024 },
    //abortOnLimit: true
}))




prev_landslide.post('/', function(req, res) {
    console.log(req.body)
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
                    longtitude: req.body.longtitude,
                    username: req.user.username,
                    uid: req.user.oid,
                    submission_time: new Date(Date.now()).toISOString(),
                    time: req.body.time,
                    casualties: req.body.casualties,
                    affected: req.body.affected,
                    details: req.body.details,
                    reason: req.body.reason,
                    type: req.body.type,
                    news_source: req.body.news_source,
                    area_size: req.body.area
                }
                dbms.db("UserData").collection("prev_landslides").insertOne(obj, function(err, result) {
                    if (err) {
                        response.info = "Cannot insert!"
                        event.emit("end")
                    } else {

                        response.info = "done"
                    }
                    dbms.db("UserData").collection("userdata").updateOne({ _id: new ObjectId(obj.uid) }, {
                            $inc: {
                                contrib: 15 + 5 * Math.random()
                            },
                        },
                        function(err, res) {
                            if (err) throw err;
                            dbms.db("UserData").collection("userdata").findOne({ _id: new ObjectId(obj.uid) }, function(err, res) {
                                if (err) throw err
                                response.contrib = res.contrib
                                console.log(res)
                                dbms.close()
                                event.emit('end')
                            })
                        });
                });

            }

        });
    } else {
        event.emit("end");
    }
});