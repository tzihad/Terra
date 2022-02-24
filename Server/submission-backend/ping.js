import express from 'express'
import EventEmitter from 'events'

export const ping = express.Router()

///
/// Get contrib every submut and login not here 
///


ping.post('/', function(req, res) {
    res.end()
})