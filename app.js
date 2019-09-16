var express          = require('express');
var path             = require('path');
var favicon          = require('serve-favicon');
var logger           = require('morgan');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser');
var dbConnect        = require('./services/dbconnect');
var passport         = require('passport');
var morgan           = require('morgan');
var expressValidator = require('express-validator');
var session          = require('express-session');
var passport         = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var flash            = require('connect-flash');

//Messaging Service
var pusher          =  require('./services/pusher');


var index       = require('./routes/index');
var users       = require('./routes/users');
var settings    = require('./routes/settings');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public','images/favicon', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/bower_components',express.static(path.join(__dirname,'bower_components/')));
app.use(express.static(path.join(__dirname,'public')));
// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));


//Connect Flash
app.use(flash());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//required for passport
app.use(session({secret:'levintecH4969?'}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', index);
app.use('/users', users);
app.use('/settings',settings);



/*// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/





// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_ms');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

module.exports = app;
