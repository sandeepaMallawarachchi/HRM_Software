import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers } from 'react-icons/fa';

const Messages = ({ onMessageRead }) => {
    const empId = localStorage.getItem('empId');
    const [groupMessages, setGroupMessages] = useState([]);

    const fetchMessages = async () => {
        try {
            const groupResponse = await axios.get(`http://localhost:4000/admin/getMember/${empId}`);
            setGroupMessages(groupResponse.data);
        } catch (error) {
            console.log("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

    const markAsRead = async (id, chatId) => {
        try {
            await axios.put(`http://localhost:4000/admin/markAsRead/${empId}/${chatId}`, { read: 'read' });
            setGroupMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === id ? { ...msg, read: 'read' } : msg
                )
            );
            onMessageRead(); 
        } catch (error) {
            console.log("Error updating message status:", error);
        }
    };

    return (
        <div>
            {groupMessages.length > 0 && (
                <div>
                    {groupMessages.slice(0, 5).map((chat) => (
                        <div
                            key={chat.id}
                            className={`flex gap-4 my-2 p-4 rounded-xl ${chat.read === 'read' ? 'bg-gray-100' : 'bg-green-200'}`}
                        >
                            <FaUsers size={20} color="blue" />
                            <span>Group chat - {formatDate(chat.created_at)}</span>
                            <input
                                type="checkbox"
                                className="m-auto"
                                onChange={() => markAsRead(chat.id, chat.chatId)}
                                checked={chat.read === 'read'}
                            />
                        </div>
                    ))}
                </div>
            )}

            {groupMessages.length === 0 && (
                <div className="text-sm text-gray-500 mt-4">
                    No messages available.
                </div>
            )}
        </div>
    );
};

export default Messages;