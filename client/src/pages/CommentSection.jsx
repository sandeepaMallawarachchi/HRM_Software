import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentSection = ({ postId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState(""); // State to store the current employee's name
  const [showAllComments, setShowAllComments] = useState(false); // State to toggle between showing all or latest comment

  useEffect(() => {
    const empId = localStorage.getItem("empId"); // Get the current empId
    if (empId) fetchUserName(empId); // Fetch the name of the employee
    fetchComments(); // Fetch comments
  }, [postId]);

  const fetchUserName = async (empId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/employees/getPersonalDetails/${empId}`
      );
      setUserName(response.data.name || "Unknown User"); // Set the name from the API response
    } catch (error) {
      console.error("Error fetching employee name:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/news/posts/${postId}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addComment = async () => {
    const empId = localStorage.getItem("empId"); // Get the current empId

    if (!empId) {
      console.error("No empId found in localStorage.");
      return;
    }

    try {
      await axios.post(`http://localhost:4000/news/posts/${postId}/comment`, {
        user: userName, // Pass the user's name instead of empId
        comment,
      });
      setComment(""); // Clear the input field
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="mt-2">
      {/* Display latest comment if showAllComments is false */}
      {comments.length > 0 && !showAllComments ? (
        <div className="text-gray-600">
          {comments[comments.length - 1].user}:{" "}
          {comments[comments.length - 1].comment}
        </div>
      ) : (
        // Display all comments if showAllComments is true
        <div className="mb-2">
          {comments.map((c, index) => (
            <div key={index} className="text-gray-600">
              {c.user}: {c.comment}
            </div>
          ))}
        </div>
      )}

      {/* Button to toggle between showing latest comment and all comments */}
      <button
        onClick={() => setShowAllComments(!showAllComments)}
        className="text-blue-500 hover:text-blue-600 font-semibold mt-2"
      >
        {showAllComments ? "Hide Comments" : "Show All Comments"}
      </button>

      {/* Add a new comment */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-1 border rounded"
        />
        <button
          onClick={addComment}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
