import express from 'express';
import config from './config.js'
import fileUpload from 'express-fileupload';
import { MongoClient, ObjectId } from 'mongodb';
import EventEmitter from 'events'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

export const native_submit = express.Router();


native_submit.use(fileUpload({
    //limits: { fileSize: 8 * 1024 * 1024 },
    //abortOnLimit: true
}))








native_submit.post('/', function(req, res) {
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
                let obj = {}
                try {
                    obj = {
                        latitude: req.body.latitude,
                        longtitude: req.body.longtitude,
                        username: req.user.username,
                        uid: req.user.oid,
                        submission_time: (new Date()).toISOString(),
                        steepness: Number(req.body.steepness),
                        rainfall: Number(req.body.rainfall),
                        water_body_frequency: Number(req.body.water_body_frequency),
                        steep_var: Number(req.body.steep_var),
                        rock_type: Number(req.body.rock_type),
                        prediction: Number(req.body.prediction),
                        recommendation: req.body.recom,
                        natural_prop: {},
                        water_bodies: {},
                        sudden_changes: {},
                        human_struc: {},
                        verified: false,
                        votes: 0
                            //
                    }
                    if (!req.body.natural_prop.includes("N")) {
                        obj.natural_prop = {
                            volcano: Number(req.body.natural_prop.includes("volcano")),
                            ice: Number(req.body.natural_prop.includes("ice")),
                            water_fall_source: Number(req.body.natural_prop.includes("water_fall_source")),
                        }
                    } else {
                        obj.natural_prop = {
                            volcano: 0,
                            ice: 0,
                            water_fall_source: 0,
                        }
                    }
                    if (!req.body.human_struc.includes("N")) {
                        obj.human_struc = {
                            irrigation: Number(req.body.human_struc.includes("irrigation")),
                            excavation: Number(req.body.human_struc.includes("excavation")),
                            drainage: Number(req.body.human_struc.includes("drainage")),
                            structures_on_slope: Number(req.body.human_struc.includes("struc_on_slope"))
                        }
                    } else {
                        obj.human_struc = {
                            irrigation: 0,
                            excavation: 0,
                            drainage: 0,
                            structures_on_slope: 0,
                        }
                    }
                    if (!req.body.sudden_changes.includes("N")) {
                        obj.sudden_changes = {
                            hole: Number(req.body.sudden_changes.includes("hole")),
                            tilted_tree: Number(req.body.sudden_changes.includes("tilted_tree")),
                            recent_wildfire: Number(req.body.sudden_changes.includes("recent_wildfire")),
                            cracks_soil: Number(req.body.sudden_changes.includes("cracks_soil")),
                            debris_flow_sign: Number(req.body.sudden_changes.includes("debris_flow_sign")),
                        }
                    } else {
                        obj.sudden_changes = {
                            hole: 0,
                            tilted_tree: 0,
                            recent_wildfire: 0,
                            cracks_soil: 0,
                            debris_flow_sign: 0,
                        }
                    }
                    if (!req.body.water_bodies.includes("N")) {
                        obj.water_bodies = {
                            river: Number(req.body.water_bodies.includes("river")),
                            water_fall: Number(req.body.water_bodies.includes("waterfall")),
                            waterbody_valley: Number(req.body.water_bodies.includes("waterbodyvalley")),
                            lake: Number(req.body.water_bodies.includes("lake")),
                            water_body: Number(req.body.water_bodies.includes("water_body")),
                        }
                    } else {
                        obj.water_bodies = {
                            river: 0,
                            water_fall: 0,
                            waterbody_valley: 0,
                            lake: 0,
                        }
                    }
                } catch (e) {
                    response.state = false
                    dbms.close()
                    event.emit('end')
                }
                if (response.state) {
                    dbms.db("UserData").collection("user_submit").insertOne(obj, function(err) {
                        if (err) {
                            response.info = "insert err"
                            dbms.close()
                            event.emit("end")
                            throw err
                        } else {

                            console.log(req.files)
                            var uploadPath = __dirname + '/img/' + obj._id.toString();
                            req.files.file1.mv(uploadPath + '_1' + path.extname(req.files.file1.name), function(err) {
                                if (err) {
                                    response.info = err
                                    response.state = false
                                }
                            });
                            req.files.file2.mv(uploadPath + '_2' + path.extname(req.files.file2.name), function(err) {
                                if (err) {
                                    response.info = err
                                    response.state = false
                                }
                            });
                            req.files.file3.mv(uploadPath + '_3 ' + path.extname(req.files.file3.name), function(err) {
                                if (err) {
                                    response.info = err
                                    response.state = false
                                }
                            });
                            console.log(obj.uid);
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
                        }
                    });
                } else {
                    dbms.close()
                    event.emit('end')
                }

            }

        });
    } else {
        event.emit("end");
    }
});