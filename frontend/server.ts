import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as compression from 'compression';
import * as express from 'express';
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');
const fs = require('fs');
const path = require('path');
const filterEnv = require('filter-env');
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
import {join} from 'path';
enableProdMode();
const dotenv = require('dotenv')
dotenv.config();
const config = filterEnv(/(BB_\w+)/, {json: true, freeze: true});

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = (process.cwd().match(/[/\\]dist/g) || []).length > 0 ? process.cwd() : join(process.cwd(), 'dist');

// Provide support for window on the server
const domino = require('domino');
const template = fs.readFileSync(path.join('dist/browser', 'index.html')).toString();
const fetch = require('node-fetch');
const win = domino.createWindow(template);

win.fetch = fetch;
global['window'] = win;
Object.defineProperty(win.document.body.style, 'transform', {
    value: () => {
        return {
            enumerable: true,
            configurable: true
        };
    },
});
global['document'] = win.document;
global['CSS'] = null;
// global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
global['Prism'] = null;

const app = express();

// Config renderer
try {
    app.engine('html', (_, options, callback) => {
        const engine = ngExpressEngine({
            bootstrap: AppServerModuleNgFactory,
            providers: [
                provideModuleMap(LAZY_MODULE_MAP),
                { provide: 'REQUEST', useFactory: () => options.req, deps: [] },
                { provide: 'CONFIG', useFactory: () => config, deps: [] }
            ]
        });
        engine(_, options, callback);
    });
} catch (e) {
    console.log('error', 'there is sonme issue defining app engine ' + e);
}

// configs
app.enable('etag');

// Middleware
app.use(compression());
app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));
app.set('view cache', true);
app.use('/', express.static('dist/browser', { index: false, maxAge: 30 * 86400000 }));

// All regular routes use the Universal engine
app.get('/api/*', (req, res) => {
    res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    res.render('index', { req });
});

app.listen(PORT,() => {
    console.log(`we are serving the site for you at http://localhost:${PORT}!`);
});
