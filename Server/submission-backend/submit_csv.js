import express from 'express'
import EventEmitter from 'events'
import { MongoClient } from 'mongodb'
import config from './config.js'
import path from 'path';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import { dir } from 'console';
import e from 'express';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);


export const submit_csv = express.Router()

submit_csv.use(fileUpload({
    //limits: { fileSize: 8 * 1024 * 1024 },
    //abortOnLimit: true
}))



submit_csv.post('/', function(req, res) {

    var response = {
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
                    username: req.user.username,
                    time: new Date(Date.now()).toISOString(),
                    uid: req.user.oid
                }
                dbms.db("UserData").collection("gov_submit").insertOne(obj, function(err, result) {
                    if (err) {
                        response.info = err
                        dbms.close()
                        event.emit("end")
                        throw err
                    } else {
                        var uploadPath = __dirname + "/gov_csv/";
                        console.log(uploadPath + obj._id + '_' + req.files.file.name)
                        req.files.file.mv(uploadPath + obj._id + '_' + req.files.file.name, function(err) {
                            if (err) {
                                response.info = err
                                response.state = false
                                event.emit('end')
                                throw err
                            }
                            dbms.close()
                            event.emit('end')

                        });
                    }
                });
            }
        });
    } else {
        response.info = "failed"
        response.state = false
        event.emit('end')
    }

})