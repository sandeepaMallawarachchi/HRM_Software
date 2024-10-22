import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FaCalendar } from 'react-icons/fa'

const Actions = () => {
    const empId = localStorage.getItem('empId');
    const [leaveRequestList, setLeaveRequestList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestResponse = await axios.get(`http://localhost:4000/employees/getLeaveRequest/${empId}`);

                const currentDate = moment().startOf('day');

                const todayRequests = requestResponse.data.filter(request => {
                    const requestCreationDate = moment(request.createdAt).startOf('day');
                    return requestCreationDate.isSame(currentDate);
                });

                setLeaveRequestList(todayRequests);
            } catch (err) {
                console.log("Error fetching data:", err);
            }
        };
        fetchData();
    }, [empId]);

    return (
        <div>
            <Link to='/leave'>
                <div className="text-left bg-gray-100 rounded-xl p-4">
                    {leaveRequestList.length > 0 ? (
                        <ul>
                            {leaveRequestList.map((leave) => (
                                <li key={leave.id} className='flex gap-4'>
                                    <FaCalendar size={20} color='red'/>
                                    Leave Request - {leave.leave_type}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No leave requests created today.</p>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default Actions;