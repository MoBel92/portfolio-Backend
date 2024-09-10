const db = require("../db/connection");
const format = require("pg-format");

// Delete a comment by its ID
const removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows[0];
    });
};

// Update a comment by its ID
const updateCommentById = (comment_id, updatedFields) => {
  const { body, votes } = updatedFields;
  const queryValues = [];
  let queryString = "UPDATE comments SET";

  if (body) {
    queryValues.push(body);
    queryString += ` body = $${queryValues.length},`;
  }

  if (votes !== undefined) {
    queryValues.push(votes);
    queryString += ` votes = $${queryValues.length},`;
  }

  // Remove trailing comma and add WHERE clause
  queryString = queryString.slice(0, -1);
  queryString += ` WHERE comment_id = $${queryValues.length + 1} RETURNING *;`;
  queryValues.push(comment_id);

  return db.query(queryString, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Comment not found" });
    }
    return rows[0];
  });
};

module.exports = { removeCommentById, updateCommentById };
