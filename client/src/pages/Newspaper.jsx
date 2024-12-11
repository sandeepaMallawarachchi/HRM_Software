import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PostForm from "./TopLvlManagerPages/PostToFeed";
import CommentSection from "./CommentSection";
import LoadingSpinner from "./LoadingSpinner";
import StickyCard from "./StickyCard";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editedFields, setEditedFields] = useState({
    title: "",
    content: "",
    attachment: "",
  });

  const dropdownRef = useRef(null); // Ref for dropdown

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActivePostId(null); // Close dropdown when clicking outside
    }
  };

  // Fetch the posts' created_at values
  const fetchCreatedAt = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/posts/created_at"
      );
      setPosts(response.data); // Set the posts data
      setLoading(false);
    } catch (err) {
      console.error("Error fetching created_at values:", err);
      setError("Failed to load posts");
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/news/posts");
      const postsWithLikes = response.data.map((post) => {
        const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
        return {
          ...post,
          liked: likedPosts.includes(post.id), // Check if the post is liked from localStorage
        };
      });
      setPosts(postsWithLikes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
    const role = localStorage.getItem("role");
    setUserRole(role);

    document.addEventListener("mousedown", handleClickOutside); // Add event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, []);

  const likePost = async (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            liked: !post.liked, // Toggle liked state
            likes: post.liked ? post.likes - 1 : post.likes + 1, // Increment or decrement likes based on current state
          }
        : post
    );

    setPosts(updatedPosts); // Update state with the new like status

    try {
      // Update localStorage to reflect the liked posts
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
      if (updatedPosts.find((post) => post.id === postId).liked) {
        likedPosts.push(postId);
      } else {
        const index = likedPosts.indexOf(postId);
        if (index !== -1) likedPosts.splice(index, 1);
      }
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts)); // Save to localStorage

      // Send the like/unlike request to the server
      if (updatedPosts.find((post) => post.id === postId).liked) {
        await axios.post(`http://localhost:4000/news/posts/${postId}/like`);
      } else {
        await axios.post(`http://localhost:4000/news/posts/${postId}/unlike`);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
    setShowPostForm(false);
  };

  const editPost = (post) => {
    setEditingPost(post);
    setEditedFields({
      title: post.title || "",
      content: post.content || "",
      attachment: post.attachment || "",
    });
  };

  const updatePost = async () => {
    if (!editingPost) return;

    try {
      const formData = new FormData();
      formData.append("title", editedFields.title);
      formData.append("content", editedFields.content);
      if (editedFields.attachment instanceof File) {
        formData.append("attachment", editedFields.attachment);
      }

      await axios.put(
        `http://localhost:4000/news/posts/${editingPost.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchPosts();
      setEditingPost(null);
      setEditedFields({
        title: "",
        content: "",
        attachment: "",
      });
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:4000/news/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex justify-start w-full">
      <div className="flex-1 max-w-3xl px-4">
        {["Top Lvl Manager", "Ceo"].includes(userRole) && (
          <div className="mb-6">
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-blue-400"
            >
              {showPostForm ? "Cancel" : "Create Post"}
            </button>
          </div>
        )}

        {showPostForm && <PostForm onPostCreated={handlePostCreated} />}

        {posts.map((post) =>
          editingPost?.id === post.id ? (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200 w-full hover:shadow-2xl transition-all duration-300"
            >
              <input
                type="text"
                value={editedFields.title}
                onChange={(e) =>
                  setEditedFields({ ...editedFields, title: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded-lg"
                placeholder="Edit title"
              />
              <textarea
                value={editedFields.content}
                onChange={(e) =>
                  setEditedFields({ ...editedFields, content: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded-lg"
                placeholder="Edit content"
              />
              <input
                type="file"
                onChange={(e) =>
                  setEditedFields({
                    ...editedFields,
                    attachment: e.target.files[0],
                  })
                }
                className="w-full mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditingPost(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePost}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200 w-full hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-4 relative">
                <button
                  onClick={() =>
                    setActivePostId(post.id === activePostId ? null : post.id)
                  }
                  className="text-gray-500 hover:text-gray-700 absolute top-0 right-0 mt-2 mr-2"
                >
                  ⋯
                </button>

                {activePostId === post.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40 py-2 border border-gray-200"
                  >
                    <button
                      onClick={() => editPost(post)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="block px-4 py-2 text-red-500 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {post.title}
              </h2>
              <p className="text-gray-700 mb-4">{post.content}</p>

              {post.attachment && (
                <div className="mt-4 flex items-start">
                  {post.attachment.endsWith(".mp4") ||
                  post.attachment.endsWith(".webm") ? (
                    <video
                      controls
                      className="w-full max-w-[500px] max-h-[500px] object-contain rounded-lg"
                    >
                      <source src={post.attachment} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : post.attachment.match(/\.(jpeg|jpg|gif|png)$/) ? (
                    <img
                      src={post.attachment}
                      alt="Post Attachment"
                      className="max-w-[500px] max-h-[500px] object-contain rounded-lg"
                    />
                  ) : (
                    <iframe
                      src={post.attachment}
                      title="Attachment"
                      className="w-full h-96 rounded-lg"
                    />
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-4 items-center">
                  <button onClick={() => likePost(post.id)}>
                    {post.liked ? (
                      <span className="text-red-500">❤️</span>
                    ) : (
                      <span>♡</span>
                    )}
                    {post.likes} Likes
                  </button>

                  <CommentSection postId={post.id} showAllComments={false} />
                  <button
                    onClick={() => {
                      setPosts((prevPosts) =>
                        prevPosts.map((p) =>
                          p.id === post.id
                            ? { ...p, showAllComments: !p.showAllComments }
                            : p
                        )
                      );
                    }}
                    className="text-gray-500 font-semibold hover:text-gray-600 transition-all duration-200"
                  ></button>
                </div>
                <li key={post.id} className="mb-2">
                  ,&nbsp;
                  <span className="font-semibold"></span>{" "}
                  {new Date(post.created_at).toLocaleString()}
                </li>
              </div>
            </div>
          )
        )}
      </div>
      <div>
        {/* This is where you can render the StickyCard component */}
        <StickyCard />
      </div>
    </div>
  );
};

export default PostList;
