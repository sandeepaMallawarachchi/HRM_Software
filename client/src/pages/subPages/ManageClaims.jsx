import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMoneyBillWave } from 'react-icons/fa';

const ManageClaims = () => {
    const empId = localStorage.getItem('empId');
    const [maxAmount, setMaxAmount] = useState(0);
    const [newAmount, setNewAmount] = useState('');

    useEffect(() => {
        const fetchMaxAmount = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/medical/getClaimSummary/${empId}`);
                setMaxAmount(response.data.maxAmount);
            } catch (error) {
                console.error('Error fetching claim summary:', error);
            }
        };

        fetchMaxAmount();
    }, []);

    const handleUpdateAmount = async () => {
        try {
            await axios.put('http://localhost:4000/medical/updateClaimAmount', { maxamount: newAmount });
            setMaxAmount(newAmount);
            setNewAmount('');
            alert('Claim amount updated successfully');
        } catch (error) {
            console.error('Error updating claim amount:', error);
            alert('Error updating claim amount');
        }
    };

    return (
        <div className="p-6 px-20 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Manage Claims</h2>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <FaMoneyBillWave className="text-4xl text-green-500 mr-4" />
                <div className='flex justify-between w-full'>
                    <div>
                        <h3 className="text-xl font-semibold">Current Maximum Amount</h3>
                        <p className="text-gray-700">
                            {maxAmount || 0} LKR
                        </p>
                    </div>
                    <div>
                        <input
                            type="number"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            placeholder="Enter new max amount"
                            className="p-2 my-2 rounded border border-gray-300"
                        />
                        <button
                            onClick={handleUpdateAmount}
                            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                        >
                            Update Amount
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageClaims;