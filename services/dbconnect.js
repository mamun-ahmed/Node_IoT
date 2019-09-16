var express       = require('express');
var mysql         = require('mysql');

var pool = mysql.createPool({
    host:       'localhost',
    user:       'root',
    password:   'precious4969',
    database:   'nuvista'
});


module.exports = pool;