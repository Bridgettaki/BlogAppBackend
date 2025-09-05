const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "./posts.json";

function readPosts() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writePosts(posts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
}

app.get("/posts", (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

app.get("/posts/:id", (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});


app.post("/posts", (req, res) => {
  const posts = readPosts();
  const newPost = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  posts.push(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});

app.put("/posts/:id", (req, res) => {
  const posts = readPosts();
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts[index] = { ...posts[index], ...req.body };
  writePosts(posts);
  res.json(posts[index]);
});

app.delete("/posts/:id", (req, res) => {
  let posts = readPosts();
  posts = posts.filter(p => p.id !== parseInt(req.params.id));
  writePosts(posts);
  res.json({ message: "Post deleted" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));