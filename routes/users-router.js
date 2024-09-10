const express = require("express");
const usersRouter = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/users-controller");

// Define routes and attach handlers
usersRouter
  .route("/") // Handle GET and POST requests for /api/users
  .get(getUsers)
  .post(createUser);

usersRouter
  .route("/:user_id") // Handle GET, PATCH, and DELETE requests for /api/users/:user_id
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = usersRouter;
