const ResponseError = require('../routes/auth/response-error');

const getComment = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM comments', (err, rows, fields) => {
      // console.log('onGet rows: ', rows );
      if (err) {
        reject(new ResponseError(err, 400));
      } else {
        resolve(rows);
      }
    });
  });
};
const insertComment = (content, articleId, decodedId) => {
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO comments VALUES(?, ?, ?, ?, ?, ?)`,
        [null, content, articleId, decodedId, new Date(), new Date()], (err, rows, fields) => {
          if (err) {
            reject(new ResponseError('Sory mean!!Unable to save new comment! ' + err, 400));
          } else {
            // console.log('onInsert rows: ', rows, 'onInsert userId: ', decodedId );
            resolve({status: 'Fine!!Comment is added.'});
          }
        });
  });
};

const deleteComment = (id, decodedId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM comments where id=?', [id], (err, rows, fields) => {
      if (err) {
        reject(new ResponseError(err, 400));
      } else {
        // console.log('onDelete rows: ', rows, 'onDelete userId: ', decodedId );
        if (rows[0].user_id === decodedId) {
          db.query(`DELETE FROM comments WHERE id=?`, [id], (err, rows, fields) => {
            if (err) {
              reject(new ResponseError('Unable to delete comment! ' + err, 400));
            } else {
              resolve({status: 'Deleted'});
            }
          });
        } else {
          reject(new ResponseError(
              'Sory,mean!User doesn\'t have permiossions to delete this comment.', 400));
        }
      }
    });
  });
};



const updateComment = (id, decodedId, content) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM comments where id=?', [id], (err, rows, fields) => {
      if (err) {
        reject(new ResponseError(err, 400));
      } else {
        if (rows[0].user_id === decodedId) {
          // console.log('onInsert rows: ', rows, 'onInsert userId: ', decodedId);
          db.query(`UPDATE comments SET content = ?, updatedDate = ? WHERE id = ?`,
              [content, new Date(), id], (err, rows, fields) => {
                if (err) {
                  reject(new ResponseError('Sory,mean!Unable to update comment! ' + err, 400));
                } else {
                  resolve({status: 'Fine!!Comment is updated.'});
                }
              });
        } else {
          reject(new ResponseError(
              'Sory,mean!User doesn\'t have permissions to edit this comment.', 400));
        }
      }
    });
  });
};

module.exports.getComment = getComment;
module.exports.insertComment = insertComment;
module.exports.updateComment = updateComment;
module.exports.deleteComment = deleteComment;