var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_gomesr',
  password        : '8619',
  database        : 'cs361_gomesr'
});

module.exports.pool = pool;
