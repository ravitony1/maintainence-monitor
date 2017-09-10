const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const Session = require('express-session');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const routes = require('./routes/index');

let app = express();

app.use(Session({
    secret: 'your-random-secret-19890913007',
    resave: true,
    saveUninitialized: true
}));

app.set('views',path.join(__dirname,'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        ifequal: (v1,v2,v3) => {
          return v1==v2|| v1==v3;
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('env', 'development');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status( err.code || 500 )
            .json({
                status: 'error',
                message: err
            });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500)
        .json({
            status: 'error',
            message: err.message
        });
});


module.exports = app;
