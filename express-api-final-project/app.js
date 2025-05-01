let express = require('express')
let cors = require('cors')
let app = express()
const Sequelize = require('sequelize');

// instantiate the library for use, connecting to the sqlite database file
let sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'posts.sqlite'
})

// If port is set in environment variable use that port
// if not, use port 5000
const PORT = process.env.PORT || 5000

// Enable CORS middleware
app.use(cors());
// Enable receiving data in JSON format
app.use(express.json());
// Enable receiving data from HTML forms
app.use(express.urlencoded({ extended: false }));

// Start: Change only below this line

const Post = sequelize.import("./models/posts.js");

// Used for testing in Postman
// http://localhost:5000/posts

// View all posts
// Happy Path: returns all posts in an array in JSON format (Status 200)
// Sad Path: None
app.get("/posts", function(req, res){
    Post.findAll().then(function(Posts){
        res.status(200);
        res.json(Posts);
        // console.log(JSON.stringify(Posts, null, 3));
    });
});

// Used for testing in Postman
// Example for creating a post in Postman (Make sure Json format is applied):
/*
{
    "title": "Test1",
    "url": "http://testing.com/1"
}
*/

// Create a post
// Happy Path: creates the post item (Status 201 - returns copy of created post)
// Sad Path: none
app.post("/posts", function(req, res){
    let title = req.body.title; 
    let url = req.body.url;
    // let points = 0;

    let NewPost = Post.build({
        // id: Gets Assigned Already (Could be modified???)
        title: req.body.title,
        url: req.body.url,
        points: 0
    });

    if(title != null && title != "" && url != null && url != "")
    {
        NewPost.save().then(function(savedPost){
            res.status(201);
            res.json(savedPost);
        })
        .catch(function(){
            res.status(422);
            res.json();             // {message: "Post could not be saved"}
        });
    }
    else
    {
        res.status(422);
        res.json();                 // {message: "Post is missing info"}
    }
});

// Upvote a post
// Happy Path: upvote a post (Status 204 - empty JSON)
// Sad Path: post does not exist (Status 404 - empty JSON)
app.patch("/posts/:id/upvote", function(req, res){
    Post.findByPk(req.params.id).then(function(Posts){
        if(Posts != null){

            Posts.points += 1;

            Posts.save().then(function(){
                res.status(204);
                res.json();          // {message: "Post upvoted"}    // JSON.stringify(employees, null, 7)
            })  
            .catch(function(){
                res.status(404);
                res.json();             // {message: "Post could not upvote"}
            });
        }
        else
        {
            res.status(404);
            res.json();                 // {message: "Post does not exist"}
        }
    });
});

// Downvote a post
// Happy Path: downvote a post (Status 204 - empty JSON)
// Sad Path: post does not exist (Status 404 - empty JSON)
app.patch("/posts/:id/downvote", function(req, res){
    Post.findByPk(req.params.id).then(function(Posts){
        if(Posts != null){

            if(Posts.points > 0)
            {
                Posts.points -= 1;
            }

            Posts.save().then(function(){
                res.status(204);
                res.json();          // {message: "Post downvoted"}    // JSON.stringify(employees, null, 7)
            })  
            .catch(function(){
                res.status(404);
                res.json();         // {message: "Post could not downvote"}
            });
        }
        else
        {
            res.status(404);
            res.json();             // {message: "Post does not exist"}
        }
    });
});

// STOP: Don't change anything below this line

app.listen(PORT, function () {
    console.log("Server started...")
});