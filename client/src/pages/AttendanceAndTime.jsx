import React, { useState } from 'react'
import PunchInOut from './subPages/PunchInOut'
import MyAttendance from './subPages/MyAttendance'

const AttendanceAndTime = () => {

    const [visibleSection, setVisibleSection] = useState('punchinout');

    const handleSectionToggle = (section) => {
        setVisibleSection(visibleSection === section ? null : section);
    };

    return (
        <div className="md:col-span-2 space-y-4 m-10">
            <div className="flex space-x-6 mt-4">
                <button
                    onClick={() => handleSectionToggle('punchinout')}
                    className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'punchinout' ? 'bg-orange-500 text-white' : ''}`}
                >
                    Punch In / Punch Out
                </button>
                <button
                    onClick={() => handleSectionToggle('attendance')}
                    className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'attendance' ? 'bg-orange-500 text-white' : ''}`}
                >
                    My Attendance Records
                </button>
            </div>

            {visibleSection === 'punchinout' && <PunchInOut />}
            {visibleSection === 'attendance' && <MyAttendance />}
        </div>
    )
}

export default AttendanceAndTime