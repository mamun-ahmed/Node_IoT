var express         = require('express');
var router          = express.Router();
var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;

var User            = require('../models/users');


/* GET users listing. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Server Room Monitor' });
});

router.get('/register',ensureAuthenticated,function (req,res,next) {
  res.render('register',{title:'Register User'});
});

router.post('/register',function (req,res) {

    var position  = req.body.position;
    var firstname = req.body.firstname;
    var lastname  = req.body.lastname;
    var username  = req.body.username;
    var password  = req.body.password;
    var password2 = req.body.password2;
    var email     = req.body.email;
    var mobile    = req.body.mobile;

    //Validation
    req.checkBody('position','Select postion').notEmpty();
    req.checkBody('firstname','Firstname is required').notEmpty();
    req.checkBody('username','Username is required.').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Password do not match').equals(req.body.password);
    req.checkBody('email','Email is required.').notEmpty();
    req.checkBody('email','Email is not valid.').isEmail();
    req.checkBody('mobile','Mobile number is required').notEmpty();

    if(lastname===''){
        lastname = 'None';
    }

    var errors = req.validationErrors();

    if(errors){
        res.render('register',{errors: errors});
    }else {

        var newUser = {
            position  : position,
            firstname : firstname,
            lastname  : lastname,
            username  : username,
            password  : password,
            email     : email,
            mobile    : mobile
        }


        User.createUser(newUser,function (err,user) {

            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg','You are registered and now can login successfully');

        res.redirect('/users/login');
    }

});

passport.use(new LocalStrategy(
    function (username,password,done){
        User.getUserByUsername(username,function (err,user){
            if(err)
                console.log('There is an error: '+err);
            if(!user){
                //console.log("User not found....");
                return done(null,false,{message: 'Unknown User'});
            }else{
                //console.log("User found...");
            }

            /*
              console.log("Username: "+username);
              console.log("compare password: "+password);
              console.log("user.password: "+user.password);
              console.log("Only user: "+user.username);
            */

            User.comparePassword(password,user.password,function (err, isMatch) {

                if(err){
                    console.log(" ------------> Error in Comparing password: "+err);
                }

                if(isMatch){
                    //console.log("-------------> User password match with database. isMatch: "+isMatch);
                    return done(null,user);
                }else {
                    //console.log("-------------> Password didn't match. isMatch: "+isMatch);
                    return done(null, false,{message: 'Invalid Password'});
                }
            });
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null,user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {successRedirect:'/',failureRedirect:'/users/login',failureFlash: true}),
    function (req, res) {
        var name     = req.body.username;
        var password = req.body.password;

        /*  console.log("-------------------> Username: "+name);
            console.log("-------------------> Password: "+password);
        */

        res.redirect('/');
    });

router.get('/logout',function (req, res) {
    req.logout();

    req.flash('success_message', 'You are logged out');

    //console.log("------------> User logged out");
    //console.log("------------> Flash Message: "+req.flash('success_message'));
    res.redirect('/users/login');
});

function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error_msg","You are not logged in.");
        res.redirect("/users/login");
    }
}

module.exports = router;
