var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('./lib/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var assetPineline = require('./middlewares/assetpipeline');
var app = express();

assetPineline(app, {
  cdn: '//cdn.upchina.com/<%=CDN_BUSSINESS_NAME%>'
});

var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger.morgan_taf_log());
app.use(compress());

if (process.env.NODE_ENV === 'development') {
  let webpackConfig = require('./webpack/webpack.dev.config');
  let webpackDevMiddleware = require('webpack-dev-middleware');
  let webpack = require('webpack');
  let compiler = webpack(webpackConfig);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath
    })
  );
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
routes.init(app);
app.use('/release', express.static(path.join(__dirname, 'release')));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'local') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stack traces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('errorFriendly');
});

module.exports = app;
