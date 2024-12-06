const express = require("express");
const router = express.Router();
const multer = require("multer");
const { initializeApp, getApps, getApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");
const pool = require("../database"); // Import MySQL connection pool
const firebaseConfig = require("../config/firebase.config");

// Initialize Firebase App if not already initialized
const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
const storage = getStorage(firebaseApp);

// Multer middleware for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Utility: Get current timestamp
const giveCurrentDateTime = () =>
  new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");

// Upload file to Firebase
const uploadToFirebase = async (file) => {
  if (!file) throw new Error("No file uploaded");

  try {
    const dateTime = giveCurrentDateTime();
    const storageRef = ref(
      storage,
      `attachments/${file.originalname} ${dateTime}`
    );
    const metadata = { contentType: file.mimetype };

    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase:", error);
    throw new Error("Failed to upload file to Firebase");
  }
};

// Add new post (Managers only)
router.post("/posts", upload.single("attachment"), async (req, res) => {
  const { title, content, userRole } = req.body;

  if (userRole !== "manager") {
    return res.status(403).json({ error: "Only managers can create posts." });
  }

  try {
    const attachmentUrl = req.file ? await uploadToFirebase(req.file) : null;

    const query = `
      INSERT INTO posts (title, content, attachment, created_at)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      title,
      content,
      attachmentUrl,
      giveCurrentDateTime(),
    ]);

    res.status(201).json({
      message: "Post created successfully.",
      postId: result.insertId,
      attachmentUrl,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
});

// Get all posts
router.get("/posts", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

// Like a post
router.post("/posts/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      UPDATE posts SET likes = likes + 1 WHERE id = ?
    `;
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ message: "Post liked successfully." });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Failed to like post." });
  }
});

// Get all likes for each post
router.get("/posts/likes", async (req, res) => {
  try {
    // Query to get the likes count for each post
    const query = `
        SELECT id, title, likes FROM posts ORDER BY created_at DESC
      `;
    const [rows] = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No posts found." });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Failed to fetch likes." });
  }
});

// Comment on a post
router.post("/posts/:id/comment", async (req, res) => {
  const { id } = req.params;
  const { comment, user } = req.body;

  try {
    const query = `
      INSERT INTO comments (post_id, user, comment, created_at)
      VALUES (?, ?, ?, ?)
    `;
    await pool.query(query, [id, user, comment, giveCurrentDateTime()]);

    res.status(201).json({ message: "Comment added successfully." });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

// Get all comments for a specific post
router.get("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
        SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC
      `;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this post." });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

// Delete a post (Managers only)
router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the post to get the attachment URL
    const [rows] = await pool.query(
      "SELECT attachment FROM posts WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Post not found." });
    }

    const attachmentUrl = rows[0].attachment;

    // Delete the attachment from Firebase Storage
    if (attachmentUrl) {
      const filePath = attachmentUrl.split("/o/")[1]?.split("?")[0];
      const decodedFilePath = decodeURIComponent(filePath);
      const fileRef = ref(storage, decodedFilePath);
      await deleteObject(fileRef);
    }

    // Delete the post from the database
    const [result] = await pool.query("DELETE FROM posts WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post." });
  }
});

module.exports = router;
