const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
require("dotenv").config();

const homeStartingContent = `Understanding Asynchronous Programming 🔄:

  In the realm of web development, asynchronous programming is the key to handling operations that may take time, such as fetching data from a server or reading a file. Traditional synchronous code executes line by line, but with asynchronous code, we can initiate tasks and continue with other operations while waiting for the results.

  **Callbacks: The Old Guard ⏳**
  Callbacks were the initial approach to handle asynchronous operations. Functions were passed as arguments to other functions, ensuring that a particular task would execute upon completion of the asynchronous operation. While effective, callback hell (nested callbacks) became a notorious issue, making code difficult to read and maintain.
`;
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(`${process.env.MONGODB_ATLAS_URL}`);
}

const postSchema = new mongoose.Schema({
  postTitle: String,
  postBody: String,
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find()
    .then((result) => {
      res.render("home", { home: homeStartingContent, posts: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const posts = new Post({
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
  });

  posts.save();
  res.redirect("/");
});

app.get("/posts/:userId", (req, res) => {
  Post.find().then((result) => {
    result.forEach((element) => {
      let userId = _.lowerCase(req.params.userId);
      let requestedTitle = _.lowerCase(element.postTitle);
      if (requestedTitle === userId) {
        res.render("post", {
          postTitle: element.postTitle,
          postBody: element.postBody,
        });
      }
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", { about: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contact: contactContent });
});

app.listen(3001, function () {
  console.log("Server started on port 3001");
});
