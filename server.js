import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
let blogs = [];
let nextId = 1;

app.post("/blogs", (req, res) => {
  const { title, content, date } = req.body;
  const newBlog = { id: nextId++, title, content, date };
  blogs.push(newBlog);
  res.status(201).json(newBlog);
});

app.get("/blogs", (req, res) => {
  res.json(blogs);
});

app.get("/blogs/:id", (req, res) => {
  const blog = blogs.find((b) => b.id == req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
});

app.put("/blogs/:id", (req, res) => {
  const blog = blogs.find((b) => b.id == req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  blog.title = req.body.title || blog.title;
  blog.content = req.body.content || blog.content;
  blog.date = req.body.date || blog.date;

  res.json(blog);
});

app.delete("/blogs/:id", (req, res) => {
  blogs = blogs.filter((b) => b.id != req.params.id);
  res.json({ message: "Blog deleted" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
