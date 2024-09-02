const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'postbook'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Example route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/getUserInfo', (req, res) => {
    const {userId, password} = req.body;
    const getUserInfoSql = `SELECT user_id, userName, userImage FROM users WHERE users.user_id = ? AND users.userPass=?`

    let query = db.query(getUserInfoSql, [userId, password], (err, result)=>{
        if(err){
            console.log("Error from server: ", err);
            throw err;
        }
        if (result.length === 0) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        res.send(result);
    })
})

app.get("/getAllPosts", (req, res) =>{
    const sqlForAllPosts = `SELECT users.userName AS postedUserName, users.userImage AS postedUserImage, posts.postText, posts.postId, posts.postedTIme, posts.postImageUrl FROM posts INNER JOIN users ON posts.postUserID = users.user_id ORDER BY posts.postedTIme DESC`

    let query = db.query(sqlForAllPosts, (err, result) =>{
        if(err){
            console.log(err);
            throw err;
        }
        else{
            console.log(result);
            res.send(result)
        }
    })
})

app.get("/getAllComments/:postId", (req, res) =>{
    let id = req.params.postId;

    const sqlForAllComments = `SELECT users.userName AS commentedUseName, users.userImage AS commentedUserImage, comments.comments, comments.commentedUserId, comments.commentText, comments.commentText FROM comments INNER JOIN users ON comments.commentedUserId = users.user_id WHERE comments.commentOfPostID = ${id}`

    let query = db.query(sqlForAllComments, (err, result) =>{
        if(err){
            console.log(err);
            throw err;
        }
        else{
            res.send(result)
        }
    })
})


// post comment


app.post("/postComment", (req, res) => {
    const { commentOfPostId, commentedUserId, commentTime, commentText } =
      req.body;
  
    let postCommentSql = `INSERT INTO comments(commentOfPostId, commentedUserId, commentTime, commentText) VALUES (?, ?, ?, ?)`;
  
    let query = db.query(
      postCommentSql,
      [commentOfPostId, commentedUserId, commentTime, commentText],
      (err, result) => {
        if (err) {
          console.log("Error adding comment to the database: ", err);
          throw err;
        }
  
        // console.log(result);
        res.send(result);
      }
    );
  });

  //adding a new post

app.post("/addNewPost", (req, res) => {
    const { postUserID, postedTIme, postText, postImageUrl } = req.body;
  
    const addNewPostsql = `INSERT INTO posts (postUserID, postedTIme, postText, postImageUrl) VALUES (?,?,?,?)`;
  
    let query = db.query(
      addNewPostsql,
      [postUserID, postedTIme, postText, postImageUrl],
      (err, result) => {
        if (err) {
          console.log("Error adding post to the database: ", err);
          throw err;
        }
  
        // console.log(result);
        res.send(result);
      }
    );
  });
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
