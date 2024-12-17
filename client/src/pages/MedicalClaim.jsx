import React, { useState } from 'react'
import AddMedicalClaim from './subPages/AddMedicalClaim';

const MedicalClaim = () => {

    const [visibleSection, setVisibleSection] = useState('addclaim');

    const handleSectionToggle = (section) => {
        setVisibleSection(visibleSection === section ? null : section);
    };

    return (
        <div className="md:col-span-2 space-y-4 m-10">
            <div className="flex space-x-6 mt-4">
                <button
                    onClick={() => handleSectionToggle('addclaim')}
                    className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'addclaim' ? 'bg-orange-500 text-white' : ''}`}
                >
                    Add Medical Claim Request
                </button>
                {/* <button
                    onClick={() => handleSectionToggle('attendance')}
                    className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'attendance' ? 'bg-orange-500 text-white' : ''}`}
                >
                    My Attendance Records
                </button> */}
            </div>

            {visibleSection === 'addclaim' && <AddMedicalClaim />}
            {/* {visibleSection === 'attendance' && <MyAttendance />} */}
        </div>
    )
}

export default MedicalClaim