import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaFileUpload } from "react-icons/fa";
import ProfilePicture from "../../components/subComponents/ProfilePicture";
import { db } from "../../firebase";
import { ref, set, push, onValue } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const Communication = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const empId = localStorage.getItem("empId");
    if (empId) {
      fetch(`http://localhost:4000/employees/getEmployee/${empId}`)
        .then((response) => response.json())
        .then((data) => {
          setSelectedUser(data.empId);
          setRole(data.role);
        })
        .catch((error) => console.error("Error fetching employee data:", error));
    }
  }, []);

  useEffect(() => {
    const messagesRef = ref(db, "messages/");
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.values(data);
        setMessages(loadedMessages);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() || file) {
      if (file && file.size > 5 * 1024 * 1024) {
        console.log("File is too large. Maximum size allowed is 5MB.");
        return;
      }
      const storage = getStorage();
      let uploadedFileURL = null;
      if (file) {
        const fileRef = storageRef(storage, `uploads/${file.name}`);
        const uploadResult = await uploadBytes(fileRef, file);
        uploadedFileURL = await getDownloadURL(uploadResult.ref);
      }

      const newMessage = {
        sender: selectedUser,
        role,
        content: message,
        fileURL: uploadedFileURL,
        timestamp: Date.now(),
      };

      try {
        const messagesRef = ref(db, "messages/");
        const newMessageRef = push(messagesRef);
        await set(newMessageRef, newMessage);
        setMessages([...messages, newMessage]);
        setMessage("");
        setFile(null);
      } catch (e) {
        console.error("Error sending message:", e);
      }
    } else {
      console.log("Message is empty or no file attached");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="m-5 p-6 px-20 bg-white shadow-lg rounded-lg h-full flex flex-col justify-between">
      <h1 className="text-2xl font-semibold mb-4">Team Group Chat</h1>

      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === selectedUser ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center space-x-2">
                <div className="bg-gray-300 rounded-full w-12">
                  <ProfilePicture />
                </div>
                <span className="font-bold">{msg.sender}</span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                <p>{msg.content}</p>
                {msg.fileURL && (
                  <a
                    href={msg.fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {msg.fileURL.split("/").pop()}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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