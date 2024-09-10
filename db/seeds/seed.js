const format = require("pg-format");
const db = require("../connection");
const { createRef, formatComments } = require("./utils");

const seed = ({ userData, projectData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS projects;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      const usersTablePromise = db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR
      );`);

      const projectsTablePromise = db.query(`
      CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        description TEXT,
        backhost_url VARCHAR,
        backend_readme_url VARCHAR,
        fronthost_url VARCHAR,
        front_readme_url VARCHAR,
        creator VARCHAR REFERENCES users(username),  -- Optional field for creator
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );`);

      return Promise.all([usersTablePromise, projectsTablePromise]);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        project_id INTEGER REFERENCES projects(id) NOT NULL,
        author VARCHAR REFERENCES users(username) NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );`);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (username, name, avatar_url) VALUES %L;",
        userData.map(({ username, name, avatar_url }) => [
          username,
          name,
          avatar_url,
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);

      return Promise.all([usersPromise]);
    })
    .then(() => {
      const insertProjectsQueryStr = format(
        "INSERT INTO projects (title, description, backhost_url, backend_readme_url, fronthost_url, front_readme_url, creator) VALUES %L RETURNING *;",
        projectData.map(
          ({
            title,
            description,
            backhost_url,
            backend_readme_url,
            fronthost_url,
            front_readme_url,
            creator,
          }) => [
            title,
            description,
            backhost_url,
            backend_readme_url,
            fronthost_url,
            front_readme_url,
            creator, // Optional creator reference
          ]
        )
      );

      return db.query(insertProjectsQueryStr);
    })
    .then(({ rows: projectRows }) => {
      const projectIdLookup = createRef(projectRows, "title", "id");
      const formattedCommentData = formatComments(commentData, projectIdLookup);

      const insertCommentsQueryStr = format(
        "INSERT INTO comments (body, author, project_id, votes, created_at) VALUES %L;",
        formattedCommentData.map(
          ({ body, author, project_id, votes = 0, created_at }) => [
            body,
            author,
            project_id,
            votes,
            created_at,
          ]
        )
      );
      return db.query(insertCommentsQueryStr);
    });
};

module.exports = seed;
