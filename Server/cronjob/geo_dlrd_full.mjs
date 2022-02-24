import { MongoClient } from 'mongodb'
import fs from 'fs'
import GeoJSON from 'geojson';
import config from './config.js';

export function generate_dlrd_full() {

    let url = config.database.url;

    MongoClient.connect(
        url,
        (err, client) => {
            if (err) throw err;

            client
                .db("UserData")
                .collection("prev_landslides")
                .find({}, { projection: { _id: 0, username: 0, uid: 0 } })
                .toArray((err, data) => {
                    if (err) throw err;
                    var proccessed = JSON.stringify(GeoJSON.parse(data, { Point: ['latitude', 'longtitude'] }))
                    fs.writeFile('./csv_data/dlrd_full.geojson', proccessed, (err) => {
                        console.log('done\n')
                        client.close()
                    })
                });
        }
    );

}