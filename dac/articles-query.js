const ResponseError = require('../routes/auth/response-error');
const Article = require('../models/article');
const getArticle = () => {
  return new Promise((resolve, reject) => {
    Article.findAll()
        .then((articles) => resolve(articles))
        .catch((err) => reject(new ResponseError(err, 400)));
  });
  //   db.query('SELECT * FROM articles', (err, rows, fields) => {
  //     // console.log('onGet rows: ', rows );
  //     if (err) {
  //       reject(new ResponseError(err, 400));
  //     } else {
  //       resolve(rows);
  //     }
  //   });
  // });
};

const deleteArticle = (id, decodedId) => {
  return new Promise((resolve, reject) => {
    Article.findAll({where: {id: id}})
        .then((articles) => {
          if (articles[0].user_id === decodedId) {
            Article.destroy({where: {id: id}})
                .then(() => resolve({status: 'OK'}))
                .catch((err) =>
                  reject(new ResponseError('Unable to delete article ' + err, 400)),
                );
          } else {
            reject(new ResponseError(
                `User doesn't have permissions to delete this articles! ` + err, 400));
          }
        })
        .catch((err) => reject(new ResponseError(err, 400)));
    // db.query('SELECT * FROM articles where id=?', [id], (err, rows, fields) => {
    //   if (err) {
    //     reject(new ResponseError(err, 400));
    //   } else {
    //     // console.log('onDelete rows: ', rows, 'onDelete userId: ', decodedId );
    //     if (rows[0].user_id === decodedId) {
    //       db.query(`DELETE FROM articles WHERE id=?`, [id], (err, rows, fields) => {
    //         if (err) {
    //           reject(new ResponseError('Unable to delete article!Warning!!: ' + err, 400));
    //         } else {
    //           resolve({status: 'Deleted'});
    //         }
    //       });
    //     } else {
    //       reject(new ResponseError(
    //           'Sory,mean!!User doesn\'t have permiossions to delete this article.', 400));
    //     }
    //   }
    // });
  });
};

const insertArticle = (title, body, decodedId) => {
  return new Promise((resolve, reject) => {
    Article.create({
      title: title,
      body: body,
      user_id: decodedId,
    }).then(function(article) {
      if (article) {
        resolve({status: 'OK'});
      } else {
        reject(new ResponseError('err', 400));
      }
    });
  });
  //   db.query(`INSERT INTO articles VALUES(?, ?, ?, ?, ?, ?)`,
  //       [null, title, body, decodedId, new Date(), new Date()],
  //       (err, rows, fields)=> {
  //         if (err) {
  //           reject(new ResponseError('Unable to save new article! ' + err, 400));
  //         } else {
  //           // console.log('onInsert rows: ', rows, 'onInsert userId: ', decodedId );
  //           resolve({status: ' OK,mean!!Article is added.'});
  //         }
  //       });
  // });
};

const updateArticle = (id, decodedId, title, body) => {
  return new Promise((resolve, reject) => {
    Article.findByPk(id)
        .then((articles) => {
          if (articles.user_id === decodedId) {
            Article.update({title: title, body: body}, {where: {id: id}})
                .then((articles) => {
                  if (articles.length === 0) {
                    reject(new ResponseError(`Id: "${id}" not found ` + err, 400));
                  } else {
                    resolve({status: 'OK'});
                  }
                })
                .catch((err) => reject(new ResponseError(
                    'Unable to update article ' + err, 400)));
          } else {
            reject(new ResponseError(
                `User doesn't have permissions to edit this articles! ` + err, 400));
          }
        })
        .catch((err) => reject(new ResponseError(err, 400)));
  });
  //   db.query('SELECT * FROM articles where id=?', [id], (err, rows, fields) => {
  //     if (err) {
  //       reject(new ResponseError(err, 400));
  //     } else {
  //       if (rows[0].user_id === decodedId) {
  //         // console.log('onInsert rows: ', rows, 'onInsert userId: ', decodedId);
  //         db.query(`UPDATE articles SET title = ?, body = ?, updatedDate = ? WHERE id = ?`,
  //             [title, body, new Date(), id], (err, rows, fields) => {
  //               if (err) {
  //                 reject(new ResponseError('Unable to update article! ' + err, 400));
  //               } else {
  //                 resolve({status: 'Article is updated.Its OK'});
  //               }
  //             });
  //       } else {
  //         reject(new ResponseError(
  //             'Sory,mean.User doesn\'t have permissions to edit this article.', 400));
  //       }
  //     }
  //   });
  // });
};

module.exports.getArticle = getArticle;
module.exports.insertArticle = insertArticle;
module.exports.updateArticle = updateArticle;
module.exports.deleteArticle = deleteArticle;