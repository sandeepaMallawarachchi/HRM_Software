import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../images/hrm withoutbackground.png'

const PayslipComponent = ({ payslip, onDownloadComplete }) => {

    useEffect(() => {
        const handleDownload = () => {
            const doc = new jsPDF('p', 'pt', 'a4');

            // Add company logo
            const imgUrl = { logo };
            doc.addImage(imgUrl, 'PNG', 40, 40, 50, 50);

            doc.setFontSize(14);
            doc.text('Company Name', 100, 60);
            const issueDate = new Date().toLocaleDateString('en-CA');
            doc.text(`Issue Date: ${issueDate}`, 400, 60);

            // Add employee details
            if (payslip) {
                const { total_days_worked, total_hours_worked } = payslip;
                doc.setFontSize(12);
                doc.text(`Total Days Worked: ${total_days_worked}`, 40, 120);
                doc.text(`Total Hours Worked: ${total_hours_worked}`, 40, 140);
            }

            // Add payslip table from HTML
            html2canvas(document.querySelector('#payslipTable')).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 40, 200, 500, 400);
                doc.save(`payslip_${payslip?.empId}.pdf`);

                onDownloadComplete();
            });
        };

        handleDownload();
    }, [payslip, onDownloadComplete]);

    return null;
};

export default PayslipComponent;
