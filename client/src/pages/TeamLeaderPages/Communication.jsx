import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaFileUpload, FaFileAlt, FaUserCircle, FaTrash } from "react-icons/fa";
import ProfilePicture from "../../components/subComponents/ProfilePicture";
import { db } from "../../firebase";
import { ref, set, push, onValue, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import ChatMembersModel from "./ChatMembersModel";
import axios from "axios";

const Communication = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isChatMembersModalOpen, setIsChatMembersModalOpen] = useState(false);

  useEffect(() => {
    const empId = localStorage.getItem("empId");
    if (empId) {
      fetch(`http://localhost:4000/employees/getEmployee/${empId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.empId && data.role) {
            setSelectedUser(data.empId);
            setRole(data.role);
          }
        });
    }
  }, []);

  useEffect(() => {
    const chatsRef = ref(db, "chats/");
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedChats = Object.entries(data)
          .map(([key, value]) => ({
            chatId: key,
            timestamp: value.timestamp || Date.now(),
            participants: value.members || [],
          }))
          .filter(chat => chat.participants.includes(selectedUser))
        loadedChats.reverse();
        setChats(loadedChats);
        if (loadedChats.length > 0 && !currentChatId) {
          setCurrentChatId(loadedChats[0].chatId);
        }
      }
    });
    return () => unsubscribe();
  }, [currentChatId, selectedUser]);

  useEffect(() => {
    if (currentChatId) {
      const messagesRef = ref(db, `chats/${currentChatId}/messages/`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedMessages = Object.values(data);
          setMessages(loadedMessages);
        } else {
          setMessages([]);
        }
      });
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  }, [currentChatId]);


  const handleSendMessage = async () => {
    if (message.trim() || file) {
      if (file && file.size > 5 * 1024 * 1024) {
        return;
      }

      const storage = getStorage();
      let uploadedFileURL = null;
      let uploadedFileName = null;

      if (file) {
        const fileRef = storageRef(storage, `uploads/${file.name}`);
        const uploadResult = await uploadBytes(fileRef, file);
        uploadedFileURL = await getDownloadURL(uploadResult.ref);
        uploadedFileName = file.name;
      }

      const newMessage = {
        sender: selectedUser,
        role,
        content: message,
        fileURL: uploadedFileURL,
        fileName: uploadedFileName,
        timestamp: Date.now(),
      };

      try {
        const messagesRef = ref(db, `chats/${currentChatId}/messages/`);
        const newMessageRef = push(messagesRef);
        await set(newMessageRef, newMessage);
        setMessages([...messages, { ...newMessage, messageId: newMessageRef.key }]);
        setMessage("");
        setFile(null);
        setFileName("");
      } catch (e) {
        console.error("Error sending message:", e);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleNewChat = () => {
    setIsChatMembersModalOpen(true);
  };

  const handleModalClose = () => {
    setIsChatMembersModalOpen(false);
  };

  const handleCreateChatWithMembers = async (members) => {
    const newChatRef = push(ref(db, "chats/"));
    const newChat = {
      participants: [selectedUser, ...members],
      timestamp: Date.now(),
    };
    await set(newChatRef, newChat);
    setCurrentChatId(newChatRef.key);
    setMessages([]);
    setIsChatMembersModalOpen(false);
  };

  const handleDelete = async (chatId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");

    if (confirmDelete) {
      try {
        const chatRef = ref(db, `chats/${chatId}`);
        await remove(chatRef);
        await axios.delete(`http://localhost:4000/admin/deleteChat/${chatId}`);
      } catch (error) {
        console.error("Error deleting chat: ", error);
        alert("Error deleting chat");
      }
    }
  };

  return (
    <div className="p-6 px-20 bg-white rounded-lg shadow-md flex m-5 mb-0 pb-8 h-full">
      <div className="w-1/4 p-4 border-r-2">
        <h1 className="text-2xl font-semibold mb-4">Team Group Chat</h1>
        <button
          onClick={handleNewChat}
          disabled={role === "Employee"}
          className={`w-full ${role === "Employee" ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"} text-white p-2 rounded-lg mb-4`}
        >
          New Chat
        </button>
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => setCurrentChatId(chat.chatId)}
              className={`flex justify-between cursor-pointer p-2 px-3 rounded-lg hover:bg-gray-300 ${currentChatId === chat.chatId ? "bg-gray-300" : "bg-gray-100"
                }`}
            >
              <span>
                {chat.chatId}
              </span>
              <button onClick={() => handleDelete(chat.chatId)} >
                <FaTrash className="text-orange-500 my-auto" size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="flex-1 overflow-y-auto h-full" style={{ maxHeight: "calc(100vh - 200px)" }}>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.sender === selectedUser ? "items-end" : "items-start"}`}>
                <div className="flex items-center space-x-2 mx-2">
                  <div className="bg-gray-300 rounded-full w-10">
                    {msg.sender === selectedUser ? (
                      <ProfilePicture />
                    ) : (
                      <FaUserCircle className="text-gray-400 w-full h-full" />
                    )}
                  </div>
                  <span className="font-bold">{msg.role}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg shadow-sm my-3 mx-2">
                  <p>{msg.content}</p>
                  {msg.fileURL && (
                    <a href={msg.fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 flex items-center gap-2">
                      <FaFileAlt />
                      <span>{msg.fileName}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input type="file" id="file" onChange={handleFileChange} className="hidden" />
          <label htmlFor="file" className="bg-gray-200 p-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-gray-300">
            <FaFileUpload />
            <span>{fileName || "Upload File"}</span>
          </label>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2"
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
      {isChatMembersModalOpen && (
        <ChatMembersModel
          onClose={handleModalClose}
          onSave={handleCreateChatWithMembers}
        />
      )}
    </div>
  );
};

export default Communication;