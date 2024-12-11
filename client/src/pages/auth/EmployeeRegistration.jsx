import React, { useState } from 'react'
import AddWorkDetails from './AddWorkDetails';
import LoginDetails from './LoginDetails';

const EmployeeRegistration = () => {

  const [visibleSection, setVisibleSection] = useState('login');

  const handleSectionToggle = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };

  return (
    <div className="md:col-span-2 space-y-4 m-10">
      <div className="flex space-x-6 mt-4">
        <button
          onClick={() => handleSectionToggle('login')}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'login' ? 'bg-orange-500 text-white' : ''}`}
        >
          Add Login Details
        </button>
        <button
          onClick={() => handleSectionToggle('work')}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'work' ? 'bg-orange-500 text-white' : ''}`}
        >
          Add Work Details
        </button>
      </div>

      {visibleSection === 'login' && <LoginDetails />}
      {visibleSection === 'work' && <AddWorkDetails />}
    </div>
  )
}

export default EmployeeRegistration