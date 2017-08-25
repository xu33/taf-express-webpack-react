const path = require('path');
const webpack = require('webpack');
const config = require('../webpack/webpack.config');
const uploadDir = require('./cdnAsync');
const compiler = webpack(config);
const BASE_PATH = '<%=CDN_BUSSINESS_NAME%>';

compiler.run((err, stats) => {
  console.log('编译结束!');

  uploadDir(path.resolve(__dirname, '../release'), BASE_PATH).then(pathList => {
    console.log('上传结束', pathList);
    console.log('关闭进程');
    process.exit();
  });
});
