import React, { useState } from 'react'
import LeaveRequest from './subPages/LeaveRequest'
import LeaveAnalysis from './subPages/LeaveAnalysis'
import MyLeaves from './subPages/MyLeaves'

const LeaveAndAttendance = () => {

    const [visibleSection, setVisibleSection] = useState('leave');

    const handleSectionToggle = (section) => {
        setVisibleSection(visibleSection === section ? null : section);
    };

    return (
        <div className="md:col-span-2 space-y-4 m-10">
            <div className="flex space-x-6 mt-4">
                <button
                    onClick={() => handleSectionToggle('leave')}
                    className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'leave' ? 'bg-orange-500 text-white' : ''}`}
                >
                    Leave Request
                </button>
                <button
                    onClick={() => handleSectionToggle('myleaves')}
                    className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'myleaves' ? 'bg-orange-500 text-white' : ''}`}
                >
                    My Leaves
                </button>
                <button
                    onClick={() => handleSectionToggle('attendance')}
                    className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'attendance' ? 'bg-orange-500 text-white' : ''}`}
                >
                    Leave Analysis
                </button>
            </div>

            {visibleSection === 'leave' && <LeaveRequest />}
            {visibleSection === 'myleaves' && <MyLeaves />}
            {visibleSection === 'attendance' && <LeaveAnalysis />}
        </div>
    )
}

export default LeaveAndAttendance