var db              = require('../services/dbconnect.js');
var bcrypt          = require('bcryptjs');


module.exports.createUser = function (newUser, callback) {

        //console.log('---------------->Username: '+newUser.username);

    bcrypt.genSalt(10,function (err,salt) {
       bcrypt.hash(newUser.password,salt,function (err,hash) {
           newUser.password = hash;

           db.getConnection(function (err, connection) {
               //Use the connection
               connection.query('INSERT INTO users SET ?', newUser,function (error,result) {

                   //And done with the connection
                   connection.release();

                   //Handle error after the connection
                   if(error)
                       console.log("----------------> Mysql Database Query error: "+error);
                   /*
                   else
                       console.log("----------------> MySQL Database query successful");
                   */

                   //Don't use the connection here, it has been return to the pool
               });
           });
       });
    });
}

module.exports.getUserByUsername = function (username, callback) {

    //console.log("Given Username: "+username);

    db.getConnection(function (err, connection) {
        //Use the connection
        connection.query('SELECT * FROM users WHERE username = ?',[username],function (error, row, fields) {

            //And done with the connection
            connection.release();

            //Handle error after the release
            if(err) {
                console.log('-----------------> Mysql Database query error: '+err);
            }
            else{
                if(row[0]===null) {
                    //console.log("---------> Email: " + row[0].email);
                }
                return callback(err,row[0]);
            }

            //Don't use the connection here, it has been return to the pool
        });
    });

}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if(err)
            console.log("Error in comparePassword in user model: "+err);
        else
            callback(null, isMatch);
    });
}

module.exports.getUserById = function (id, callback) {

    db.getConnection(function (err, connection) {
        //Use the connection
        connection.query('SELECT * FROM users WHERE id=?', id, function (error, result) {
            //And done with the connection
            connection.release();

            //Handle error after the release
            if(err)
                console.log("Error from getUserById: "+err);
            else
                callback(err,result);

            //Don't use the connection here, it has been return to the pool
        });
    });
}
