const {
  removeCommentById,
  updateCommentById,
} = require("../model/comments-model");

// Controller function to handle comment deletion
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  commentsModel
    .removeCommentById(comment_id)
    .then((deletedComment) => {
      res.status(204).send(); // No content response
    })
    .catch(next);
};

// Controller function to handle comment update
exports.updateComment = (req, res, next) => {
  const { comment_id } = req.params;
  const updatedFields = req.body;
  commentsModel
    .updateCommentById(comment_id, updatedFields)
    .then((updatedComment) => {
      res.status(200).json({ comment: updatedComment });
    })
    .catch(next);
};
