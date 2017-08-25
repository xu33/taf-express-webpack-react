const fs = require('fs');
const path = require('path');
const co = require('co');
const upFileUpload = require('@up/file-upload')({
  bucket: 'upcdnfiles',
  busid: 'cdnAsync'
});

function getDefer() {
  let defer = {};

  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
}

function getDirFiles(dirPath) {
  var defer = getDefer();
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      defer.reject(err);
    }

    defer.resolve(files);
  });
  return defer.promise;
}

function exists(path) {
  return fs.existsSync(path) || path.existsSync(path);
}

function isFile(path) {
  return exists(path) && fs.statSync(path).isFile();
}

function isDir(path) {
  return exists(path) && fs.statSync(path).isDirectory();
}

const uploadDir = co.wrap(function*(dirPath, basePath) {
  let files = yield getDirFiles(dirPath);
  let pathList = [];
  for (let i = 0; i < files.length; i++) {
    let filename = files[i];
    if (isDir(path.resolve(dirPath, filename))) {
      let list = yield uploadDir(
        path.resolve(dirPath, filename),
        basePath + '/' + filename
      );

      pathList.push(list);
    } else {
      let data = fs.readFileSync(path.resolve(dirPath, filename));
      let logpath = yield upFileUpload.uploadFile(data, filename, basePath, 1);

      pathList.push(logpath);
    }
  }

  return pathList;
});

module.exports = uploadDir;
