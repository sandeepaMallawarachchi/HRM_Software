import React, { useState, useEffect, useRef } from 'react';
import { FaEnvelope, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Messages from './Messages';

const MessageIcon = () => {
    const [showPopUp, setShowPopUp] = useState(false);
    const [messagesCount, setMessagesCount] = useState(0);
    const empId = localStorage.getItem('empId');
    const popUpRef = useRef(null);

    const fetchMessageCount = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/admin/getMember/${empId}`);
            const unreadCount = response.data.filter((msg) => msg.read !== 'read').length;
            setMessagesCount(unreadCount);
        } catch (error) {
            console.log("Error fetching message count:", error);
        }
    };

    const togglePopUp = () => {
        setShowPopUp(!showPopUp);
    };

    const closePopUp = () => {
        setShowPopUp(false);
    };

    const handleMessageRead = () => {
        setMessagesCount((prevCount) => Math.max(prevCount - 1, 0));
    };

    useEffect(() => {
        fetchMessageCount();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popUpRef.current && !popUpRef.current.contains(event.target)) {
                setShowPopUp(false);
            }
        };

        if (showPopUp) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopUp]);

    return (
        <div className="relative">
            <FaEnvelope
                className="text-white cursor-pointer hover:text-orange-200"
                size={20}
                onClick={togglePopUp}
            />
            {messagesCount > 0 && (
                <div className="absolute -top-2 left-2 bg-red-600 text-white text-xs rounded-full w-5 px-1 py-0.5 text-center">
                    {messagesCount}
                </div>
            )}
            {showPopUp && (
                <div ref={popUpRef} className="absolute right-0 mt-2 bg-white shadow-lg p-4 rounded-lg w-80 text-center">
                    <div className="flex justify-end">
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={closePopUp}
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                    <Messages onMessageRead={handleMessageRead} />
                    <Link className="text-gray-600 hover:underline" to={'/communication'}>
                        All Messages
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MessageIcon;