import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentSection = ({ postId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState(""); // State to store the current employee's name

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
      <h3 className="font-bold">Comments</h3>
      <div className="mb-2">
        {comments.map((c, index) => (
          <div key={index} className="text-gray-600">
            {c.user}: {c.comment}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={addComment}
        className="bg-blue-500 text-white px-3 py-1 mt-1 rounded"
      >
        Comment
      </button>
    </div>
  );
};

export default CommentSection;
