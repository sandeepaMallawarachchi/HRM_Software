import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../images/hrm withoutbackground.png';
import axios from 'axios';

const PayslipComponent = ({ payslip, onDownloadComplete }) => {
    const payslipRef = useRef(null);
    const empId = localStorage.getItem('empId');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');


    useEffect(() => {
        const fetchEmpDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/employees/getWorkDetails/${empId}`);
                setDepartment(response.data.department);
                setDesignation(response.data.designation);

            } catch (err) {
                console.error('Error fetching employee:', err);
            }
        };
        fetchEmpDetails();
    }, [empId]);

    useEffect(() => {
        const handleDownload = () => {
            const doc = new jsPDF('p', 'pt', 'a4');
            doc.addImage(logo, 'PNG', 40, 40, 50, 50);
            doc.setFontSize(14);
            doc.text('GLOBAL HRM', 100, 60);
            doc.text(`Issue Date: ${new Date().toLocaleDateString('en-CA')}`, 400, 60);

            if (payslip) {
                const { date, total_days_worked, total_hours_worked } = payslip;
                doc.setFontSize(12);
                doc.text(`Payslip for: ${formatDate(date)}`, 40, 120);
                doc.text(`Employee ID: ${empId}`, 40, 140);
                doc.text(`Department: ${department}`, 40, 160);
                doc.text(`Designation: ${designation}`, 40, 180);
                doc.text(`Total Days Worked: ${total_days_worked}`, 40, 200);
                doc.text(`Total Hours Worked: ${total_hours_worked}`, 40, 220);
            }

            const payslipTable = payslipRef.current;
            if (payslipTable) {
                html2canvas(payslipTable).then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    doc.addImage(imgData, 'PNG', 40, 250, 500, 400);
                    doc.save(`payslip_${empId}.pdf`);
                    onDownloadComplete && onDownloadComplete();
                });
            } else {
                console.error('Payslip table not found!');
            }
        };

        if (payslip) {
            handleDownload();
        }
    }, [payslip, onDownloadComplete]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

    return (
        <div>
            <table className="min-w-full bg-white border border-black text-black rounded-none" id="payslipTable" ref={payslipRef}>
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-black border-b border-r" colSpan="2">Description</th>
                        <th className="py-2 px-4 border-black border-b border-r">Earnings (LKR)</th>
                        <th className="py-2 px-4 border-black border-b">Deductions (LKR)</th>
                    </tr>
                </thead>
                <tbody>
                    {payslip?.earnings && Object.keys(payslip.earnings).map((key, index) => (
                        <tr key={`earning-${index}`} className="text-right">
                            <td className="py-2 px-12 border-black border-b border-r text-left" colSpan="2">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </td>
                            <td className="py-2 px-12 border-black border-b border-r">{parseFloat(payslip.earnings[key]).toFixed(2)}</td>
                            <td className="py-2 px-12 border-black border-b"></td>
                        </tr>
                    ))}
                    {payslip?.deductions && Object.keys(payslip.deductions).map((key, index) => (
                        <tr key={`deduction-${index}`} className="text-right">
                            <td className="py-2 px-12 border-black border-b border-r text-left" colSpan="2">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </td>
                            <td className="py-2 px-12 border-black border-b border-r"></td>
                            <td className="py-2 px-12 border-black border-b">{parseFloat(payslip.deductions[key]).toFixed(2)}</td>
                        </tr>
                    ))}
                    <tr>
                        <td className="py-2 px-12 border-black border-b font-bold border-r text-left" colSpan="2">Total Earnings</td>
                        <td className="py-2 px-12 border-black border-b border-r text-right">{payslip?.total_earnings}</td>
                        <td className="py-2 px-12 border-black border-b"></td>
                    </tr>
                    <tr>
                        <td className="py-2 px-12 border-black border-b font-bold border-r text-left" colSpan="2">Total Deductions</td>
                        <td className="py-2 px-12 border-black border-b border-r"></td>
                        <td className="py-2 px-12 border-black border-b text-right">{payslip?.total_deductions}</td>
                    </tr>
                    <tr className="bg-orange-100">
                        <td className="py-2 px-12 border-black border-b font-bold border-r text-left" colSpan="2">Net Pay</td>
                        <td className="py-2 px-12 border-black border-b text-center" colSpan="2">{payslip?.net_pay}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PayslipComponent;
