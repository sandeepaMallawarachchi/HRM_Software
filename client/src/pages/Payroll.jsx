import React, { useState } from 'react';
import jsPDF from 'jspdf';
import logo from '../images/logo.png'; // Assuming logo.png is in the /images folder

const Payroll = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  
  // Sample employee data
  const employeeData = {
    empId: 'EMP001',
    empName: 'Sandeepa Mallawarachchi',
    basic: 50000,
    totalDaysWorked: 22,
    bonus: 5000,
    ot: 3000,
    grossPay: 58000,
    providentFund: 2000,
    professionalTax: 500,
    loan: 1500,
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      // Add Logo
      doc.addImage(img, 'PNG', 10, 10, 30, 30);

      // Header
      doc.setFontSize(14);
      doc.text('Payslip', 105, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.text('Your Company Name', 105, 30, { align: 'center' });
      doc.text('1234 Your Address Line 1', 105, 35, { align: 'center' });
      doc.text('Your City, ZIP Code', 105, 40, { align: 'center' });

      // Employee Info
      doc.setFontSize(10);
      doc.text(`Date of Joining: 2019-02-15`, 20, 60);
      doc.text(`Pay Period: ${selectedMonth}`, 20, 65);
      doc.text(`Worked Days: ${employeeData.totalDaysWorked}`, 20, 70);
      doc.text(`Employee Name: ${employeeData.empName}`, 130, 60);
      doc.text(`Designation: Software Engineer`, 130, 65);
      doc.text(`Department: IT`, 130, 70);

      // Table Headings
      doc.setFontSize(12);
      doc.text('Earnings', 40, 90);
      doc.text('Amount', 100, 90);
      doc.text('Deductions', 140, 90);
      doc.text('Amount', 180, 90);

      // Table Content
      doc.setFontSize(10);
      doc.text('Basic', 40, 100);
      doc.text(`${employeeData.basic}`, 100, 100);
      doc.text('Provident Fund', 140, 100);
      doc.text(`${employeeData.providentFund}`, 180, 100);

      doc.text('Bonus', 40, 110);
      doc.text(`${employeeData.bonus}`, 100, 110);
      doc.text('Professional Tax', 140, 110);
      doc.text(`${employeeData.professionalTax}`, 180, 110);

      doc.text('OT', 40, 120);
      doc.text(`${employeeData.ot}`, 100, 120);
      doc.text('Loan', 140, 120);
      doc.text(`${employeeData.loan}`, 180, 120);

      // Total Earnings & Deductions
      const totalEarnings = employeeData.basic + employeeData.bonus + employeeData.ot;
      const totalDeductions = employeeData.providentFund + employeeData.professionalTax + employeeData.loan;
      const netPay = totalEarnings - totalDeductions;

      doc.text('Total Earnings', 40, 130);
      doc.text(`${totalEarnings}`, 100, 130);
      doc.text('Total Deductions', 140, 130);
      doc.text(`${totalDeductions}`, 180, 130);

      // Net Pay
      doc.setFontSize(12);
      doc.text('Net Pay', 40, 140);
      doc.text(`${netPay}`, 100, 140);

      // Net Pay in words
      const netPayInWords = 'Fifty-Eight Thousand Only';
      doc.setFontSize(10);
      doc.text(netPayInWords, 105, 150, { align: 'center' });

      // Signature Area
      doc.setFontSize(10);
      doc.text('Employer Signature', 40, 170);
      doc.text('Employee Signature', 140, 170);
      doc.line(40, 175, 90, 175);  // Employer line
      doc.line(140, 175, 190, 175);  // Employee line

      // Footer
      doc.text('This is a system-generated payslip.', 105, 190, { align: 'center' });

      // Save PDF
      doc.save(`Payslip_${selectedMonth}.pdf`);
    };
  };

  return (
    <div className="p-6">
      <label className="block mb-2 text-sm font-medium">Select Month:</label>
      <select 
        value={selectedMonth} 
        onChange={handleMonthChange} 
        className="mb-4 p-2 border rounded-md w-full"
      >
        <option value="">--Select Month--</option>
        <option value="January 2024">January 2024</option>
        <option value="February 2024">February 2024</option>
        <option value="March 2024">March 2024</option>
        {/* Add more months as needed */}
      </select>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Emp ID</th>
            <th className="border px-4 py-2">Emp Name</th>
            <th className="border px-4 py-2">Basic</th>
            <th className="border px-4 py-2">Total Days Worked</th>
            <th className="border px-4 py-2">Bonus</th>
            <th className="border px-4 py-2">OT</th>
            <th className="border px-4 py-2">Gross Pay</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{employeeData.empId}</td>
            <td className="border px-4 py-2">{employeeData.empName}</td>
            <td className="border px-4 py-2">{employeeData.basic}</td>
            <td className="border px-4 py-2">{employeeData.totalDaysWorked}</td>
            <td className="border px-4 py-2">{employeeData.bonus || 'N/A'}</td>
            <td className="border px-4 py-2">{employeeData.ot || 'N/A'}</td>
            <td className="border px-4 py-2">{employeeData.grossPay}</td>
          </tr>
        </tbody>
      </table>

      {selectedMonth && (
        <button 
          onClick={handleDownloadPDF} 
          className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-[20px] hover:bg-orange-600"
        >
          Download Pay Slip for {selectedMonth}
        </button>
      )}
    </div>
  );
};

export default Payroll;