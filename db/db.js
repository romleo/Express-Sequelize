var mysql = require('mysql');

db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'superroot',
  database : 'articles'

});

db.connect();   