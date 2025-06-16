import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [userRole, setUserRole] = useState("");

  // Allowed roles for post creation
  const allowedRoles = ["Top Lvl Manager", "Ceo"];

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
    if (file) {
      const fileType = file.type.split("/")[0];
      if (fileType === "image" || fileType === "video") {
        setAttachmentPreview(URL.createObjectURL(file));
      } else {
        toast.error("Only images and videos are supported.");
        setAttachment(null);
        setAttachmentPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allowedRoles.includes(userRole)) {
      toast.error("You are not authorized to create posts.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("attachment", attachment);
    formData.append("userRole", userRole);

    try {
      await axios.post("https://global-hrm-mobile-server.vercel.app/news/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post created successfully!");
      setTitle("");
      setContent("");
      setAttachment(null);
      setAttachmentPreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post.");
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-lg font-bold mb-4">Create a New Post</h2>
      {allowedRoles.includes(userRole) ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {/* Content Input */}
          <textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded resize-none"
            rows="4"
            required
          ></textarea>

          {/* Attachment Preview */}
          {attachmentPreview && (
            <div className="relative max-h-[400px] overflow-auto border border-gray-200 rounded mb-2">
              {attachment.type.startsWith("image/") ? (
                <img
                  src={attachmentPreview}
                  alt="Attachment Preview"
                  className="w-full h-auto max-h-[400px] object-contain rounded"
                />
              ) : (
                <video
                  src={attachmentPreview}
                  controls
                  className="w-full h-auto max-h-[400px] object-contain rounded"
                ></video>
              )}
              <button
                type="button"
                onClick={() => {
                  setAttachment(null);
                  setAttachmentPreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* File Input */}
          <div className="flex items-center justify-between">
            <label className="cursor-pointer text-blue-500">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              📎 Attach
            </label>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Share
            </button>
          </div>
        </form>
      ) : (
        <p className="text-red-500">You are not authorized to create posts.</p>
      )}
    </div>
  );
};

export default PostForm;
