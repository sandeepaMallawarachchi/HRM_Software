import React from 'react';

const WorkInformation = () => {
    const workInfo = {
        department: 'Engineering',
        location: 'Colombo',
        designation: 'Senior Software Engineer',
        supervisor: "John Doe",
    };

    return (
        <div className="mt-4 bg-[#eaeaea] p-6 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-500">Department:</label>
                    <input
                        type="text"
                        value={workInfo.department}
                        readOnly
                        className="w-full p-2 mt-1 border-none rounded"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-500">Location:</label>
                    <input
                        type="text"
                        value={workInfo.location}
                        readOnly
                        className="w-full p-2 mt-1 border-none rounded"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-500">Designation:</label>
                    <input
                        type="text"
                        value={workInfo.designation}
                        readOnly
                        className="w-full p-2 mt-1 border-none rounded"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-500">Supervisor:</label>
                    <input
                        type="text"
                        value={workInfo.supervisor}
                        readOnly
                        className="w-full p-2 mt-1 border-none rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkInformation;