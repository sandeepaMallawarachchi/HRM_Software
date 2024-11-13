import React, { useState } from "react";
import { FaPaperPlane, FaFileUpload, FaUserCircle } from "react-icons/fa";

// Sample data for users
const teamMembers = [
  { id: 1, name: "John Doe", role: "Team Leader" },
  { id: 2, name: "Jane Smith", role: "Member" },
  { id: 3, name: "Alice Johnson", role: "Member" },
  // Add more members if necessary
];

const Communication = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [selectedUser, setSelectedUser] = useState(teamMembers[0].name); // Default selected user

  const handleSendMessage = () => {
    if (message.trim() || file) {
      const newMessage = {
        sender: selectedUser,
        content: message,
        file,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="m-5 p-6 px-20 bg-white shadow-lg rounded-lg h-full flex flex-col justify-between">
      <h1 className="text-2xl font-semibold mb-4">Team Group Chat</h1>

      {/* Message Display Section */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.sender === selectedUser ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FaUserCircle className="text-gray-400" size={20} />
                <span className="font-bold">{msg.sender}</span>
                <span className="text-xs text-gray-500">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                <p>{msg.content}</p>
                {msg.file && (
                  <a
                    href={URL.createObjectURL(msg.file)}
                    download={msg.file.name}
                    className="text-blue-500 underline"
                  >
                    {msg.file.name}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="flex items-center space-x-2">
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="file"
          className="bg-gray-200 p-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-gray-300"
        >
          <FaFileUpload />
          <span>Upload File</span>
        </label>

        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded-lg px-4 py-2 "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={handleSendMessage}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
        >
          <FaPaperPlane />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

export default Communication;
