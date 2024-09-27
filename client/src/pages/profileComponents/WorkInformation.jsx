import axios from 'axios';
import React, { useEffect, useState } from 'react';

const WorkInformation = () => {
    const [workDetails, setWorkDetails] = useState({});
    const id = 1;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const workResponse = await axios.get(`http://localhost:4000/employees/getWorkDetails/${id}`);
                setWorkDetails(workResponse.data);
            } catch (err) {
                console.log("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="mt-4 bg-[#eaeaea] p-6 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-500">Department:</label>
                    <input
                        type="text"
                        value={workDetails.department}
                        readOnly
                        className="w-full p-2 mt-1 border-none rounded"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-500">Location:</label>
                    <input
                        type="text"
                        value={workDetails.location}
                        readOnly
                        className="w-full p-2 mt-1 border-none rounded"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-500">Designation:</label>
                    <input
                        type="text"
                        value={workDetails.designation}
                        readOnly
                        className="w-full p-2 mt-1 border-none rounded"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-500">Supervisor:</label>
                    <input
                        type="text"
                        value={workDetails.supervisor}
                        readOnly
                        className="w-full p-2 mt-1 border-none rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkInformation;