import { MongoClient, ObjectId } from 'mongodb'
import express from 'express'
import config from './config.js';




export const us_details = express.Router()

let url = config.database.url;

MongoClient.connect(
    url,
    (err, client) => {
        if (err) throw err;


        us_details.get('/', function(req, res) {
            var oid = new ObjectId(req.query.id);
            client
                .db("UserData")
                .collection("user_submit")
                .findOne({ _id: oid }, { projection: { uid: 0, _id: 0 } }, function(err, data) {
                    res.json(data)
                });
        });
    });