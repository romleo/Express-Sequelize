const ResponseError = require('../routes/auth/response-error');
const Comment = require('../models/comment');
const getAllComment = () => {
  return new Promise((resolve, reject) => {
    Comment.findAll()
        .then((comments) => resolve(comments))
        .catch((err) => reject(new ResponseError(err, 400)));
  });

  //   db.query('SELECT * FROM comments', (err, rows, fields) => {
  //     // console.log('onGet rows: ', rows );
  //     if (err) {
  //       reject(new ResponseError(err, 400));
  //     } else {
  //       resolve(rows);
  //     }
  //   });
  // });
};
const insertComment = (content, articleId, decodedId) => {
  return new Promise((resolve, reject) => {
    Comment.create({
      description: description,
      article_id: article_id,
      user_id: decodedId,
    }).then(() => resolve({status: 'OK'}))
        .catch((err) => reject(new ResponseError(
            'Unable to save new comment ' + err, 400)));
  });
  //   db.query(`INSERT INTO comments VALUES(?, ?, ?, ?, ?, ?)`,
  //       [null, content, articleId, decodedId, new Date(), new Date()], (err, rows, fields) => {
  //         if (err) {
  //           reject(new ResponseError('Sory mean!!Unable to save new comment! ' + err, 400));
  //         } else {
  //           // console.log('onInsert rows: ', rows, 'onInsert userId: ', decodedId );
  //           resolve({status: 'Fine!!Comment is added.'});
  //         }
  //       });
  // });
};

const deleteComment = (id, decodedId) => {
  return new Promise((resolve, reject) => {
    Comment.findByPk(id)
        .then((comments) => {
          if (comments.user_id === decodedId) {
            Comment.destroy({where: {id: id}})
                .then(() => resolve({status: 'OK'}))
                .catch((err) => reject(new ResponseError(
                    `Unable to deleted comment ` + err, 404)));
          } else {
            reject(new ResponseError(
                `User doesn't have permissions to delete this comments! ` + err, 400));
          }
        })
        .catch((err) => reject(new ResponseError(err, 400)));
  });
  //   db.query('SELECT * FROM comments where id=?', [id], (err, rows, fields) => {
  //     if (err) {
  //       reject(new ResponseError(err, 400));
  //     } else {
  //       // console.log('onDelete rows: ', rows, 'onDelete userId: ', decodedId );
  //       if (rows[0].user_id === decodedId) {
  //         db.query(`DELETE FROM comments WHERE id=?`, [id], (err, rows, fields) => {
  //           if (err) {
  //             reject(new ResponseError('Unable to delete comment! ' + err, 400));
  //           } else {
  //             resolve({status: 'Deleted'});
  //           }
  //         });
  //       } else {
  //         reject(new ResponseError(
  //             'Sory,mean!User doesn\'t have permiossions to delete this comment.', 400));
  //       }
  //     }
  //   });
  // });
};



const updateComment = (id, decodedId, content) => {
  return new Promise((resolve, reject) => {
    Comment.findByPk(id)
        .then((comments) => {
          if (comments.user_id === decodedId) {
            Comment.update({description: description}, {where: {id: id}})
                .then(() => resolve({status: 'OK'}))
                .catch((err) => reject(new ResponseError(
                    'Unable to update ' + err, 404)));
          } else {
            reject(new ResponseError(
                'User doesn\'t have permissions to update this comments! '+ err, 400));
          }
        })
        .catch(reject(new ResponseError(err, 400)));
  });
  //   db.query('SELECT * FROM comments where id=?', [id], (err, rows, fields) => {
  //     if (err) {
  //       reject(new ResponseError(err, 400));
  //     } else {
  //       if (rows[0].user_id === decodedId) {
  //         // console.log('onInsert rows: ', rows, 'onInsert userId: ', decodedId);
  //         db.query(`UPDATE comments SET content = ?, updatedDate = ? WHERE id = ?`,
  //             [content, new Date(), id], (err, rows, fields) => {
  //               if (err) {
  //                 reject(new ResponseError('Sory,mean!Unable to update comment! ' + err, 400));
  //               } else {
  //                 resolve({status: 'Fine!!Comment is updated.'});
  //               }
  //             });
  //       } else {
  //         reject(new ResponseError(
  //             'Sory,mean!User doesn\'t have permissions to edit this comment.', 400));
  //       }
  //     }
  //   });
  // });
};

module.exports.getComment = getComment;
module.exports.insertComment = insertComment;
module.exports.updateComment = updateComment;
module.exports.deleteComment = deleteComment;