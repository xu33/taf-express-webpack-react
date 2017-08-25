#!/usr/bin/env node
var program = require('commander');
var pkg = require('../package.json');
var version = pkg.version;
var fs = require('fs');
var mkdirp = require('mkdirp');
var ejs = require('ejs');
var co = require('co');
var path = require('path');
/*
.program.option('-v, --view <engine>', 'description');
.command: xxx -v bbb
.program.view === 'bbb'
*/
let locals = {
  CDN_BUSSINESS_NAME: ''
};

program.option('-c, --cdn <cdn>', 'CDN业务名称').parse(process.argv);

function loadTemplate(templatePath) {
  if (/\.ejs$/.test(templatePath)) {
    return fs.readFileSync(templatePath, 'utf8');
  }

  let content = fs.readFileSync(templatePath, 'utf8');
  let newContent = ejs.render(content, locals);

  return newContent;
}

function copyTemplate(templatePath, destPath) {
  let content = loadTemplate(templatePath);

  fs.writeFileSync(destPath, content, 'utf8');
}

function copyRecursive(source, dest) {
  if (fs.lstatSync(source).isDirectory()) {
    mkdirp.sync(dest);
    let files = fs.readdirSync(source);
    files.forEach(file => {
      copyRecursive(path.resolve(source, file), path.resolve(dest, file));
    });
  } else {
    copyTemplate(source, dest);
  }
}

function main() {
  // console.log(program.args);
  // console.log(program.view);

  let projectName = program.args[0];

  locals.projectName = projectName;

  if (program.cdn) {
    locals.CDN_BUSSINESS_NAME = program.cdn;
  }

  fs.mkdirSync(projectName);

  let rootDir = projectName;
  let sourceDir = path.resolve(__dirname, '../templates', 'BoilerPlate');

  // console.log(rootDir, sourceDir);

  let files = fs.readdirSync(sourceDir);

  files.forEach(file => {
    if (/\.conf$/.test(file)) {
      fs.writeFileSync(
        path.resolve(rootDir, `${projectName}.conf`),
        `<${projectName}>myConfig = configExample</${projectName}>`
      );
    } else {
      copyRecursive(path.resolve(sourceDir, file), path.resolve(rootDir, file));
    }
  });

  console.log(`生成成功
  type npm install
  then npm start
  to run the server
  `);
}

main();
