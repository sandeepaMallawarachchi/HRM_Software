import React, { useState, useEffect } from "react";
import axios from "axios";
import PostForm from "./TopLvlManagerPages/PostToFeed"; // Import the PostForm component
import CommentSection from "./CommentSection";
import LoadingSpinner from "./LoadingSpinner";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false); // State to toggle PostForm
  const [userRole, setUserRole] = useState(""); // State to hold the user's role

  // Fetch posts from the server
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/news/posts");
      setPosts(response.data); // Set posts with the fetched data
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  // Effect to fetch posts and user role on component mount
  useEffect(() => {
    fetchPosts();
    const role = localStorage.getItem("role"); // Retrieve user role from localStorage
    setUserRole(role); // Set the user role state
  }, []);

  // Handle post like
  const likePost = async (postId) => {
    try {
      // Sending a POST request to like the post
      await axios.post(`http://localhost:4000/news/posts/${postId}/like`);
      fetchPosts(); // Refresh posts after liking to get updated like count
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Callback for when a new post is created
  const handlePostCreated = () => {
    fetchPosts(); // Refresh posts after creating a new one
    setShowPostForm(false); // Close the PostForm
  };

  // Render loading spinner while posts are being fetched
  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex justify-center w-full">
      <div className="container max-w-screen-lg w-full mt-10">
        {/* Create Post Button - Visible only to Top Lvl Manager or CEO */}
        {["Top Lvl Manager", "Ceo"].includes(userRole) && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-blue-600"
            >
              {showPostForm ? "Cancel" : "Create Post"}
            </button>
          </div>
        )}

        {/* PostForm Component */}
        {showPostForm && <PostForm onPostCreated={handlePostCreated} />}

        {/* List of Posts */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200 w-full hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>{" "}
              {/* Placeholder for user avatar */}
              <div className="font-bold text-lg">Username</div>{" "}
              {/* Username placeholder */}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {post.title}
            </h2>
            <p className="text-gray-700 mb-4">{post.content}</p>

            {/* Render attachment if it exists */}
            {post.attachment && (
              <div className="mt-4">
                <iframe
                  src={post.attachment}
                  title="Attachment"
                  className="w-full h-96 rounded-lg"
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-4 items-center">
                <button
                  onClick={() => likePost(post.id)} // Call likePost when clicked
                  className="text-blue-500 font-semibold hover:text-blue-600 transition-all duration-200"
                >
                  Like ({post.likes}) {/* Display current like count */}
                </button>
                <button className="text-gray-500 font-semibold hover:text-gray-600 transition-all duration-200">
                  Comment
                </button>
              </div>
              <span className="text-sm text-gray-500">5 minutes ago</span>
            </div>

            <CommentSection postId={post.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
