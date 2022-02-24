import { MongoClient, ObjectId } from 'mongodb'
import express from 'express'
import config from './config.js';




export const help_details = express.Router()

let url = config.database.url;

MongoClient.connect(
    url,
    (err, client) => {
        if (err) throw err;

        help_details.get('/', function(req, res) {
            var oid = new ObjectId(req.query.id);
            console.log(oid)
            client
                .db("UserData")
                .collection("get_help")
                .findOne({ _id: oid }, { projection: { uid: 0, _id: 0, wc_id: 0 } }, function(err, data) {
                    res.json(data)
                });
        });
    });