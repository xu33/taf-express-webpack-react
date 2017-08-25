const express = require('express');
const router = express.Router();
const common = require('../lib/common');
const debug = require('debug')('app:' + common.getFileName(__filename));

// e.g
const project = global.CONFIG['BoilerPlate'];   // read config
debug('getConfig:', project);                   // debug

// Router ===================================================

router.get('/', init, renderIndex);


// middleware ===================================================

function init(req, res, next) {
    next();
}


// render ===================================================

function renderIndex(req, res, next) {
    res.render('./' + 'index', {
        title: 'BoilerPlate'
    });
}

module.exports = router;