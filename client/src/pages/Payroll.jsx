import React, { useState } from 'react'
import Payslip from './subPages/Payslip'
import PayRollAssitance from './subPages/PayRollAssitance';
import SalaryAdvanceLoanRequest from './subPages/SalaryAdvanceLoanRequest';
import MyFinancialRequests from './subPages/MyFinancialRequests';

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
        <button
          onClick={() => handleSectionToggle('salaryandloan')}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'salaryandloan' ? 'bg-orange-500 text-white' : ''}`}
        >
          Request Salary Advance / Loan
        </button>
        <button
          onClick={() => handleSectionToggle('finacialrequest')}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'finacialrequest' ? 'bg-orange-500 text-white' : ''}`}
        >
          My Financial Requests
        </button>
      </div>

      {visibleSection === 'payslip' && <Payslip />}
      {visibleSection === 'payrollAssitance' && <PayRollAssitance />}
      {visibleSection === 'salaryandloan' && <SalaryAdvanceLoanRequest />}
      {visibleSection === 'finacialrequest' && <MyFinancialRequests />}
    </div>
  )
}

export default Payroll