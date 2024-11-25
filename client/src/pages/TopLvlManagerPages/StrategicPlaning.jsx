import React, { useState } from 'react'
import NewStrategicGoal from './NewStrategicGoal';
import CurrentStrategicGoals from './CurrentStrategicGoals';

const StrategicPlaning = () => {

    const [visibleSection, setVisibleSection] = useState('newgoals');

    const handleSectionToggle = (section) => {
        setVisibleSection(visibleSection === section ? null : section);
    };

    return (
        <div className="md:col-span-2 space-y-4 m-10">
            <div className="flex space-x-6 mt-4">
                <button
                    onClick={() => handleSectionToggle('newgoals')}
                    className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'newgoals' ? 'bg-orange-500 text-white' : ''}`}
                >
                    New Strategic Plan
                </button>
                <button
                    onClick={() => handleSectionToggle('currentgoals')}
                    className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'currentgoals' ? 'bg-orange-500 text-white' : ''}`}
                >
                    Current Strategic Plans
                </button>
            </div>

            {visibleSection === 'newgoals' && <NewStrategicGoal />}
            {visibleSection === 'currentgoals' && <CurrentStrategicGoals />}
        </div>
    )
}

export default StrategicPlaning