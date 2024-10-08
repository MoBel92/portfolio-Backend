const apiRouter = require("express").Router();

const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");

const { getEndpoints } = require("../controller/endpoints");

apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
