import React from 'react';

const WorkInformation = () => {
    const workInfo = {
        department: 'Engineering',
        location: 'Colombo',
        designation: 'Senior Software Engineer',
        supervisor: "John Doe",
    };

    return (
        <div className="mt-4 bg-[#f6f5fb] p-6 rounded-lg">
            <div>
                <p>Department: {workInfo.department}</p>
                <p>Location: {workInfo.location}</p>
                <p>Designation: {workInfo.designation}</p>
                <p>Supervisor: {workInfo.supervisor}</p>
            </div>
        </div>
    );
};

export default WorkInformation;