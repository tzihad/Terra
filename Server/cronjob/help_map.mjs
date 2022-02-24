import { MongoClient } from 'mongodb'
import fs from 'fs'
import GeoJSON from 'geojson';
import config from './config.js';

export function help_map() {
    let url = config.database.url;

    MongoClient.connect(
        url,
        (err, client) => {
            if (err) throw err;

            client
                .db("UserData")
                .collection("get_help")
                .find({}, { projection: { _id: 1, latitude: 1, longtitude: 1 } })
                .toArray((err, data) => {
                    if (err) throw err;
                    var proccessed = JSON.stringify(GeoJSON.parse(data, { Point: ['latitude', 'longtitude'] }))
                    fs.writeFile('./csv_data/help.geojson', proccessed, (err) => {
                        console.log('done\n')
                        client.close()
                    })
                });
        }
    );
}