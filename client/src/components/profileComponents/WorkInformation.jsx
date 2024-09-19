import React, { useState } from 'react';

const WorkInformation = () => {
    const [visible, setVisible] = useState(false);
    const workInfo = {
        department: 'Engineering',
        location: 'Colombo',
        designation: 'Senior Software Engineer',
        hierarchy: ['Manager', 'Team Lead', 'Senior Software Engineer'],
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold">Work Information</h3>
            <button onClick={() => setVisible(!visible)}>
                {visible ? 'Hide Details' : 'Show Details'}
            </button>
            {visible && (
                <div>
                    <p>Department: {workInfo.department}</p>
                    <p>Location: {workInfo.location}</p>
                    <p>Designation: {workInfo.designation}</p>
                    <h4>Hierarchy:</h4>
                    <ul>
                        {workInfo.hierarchy.map((position, index) => (
                            <li key={index}>{position}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default WorkInformation;
