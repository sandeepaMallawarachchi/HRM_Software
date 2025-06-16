import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { FaMoneyBillWave, FaChartLine, FaClipboardList, FaDownload } from "react-icons/fa";
import 'jspdf-autotable';
import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../images/hrm withoutbackground.png';

const Budgeting = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("IT (Information Technology)");
  const [departments, setDepartments] = useState([]);
  const [allocatedBudget, setAllocatedBudget] = useState('');
  const [spentBudget, setSpentBudget] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("https://global-hrm-mobile-server.vercel.app/admin/getAllDepartments");
        setDepartments(response.data.map((dept) => dept.department));
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchAllocatedBudget = async () => {
      try {
        const response = await axios.get(
          `https://global-hrm-mobile-server.vercel.app/admin/getAllocatedBudget/${selectedDepartment}/${new Date().getFullYear()}/${new Date().getMonth() + 1}`
        );
        setAllocatedBudget(response.data);
      } catch (error) {
        console.error("Error fetching allocated budget:", error);
      }
    };

    const fetchSpentBudget = async () => {
      try {
        const response = await axios.get(
          `https://global-hrm-mobile-server.vercel.app/admin/getSpentBudget/${selectedDepartment}/${new Date().getFullYear()}/${new Date().getMonth() + 1}`
        );
        setSpentBudget(response.data);
      } catch (error) {
        console.error("Error fetching spent budget:", error);
      }
    };

    fetchDepartments();
    fetchAllocatedBudget();
    fetchSpentBudget();
  }, [selectedDepartment]);

  const barChartData = {
    labels: ["Allocated", "Spent"],
    datasets: [
      {
        label: `${selectedDepartment} Budget`,
        data: [
          allocatedBudget.budget,
          spentBudget.Total,
        ],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Operational Costs", "Marketing", "R&D", "Miscellaneous"],
    datasets: [
      {
        data: [
          spentBudget.OperationalCosts || 0,
          spentBudget.Marketing || 0,
          spentBudget.Marketing || 0,
          spentBudget.Miscellaneous || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const handleDownload = async () => {
    if (!selectedDepartment) return;
  
    setIsDownloading(true);
  
    try {
      const doc = new jsPDF('p', 'pt', 'a4');
      doc.addImage(logo, 'PNG', 40, 40, 50, 50);
      doc.setFontSize(14);
      doc.text('GLOBAL HRM', 100, 60);
      doc.text(`Issue Date: ${new Date().toLocaleDateString('en-CA')}`, 400, 60);
  
      doc.setFontSize(18);
      doc.text(`Budgeting Report - ${selectedDepartment}`, 40, 100);
  
      const report = reportRef.current;
      const chart = chartRef.current;
  
      if (report) {
        const reportCanvas = await html2canvas(report);
        const reportImg = reportCanvas.toDataURL('image/png');
        doc.addImage(reportImg, 'PNG', 40, 120, 500, 200);
      }
  
      if (chart) {
        const chartCanvas = await html2canvas(chart);
        const chartImg = chartCanvas.toDataURL('image/png');
        doc.addImage(chartImg, 'PNG', 40, doc.lastAutoTable?.finalY + 220 || 350, 500, 200);
      }
  
      doc.save(`budgeting_report_${selectedDepartment}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Budgeting Dashboard
      </h2>

      <div className="grid grid-cols-6 gap-2 justify-center mb-6">
        {departments.map((department) => (
          <button
            key={department}
            onClick={() => setSelectedDepartment(department)}
            className={`px-4 py-2 rounded-lg ${selectedDepartment === department
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-800 border border-gray-300 hover:bg-orange-100"
              }`}
          >
            {department}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaMoneyBillWave className="text-4xl text-green-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Allocated Budget</h3>
            <p className="text-gray-700">
              {allocatedBudget.budget || 0}LKR
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaChartLine className="text-4xl text-blue-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Spent Budget</h3>
            <p className="text-gray-700">
              {spentBudget.Total || 0}LKR
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaClipboardList className="text-4xl text-yellow-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Remaining Budget</h3>
            <p className="text-gray-700">
              {allocatedBudget.budget - spentBudget.Total}LKR
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-6 mb-6" ref={chartRef}>
        <div className="bg-white p-4 rounded-lg shadow-md flex-1 h-80 min-w-[300px]">
          <h3 className="text-xl font-semibold mb-4">Allocated vs Spent Budget</h3>
          <div className="h-64">
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex-1 h-80 min-w-[300px]">
          <h3 className="text-xl font-semibold mb-4">Spending Breakdown</h3>
          <div className="h-64">
            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between mb-5">
          <h3 className="text-xl font-semibold mb-4">Department Budget Details</h3>
          <button
            onClick={handleDownload}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <FaDownload />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <FaDownload />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>
        <table className="min-w-full bg-white border text-gray-600 rounded-lg" ref={reportRef}>
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-r" colSpan="2">Description</th>
              <th className="py-2 px-4 border-b border-r">Allocated Budget (LKR)</th>
              <th className="py-2 px-4 border-b">Spent Budget (LKR)</th>
            </tr>
          </thead>
          <tbody>
            <tr className='text-right'>
              <td className="py-2 px-12 border-b border-r text-left" colSpan="2">Allocated Budget</td>
              <td className="py-2 px-12 border-b border-r">{allocatedBudget.budget}</td>
              <td className="py-2 px-12 border-b"></td>
            </tr>
            <tr className='text-right'>
              <td className="py-2 px-12 border-b border-r text-left" colSpan="2">Operational Costs</td>
              <td className="py-2 px-12 border-b border-r"></td>
              <td className="py-2 px-12 border-b">{spentBudget.OperationalCosts}</td>
            </tr>
            <tr className='text-right'>
              <td className="py-2 px-12 border-b border-r text-left" colSpan="2">Marketing</td>
              <td className="py-2 px-12 border-b border-r"></td>
              <td className="py-2 px-12 border-b">{spentBudget.Marketing}</td>
            </tr>
            <tr className='text-right'>
              <td className="py-2 px-12 border-b border-r text-left" colSpan="2">Research & Development</td>
              <td className="py-2 px-12 border-b border-r"></td>
              <td className="py-2 px-12 border-b">{spentBudget.ResearchDevelopment}</td>
            </tr>
            <tr className='text-right'>
              <td className="py-2 px-12 border-b border-r text-left" colSpan="2">Miscellaneous</td>
              <td className="py-2 px-12 border-b border-r"></td>
              <td className="py-2 px-12 border-b">{spentBudget.Miscellaneous}</td>
            </tr>
            <tr>
              <td className="py-2 px-12 border-b font-bold border-r text-left" colSpan="2">Total Allocation</td>
              <td className="py-2 px-12 border-b border-r text-right">{allocatedBudget.budget}</td>
              <td className="py-2 px-12 border-b"></td>
            </tr>
            <tr>
              <td className="py-2 px-12 border-b font-bold border-r text-left" colSpan="2">Total Spent</td>
              <td className="py-2 px-12 border-b border-r"></td>
              <td className="py-2 px-12 border-b text-right">{spentBudget.Total}</td>
            </tr>
            <tr>
              <td className="py-2 px-12 border-b font-bold border-r text-left" colSpan="2">Remaining Budget</td>
              <td
                className={`py-2 px-12 border-b text-center ${allocatedBudget.budget - spentBudget.Total >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                colSpan={2}
              >
                {allocatedBudget.budget - spentBudget.Total}
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Budgeting;
