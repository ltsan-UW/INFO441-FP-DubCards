import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import apiRouter from './app/api.js'
import authRouter from './app/routes/auth.routes.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import 'dotenv/config';
import { connectDB } from './app/config/db.js';


import { WebAppAuthProvider } from 'msal-node-wrapper';
import sessions from 'express-session'
import { env } from 'process';
const azure_secret = process.env.AZURE_AUTH_SECRET;
const azure_client_id = process.env.AZURE_CLIENT_ID;
const azure_authority_id = process.env.AZURE_AUTHORITY_ID;

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.enable('trust proxy')
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: azure_secret,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
  }));
const authProvider = await WebAppAuthProvider.initialize({
    auth: {
        authority: "https://login.microsoftonline.com/" + azure_authority_id,
        clientId: azure_client_id,
        clientSecret: azure_secret,
        redirectUri: "/redirect",
    }
});
app.use(authProvider.authenticate({
    protectAllRoutes: false, // force user to authenticate for all routes
    acquireTokenForResources: { // acquire an access token for this resource
        "graph.microsoft.com": { // you can specify the resource name as you like
            scopes: ["User.Read"], // scopes for the resource that you want to acquire a token for
            routes: ["/profile"] // acquire a token before the user hits these routes
        },
    }
}));
app.use(authProvider.interactionErrorHandler()); // this middleware handles interaction required errors

// unauthorized
app.get('/error', (req, res) => res.status(500).send('server error'));
// error
app.get('/unauthorized', (req, res) => res.status(401).send('Permission denied'));


app.use('/api', apiRouter);
app.use('/auth', authRouter);

export default app;
