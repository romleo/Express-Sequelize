const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('./token-config.js');
const tokenUtils = require('./token-utils');
const User =require ('../../models/user');

app.use('*', (request, response, next) => {
  if (request.baseUrl == '/register' || request.baseUrl == '/login') {
    next();
  } else {
    tokenUtils.getTokenUserId(request)
        .then((user) => next()) // user? userId ?
        .catch((error) => response.status(error.status).send(error.message));
  }
});

app.get('/users', (request, response) => {
  User.findAll().then(function(user) {
    if (user) {
      response.send(user);
    } else {
      response.status(400).send(err);
    }
  });
});
//   db.query(`SELECT * FROM users`, [], (err, rows, fields) => {
//     if (err) {
//       response.status(400).send(err);
//     } else {
//       response.send(rows);
//     }
//   });
// });

app.post('/register', (request, response) => {
  const data = request.query;
  const hashedPassword = crypto.createHash('md5').update(data.pass).digest('hex');

  // if (data.name && data.pass) {
  //   db.query(`INSERT INTO users VALUES(?, ?, ?, ?)`,
  //       [null, data.name, hashedPassword, new Date()], function(err, rows, fields) {
  //         if (err) {
  //           response.status(400).send({error: 'Unable to register new user! ' + err});
  //         } else {
    User.create({
      name: data.name,
      password: hashedPassword,
    }).then(function(user) {
      if (user) {
        const token = jwt.sign({id: user.id, password: hashedPassword}, config.secret, {
          expiresIn: 86400, // expires in 24 hours
        });
        response.send({auth: true, token: token});
      } else {
        response.status(400).send({error: 'Unable to save new user'});
      }
    });
  });

app.post('/login', (request, response) => {
  const data = request.query;
  const hashedPassword = crypto.createHash('md5').update(data.pass).digest('hex');

  User.findOne({
    where: {
      name: data.name,
      password: hashedPassword,
    },
  }).then(function(user) {
    if (user) {
      const token = jwt.sign({id: user.id, password: hashedPassword}, // I use user.id instead user[0].id
          config.secret, {
            expiresIn: 86400, // expires in 24 hours
          });
      console.log('CHECK: ', token);
      response.send({auth: true, token: token});
      if (user.length === 0) {
        response.status(400).send({error: 'Username or password is incorrect'});
      };
    } else {
      response.status(400).send(err);
    }
  });
});
  

  // if (data.name) { //  && data.pass?
  //   db.query(`SELECT * FROM users WHERE name = ? AND pass = ?`,
  //       [data.name, hashedPassword], (err, rows, fields) => {
  //         if (err) {
  //           response.status(400).send(err);
  //         } else {
  //           if (rows.length === 0) {
  //             response.status(400).send({error: 'Username or password is incorrect'});
  //           } else {
  //             // console.log('LOGIN ROWS: ' + rows[0].id);
  //             const token = jwt.sign({id: rows[0].id, pass: hashedPassword}, config.secret, {
  //               expiresIn: 86400, // expires in 24 hours
  //             }); response
  //                 .send({status: 'Hello, ' + data.name, auth: true, token: token});
  //           }
  //         }
  //       });
//   }
// });