/**
 * Created by shinan on 2017/4/13.
 */
const path = require('path');
const fs = require('fs');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const manifest = require('../release/manifest.json');

function assetPipeline(app, { cdn }) {
  const CSS_RE = /\.css$/;
  const JS_RE = /\.js$/;

  const getCorrectPath = (cdn, assetName) => {
    let type;
    if (CSS_RE.test(assetName)) {
      type = 'css';
    } else {
      type = 'js';
    }

    if (IS_DEVELOPMENT && type === 'js') {
      return `/assets/${assetName}`;
    }

    // 开发模式下，注入方式加载css，所以这里返回空地址，防止报404错误
    if (IS_DEVELOPMENT && type === 'css') {
      return 'about:blank';
    }

    if (IS_PRODUCTION) {
      let realAssetName = manifest[assetName];
      return `${cdn}/${realAssetName}`;
    }

    let realAssetName = manifest[assetName];

    return `/release/${realAssetName}`;
  };

  app.locals.url = function(assetName) {
    return getCorrectPath(cdn, assetName);
  };
}

module.exports = assetPipeline;
