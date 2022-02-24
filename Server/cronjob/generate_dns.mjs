import { MongoClient } from 'mongodb'
import fs from 'fs'
import jsonexport from 'jsonexport';
import config from './config.js';

export function generate_dns() {

    let url = config.database.url;

    MongoClient.connect(
        url,
        (err, client) => {
            if (err) throw err;

            client
                .db("UserData")
                .collection("user_submit")
                .find({}, { projection: { _id: 0, username: 0, uid: 0 } })
                .toArray((err, data) => {
                    if (err) throw err;
                    jsonexport(data, function(err, csv) {
                        if (err) return console.error(err)
                        fs.writeFile('./csv_data/dns.csv', csv, (err) => {
                            console.log('done\n')
                            client.close()
                        })
                    })
                });
        }
    );
}