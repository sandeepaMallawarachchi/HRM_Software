import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FaCalendar, FaWallet } from 'react-icons/fa';

const Actions = () => {
    const empId = localStorage.getItem('empId');
    const [leaveRequestList, setLeaveRequestList] = useState([]);
    const [financialRequestList, setFinancialRequestList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestLeave = await axios.get(`http://localhost:4000/employees/getLeaveRequest/${empId}`);
                const requestFinancial = await axios.get(`http://localhost:4000/employees/getFinancialRequests/${empId}`);

                const currentDate = moment().startOf('day');

                const todayLeaves = requestLeave.data.filter(request => {
                    return moment(request.createdAt).isSame(currentDate, 'day');
                });

                const todayFinancials = requestFinancial.data.filter(request => {
                    return moment(request.created_at).isSame(currentDate, 'day');
                });

                setLeaveRequestList(todayLeaves);
                setFinancialRequestList(todayFinancials);
            } catch (err) {
                console.log("Error fetching data:", err);
            }
        };
        fetchData();
    }, [empId]);

    return (
        <div>
            {leaveRequestList.length > 0 && (
                <Link to='/leave'>
                    <div className="text-left bg-gray-100 rounded-xl p-4">
                        <ul>
                            {leaveRequestList.map((leave) => (
                                <li key={leave.id} className='flex gap-4'>
                                    <FaCalendar size={20} color='red' />
                                    Leave Request - {leave.leave_type}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Link>
            )}

            {financialRequestList.length > 0 && (
                <Link to='/payroll'>
                    <div className="text-left bg-gray-100 rounded-xl p-4 mt-5">
                        <ul>
                            {financialRequestList.map((financial) => (
                                <li key={financial.id} className='flex gap-4'>
                                    <FaWallet size={20} color='red' />
                                    Financial Request - {financial.request_type}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Link>
            )}

            {leaveRequestList.length === 0 && financialRequestList.length === 0 && (
                <div className="text-sm text-gray-500 mt-4">
                    No actions available for today.
                </div>
            )}
        </div>
    );
};

export default Actions;