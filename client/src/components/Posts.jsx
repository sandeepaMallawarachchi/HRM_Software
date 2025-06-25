import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../pages/LoadingSpinner";
import { FaRegHeart, FaHeart, FaComment } from "react-icons/fa";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://global-hrm-mobile-server.vercel.app/news/posts");
      const sortedPosts = response.data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map((post) => {
          const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
          return {
            ...post,
            liked: likedPosts.includes(post.id),
          };
        });
      setPosts(sortedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex justify-center w-full">
      <div className="flex-1 max-w-3xl px-4 w-full">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200 w-full hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{post.title}</h2>
            <p className="text-gray-700 mb-4">{post.content}</p>
            {post.attachment && (
              <div className="mt-4 flex items-start">
                {post.attachment.endsWith(".mp4") || post.attachment.endsWith(".webm") ? (
                  <video controls className="w-full max-w-[100px] h-auto object-contain rounded-lg">
                    <source src={post.attachment} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : post.attachment.match(/\.(jpeg|jpg|gif|png)$/) ? (
                  <img
                    src={post.attachment}
                    alt="Post Attachment"
                    className="max-w-[100px] h-auto object-contain rounded-lg"
                  />
                ) : (
                  <iframe src={post.attachment} title="Attachment" className="w-full h-96 rounded-lg" />
                )}
              </div>
            )}
            <div className="mt-2 text-sm text-right">{new Date(post.created_at).toLocaleString()}</div>
            <div className="flex gap-5 mt-2">
              <div className="flex items-center gap-2">
                {post.liked ? (
                  <FaHeart className="text-red-600 fill-current" />
                ) : (
                  <FaRegHeart />
                )}
                {post.likes} Likes
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
