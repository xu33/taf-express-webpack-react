const fs = require('fs');
const path = require('path');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const RELEASE_PATH = '/release/';
const manifest = require('../release/manifest.json');

/**
 * @param {Object} app - express instance
 * @param {String} cdn - cdn url
 */
const assetPipeline = (app, cdn) => {
  function getUrlByEnv(assetName) {
    let url;
    let realName = manifest[assetName];
    if (IS_DEVELOPMENT) {
      url = `/assets/${assetName}`;
    } else if (IS_PRODUCTION) {
      url = `${cdn}/${realName}`;
    } else {
      url = `${RELEASE_PATH}/${realName}`;
    }

    return url;
  }

  function script(assetName) {
    return `<script src="${getUrlByEnv(assetName)}"></script>`;
  }

  function link(assetName) {
    var url = getUrlByEnv(assetName);
    if (IS_DEVELOPMENT) {
      url = 'about:blank';
    }
    return `<link rel="stylesheet" href="${url}">`;
  }

  app.locals.script = script;
  app.locals.link = link;
};

module.exports = assetPipeline;
