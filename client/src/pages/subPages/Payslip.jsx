import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payslip = () => {
    const empId = localStorage.getItem('empId');
    const [payslip, setPayslip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayslip = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/admin/getPayslip/${empId}`);
                console.log(response.data)
                setPayslip(response.data);
            } catch (err) {
                setError('Error fetching payslip data');
                console.error('Error fetching payslip:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayslip();
    }, [empId]);
    
    const { earnings, total_earnings, deductions, total_deductions, net_pay } = payslip;

    return (
        <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md">
            <div>
                <h3 className="text-lg mb-4">Payslip</h3>
                {error && <p className='text-red-500'>{error}</p>}
                {loading && <p className='text-gray-500'>Loading...</p>}
                {!loading && !payslip && <p className='text-center'>No payslip found</p>}

                {payslip && (
                    <table className="min-w-full bg-white border text-gray-600 rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b" colSpan="4">Earnings(LKR)</th>
                                <th className="py-2 px-4 border-b border-l" colSpan="3">Deduction(LKR)</th>
                            </tr>
                            <tr>
                                {Object.keys(earnings).map((key, index) => (
                                    <th key={index} className="py-2 px-4 border-b border-l">{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                                ))}
                                {Object.keys(deductions).map((key, index) => (
                                    <th key={index} className="py-2 px-4 border-b border-l">{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            <tr>
                                {Object.values(earnings).map((value, index) => (
                                    <td key={index} className="py-2 px-4 border-b border-l">{parseFloat(value).toFixed(2)}</td>
                                ))}
                                {Object.values(deductions).map((value, index) => (
                                    <td key={index} className="py-2 px-4 border-b border-l">{parseFloat(value).toFixed(2)}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b font-bold" colSpan={4}>{total_earnings}</td>
                                <td className="py-2 px-4 border-b font-bold border-l" colSpan={3}>{total_deductions}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b font-bold text-orange-500" colSpan={7}>Net Pay: {net_pay} LKR</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Payslip;