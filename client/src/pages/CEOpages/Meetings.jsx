import React, { useState, useEffect } from "react";
import {
  FaPaperPlane,
  FaFileUpload,
  FaFileAlt,
  FaUserCircle,
  FaTrash,
} from "react-icons/fa";
import ProfilePicture from "../../components/subComponents/ProfilePicture";
import { db } from "../../firebase";
import { ref, set, push, onValue, remove } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import MeetingssModel from "./MeetingssModel.jsx";
import axios from "axios";

const Communication = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [meetingMembers, setMeetingMembers] = useState([]);
  const [currentMeetingId, setCurrentMeetingId] = useState(null);
  const [isMeetingssModelOpen, setIsMeetingssModelOpen] = useState(false);

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
    const meetingsRef = ref(db, "meetings/");
    const unsubscribe = onValue(meetingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMeetings = Object.entries(data)
          .map(([key, value]) => ({
            meetingId: key,
            timestamp: value.timestamp || Date.now(),
            participants: value.members || [],
          }))
          .filter((meeting) => {
            return meeting.participants.includes(selectedUser);
          })
          .sort((a, b) => b.timestamp - a.timestamp);
        setMeetings(loadedMeetings);
        if (loadedMeetings.length > 0 && !currentMeetingId) {
          setCurrentMeetingId(loadedMeetings[0].meetingId);
        }
      }
    });
    return () => unsubscribe();
  }, [currentMeetingId, selectedUser]);

  useEffect(() => {
    if (currentMeetingId) {
      const messagesRef = ref(db, `meetings/${currentMeetingId}/messages/`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedMessages = Object.values(data);
          setMessages(loadedMessages);
        } else {
          setMessages([]);
        }
      });

      const fetchMeetingMembers = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/admin/getAllMMembers/${currentMeetingId}`
          );
          setMeetingMembers(response.data);
        } catch (error) {
          console.error("Error fetching meeting members:", error);
        }
      };

      fetchMeetingMembers();
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  }, [currentMeetingId]);

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
        const messagesRef = ref(db, `meetings/${currentMeetingId}/messages/`);
        const newMessageRef = push(messagesRef);
        await set(newMessageRef, newMessage);
        setMessages([
          ...messages,
          { ...newMessage, messageId: newMessageRef.key },
        ]);
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

  const handleNewMeeting = () => {
    setIsMeetingssModelOpen(true);
  };

  const handleModalClose = () => {
    setIsMeetingssModelOpen(false);
  };

  const handleCreateMeetingWithMembers = async (members) => {
    const newMeetingRef = push(ref(db, "meeting/"));
    const newMeeting = {
      participants: [selectedUser, ...members],
      timestamp: Date.now(),
    };
    await set(newMeetingRef, newMeeting);
    setCurrentMeetingId(newMeetingRef.key);
    setMessages([]);
    setIsMeetingssModelOpen(false);
  };

  const handleDelete = async (meetingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this meeting?"
    );

    if (confirmDelete) {
      try {
        const meetingRef = ref(db, `meetings/${meetingId}`);
        await remove(meetingRef);
        await axios.delete(
          `http://localhost:4000/admin/deleteMeeting/${meetingId}`
        );
      } catch (error) {
        console.error("Error removing meeting: ", error);
        alert("Error removing meeting");
      }
    }
  };

  return (
    <div className="p-6 px-20 bg-white rounded-lg shadow-md flex m-5 mb-0 pb-8 h-full">
      <div className="w-1/4 p-4 border-r-2">
        <h1 className="text-2xl font-semibold mb-4">Meetings</h1>
        <button
          onClick={handleNewMeeting}
          disabled={role === "Employee"}
          className={`w-full ${
            role === "Employee"
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          } text-white p-2 rounded-lg mb-4`}
        >
          New Meeting
        </button>
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.meetingId}
              onClick={() => setCurrentMeetingId(meeting.meetingId)}
              className={`flex justify-between cursor-pointer p-2 px-3 rounded-lg hover:bg-gray-300 ${
                currentMeetingId === meeting.meetingId
                  ? "bg-gray-300"
                  : "bg-gray-100"
              }`}
            >
              <span>{meeting.meetingId}</span>
              <button onClick={() => handleDelete(meeting.meetingId)}>
                <FaTrash
                  className={`my-auto ${
                    role === "Employee"
                      ? "hidden"
                      : "text-orange-500 hover:text-orange-600"
                  }`}
                  size={16}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6">
        <div
          className="flex-1 overflow-y-auto h-full"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div className="flex justify-between mb-4">
            <select
              defaultValue=""
              className="border rounded-lg px-4 py-2 w-1/3"
            >
              <option value="">Meeting Members</option>
              {[...new Set(meetingMembers)]
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name
                .map(({ empId, name }) => (
                  <option key={empId} value={empId}>
                    {name} ({empId})
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === selectedUser ? "items-end" : "items-start"
                }`}
              >
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
                    <a
                      href={msg.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 flex items-center gap-2"
                    >
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
      {isMeetingssModelOpen && (
        <MeetingssModel
          onClose={handleModalClose}
          onSave={handleCreateMeetingWithMembers}
        />
      )}
    </div>
  );
};

export default Communication;
