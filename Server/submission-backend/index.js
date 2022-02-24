import express, { application } from 'express';
import config from './config.js';
import { login } from './login.js'
import { signup } from './signup.js'
import { ping } from './ping.js'
import jwt from 'express-jwt'
import cors from 'cors'
import { native_submit } from './native_submit.js';
import { prev_landslide } from './prev_landslide.js';
import { get_help } from './get_help.js';
import { submit_csv } from './submit_csv.js';
import { handle_help } from './handle_help.js';

const server = express();

server.use(jwt({ secret: config.secret.jwt_key, algorithms: [config.secret.encryption] }).unless({ path: ['/login', '/signup'] }));
server.use(express.json())
server.use(express.urlencoded({ limit: '100mb', extended: true }))
server.use(cors())


server.use('/ping', ping);
server.use('/login', login);
server.use('/signup', signup);
server.use('/native_submit', native_submit)
server.use('/prev_landslide', prev_landslide)
server.use('/get_help', get_help)
server.use('/submit_csv', submit_csv)
server.use('/handle_help', handle_help)

server.listen(config.servers.submission.port);