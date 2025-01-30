import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaChartLine, FaArrowUp, FaDownload } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../images/hrm withoutbackground.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ManageClaims = () => {
    const empId = localStorage.getItem('empId');
    const [maxAmount, setMaxAmount] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [newAmount, setNewAmount] = useState('');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [isDownloading, setIsDownloading] = useState(false);
    const reportRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchClaimSummary = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/medical/getAllClaimSummary`);
                setMaxAmount(response.data.maxAmount);
                setTotalSpent(response.data.totalSpent);

                const spentAmounts = response.data.spentAmounts || [];
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const dataMap = new Map();

                spentAmounts.forEach(item => {
                    const month = new Date(item.created_at).toLocaleString('default', { month: 'short' });
                    dataMap.set(month, item.requestamount);
                });

                const data = months.map(month => dataMap.get(month) || 0);

                setChartData({
                    labels: months,
                    datasets: [
                        {
                            label: 'Spent Amount',
                            data,
                            borderColor: 'rgba(255, 140, 0, 1)',
                            backgroundColor: 'rgba(255, 140, 0, 0.2)',
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching claim summary:', error);
            }
        };

        fetchClaimSummary();
    }, []);

    const handleUpdateAmount = async () => {
        try {
            await axios.put('http://localhost:4000/medical/updateClaimAmount', { maxAmount: newAmount });
            setMaxAmount(newAmount);
            setNewAmount('');
            alert('Claim amount updated successfully');
        } catch (error) {
            console.error('Error updating claim amount:', error);
            alert('Error updating claim amount');
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const doc = new jsPDF('p', 'pt', 'a4');
            doc.addImage(logo, 'PNG', 40, 40, 50, 50);
            doc.setFontSize(14);
            doc.text('GLOBAL HRM', 100, 60);
            doc.text(`Issue Date: ${new Date().toLocaleDateString('en-CA')}`, 400, 60);

            doc.setFontSize(18);
            doc.text('Claims Report', 40, 100);

            doc.setFontSize(14);
            doc.text(`Maximum Amount: ${maxAmount} LKR`, 40, 140);
            doc.text(`Total Spent Amount: ${totalSpent} LKR`, 40, 160);

            const chart = chartRef.current;

            if (chart) {
                const chartCanvas = await html2canvas(chart);
                const chartImg = chartCanvas.toDataURL('image/png');
                doc.addImage(chartImg, 'PNG', 40, 200, 500, 200);
            }

            doc.save('claims_report.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md w-full">
            <div className='flex justify-between items-center mb-6'>
                <h2 className="text-2xl font-semibold mb-4">Manage Claims</h2>
                <button
                    onClick={handleDownload}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                    {isDownloading ? (
                        <>
                            <FaDownload />
                            <span className='cursor-not-allowed'>Downloading...</span>
                        </>
                    ) : (
                        <>
                            <FaDownload />
                            <span>Download Report</span>
                        </>
                    )}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <FaMoneyBillWave className="text-4xl text-green-500 mr-4" />
                    <div>
                        <h3 className="text-xl font-semibold">Current Maximum Amount</h3>
                        <p className="text-gray-700">
                            {maxAmount || 0} LKR
                        </p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <FaChartLine className="text-4xl text-blue-500 mr-4" />
                    <div>
                        <h3 className="text-xl font-semibold">Total Spent Amount</h3>
                        <p className="text-gray-700">
                            {totalSpent || 0} LKR
                        </p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <FaArrowUp className="text-4xl text-yellow-500 mr-4" />
                    <div className='w-full flex items-center gap-4'>
                        <input
                            type="number"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            placeholder="Enter new max amount"
                            className="p-2 my-2 rounded border border-gray-300 w-full md:w-auto"
                        />
                        <button
                            onClick={handleUpdateAmount}
                            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 w-full" ref={chartRef}>
                <Line data={chartData} />
            </div>
        </div>
    );
};

export default ManageClaims;
