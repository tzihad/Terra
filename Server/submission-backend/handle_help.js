import express from 'express';
import config from './config.js'
import fileUpload from 'express-fileupload';
import EventEmitter from 'events'
import { MongoClient, ObjectId } from 'mongodb';

export const handle_help = express.Router();

handle_help.use(fileUpload({
    //limits: { fileSize: 8 * 1024 * 1024 },
    //abortOnLimit: true
}))
handle_help.post('/', function(req, res) {
    var response = {
        info: "",
        token: "",
        code: 200,
        state: true,
    }
    if (req.user.type != 'gov') {
        response.state = false;
        response.info = "Unauthorized"
        res.status(403).json(response)
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
                //let obj = {
                //    latitude: req.body.latitude,
                //    longtitude: req.body.longtitude,
                //    username: req.user.username,
                //    uid: req.user.oid,
                //    time: new Date(Date.now()).toISOString(),
                //    extra_info: req.body.extra_info,
                //    done: false
                //}
                //
                dbms.db("UserData").collection("get_help").updateOne({ _id: new ObjectId(req.body.oid) }, { $set: { done: true, who_changed: req.user.username, wc_id: req.user.oid } }, function(err, result) {
                    if (err) {
                        response.info = "DB err!"
                        response.state = false
                        event.emit("end")
                        dbms.close()
                        throw err
                    } else {
                        response.info = "Done"
                        event.emit('end')
                        dbms.close()
                    }
                });
            }
        });

    }

});