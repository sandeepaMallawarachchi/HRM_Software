import React, { useState } from 'react'
import Payslip from './subPages/Payslip'
import PayRollAssitance from './subPages/PayRollAssitance';

const Payroll = () => {

  const [visibleSection, setVisibleSection] = useState('payslip');

  const handleSectionToggle = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };

  return (
    <div className="md:col-span-2 space-y-4 m-10">
      <div className="flex space-x-6 mt-4">
        <button
          onClick={() => handleSectionToggle('payslip')}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'payslip' ? 'bg-orange-500 text-white' : ''}`}
        >
          Payslip
        </button>
        <button
          onClick={() => handleSectionToggle('payrollAssitance')}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'payrollAssitance' ? 'bg-orange-500 text-white' : ''}`}
        >
          Payroll Assitance
        </button>
        {/* <button
          onClick={() => handleSectionToggle('attendance')}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'attendance' ? 'bg-orange-500 text-white' : ''}`}
        >
          Leave Analysis
        </button> */}
      </div>

      {visibleSection === 'payslip' && <Payslip />}
      {visibleSection === 'payrollAssitance' && <PayRollAssitance />}
      {/* {visibleSection === 'attendance' && <LeaveAnalysis />} */}
    </div>
  )
}

export default Payroll