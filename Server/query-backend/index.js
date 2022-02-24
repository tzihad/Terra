import express, { application } from 'express';
import config from './config.js';
import cors from 'cors'
import { leaderboard } from './leaderboard.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { us_details } from './us_details.js';
import { help_details } from './help_details.js';
import { ls_details } from './ls_details.js';




const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(cors())

server.use('/leaderboard', leaderboard)


server.use('/dns.csv', function(req, res) {
    res.sendFile('csv_data/dns.csv', { root: __dirname })
})
server.use('/help.geojson', function(req, res) {
    res.sendFile('csv_data/help.geojson', { root: __dirname })
})

server.use('/dlrd.csv', function(req, res) {
    res.sendFile('./csv_data/dlrd.csv', { root: __dirname })
})

server.use('/dns.geojson', function(req, res) {
    res.sendFile('./csv_data/dns_full.geojson', { root: __dirname })
})

server.use('/dlrd.geojson', function(req, res) {
    res.sendFile('./csv_data/dlrd_full.geojson', { root: __dirname })
})

server.use('/map_us.geojson', function(req, res) {
    res.sendFile('./csv_data/dns.geojson', { root: __dirname })
})
server.use('/map_ls.geojson', function(req, res) {
    res.sendFile('./csv_data/dlrd.geojson', { root: __dirname })
})

server.use('/us_details', us_details)
server.use('/ls_details', ls_details)
server.use('/help_details', help_details)

server.listen(config.servers.query.port);