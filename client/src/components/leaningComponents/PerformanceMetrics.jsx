import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PerformanceMetrics = () => {
    const empId = localStorage.getItem('empId');
    const [targetTime, setTargetTime] = useState(7);
    const [completedTime, setCompletedTime] = useState(0);
    const [rate, setRate] = useState(null);

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/learning/updateMetrics/${empId}`, {
                targettime: targetTime,
                completedtime: completedTime,
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error updating performance metrics:', error);
            alert('Error updating performance metrics');
        }
    };

    const fetchPerformance = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/learning/getPerformanceMetrics/${empId}`);
            const data = response.data;
            if (data) {
                setTargetTime(data.targettime || 7);
                setCompletedTime(data.completedtime || 0);
                setRate(data.rate || 0);
            }
        } catch (error) {
            console.error('Error fetching performance:', error);
        }
    };

    useEffect(() => {
        fetchPerformance();
    }, []);

    const rateColor = rate < 50 ? 'text-red-600' : rate <= 75 ? 'text-orange-500' : 'text-green-500';

    return (
        <div className="card bg-gradient-to-r from-purple-500 to-purple-300 text-black rounded-lg p-5 transition-shadow duration-300 hover:shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Weekly Performance Metrics</h2>
            <div className="flex justify-between mb-4">
                {[7, 10, 14].map((time) => (
                    <button
                        key={time}
                        onClick={() => setTargetTime(time)}
                        className={`px-4 py-2 rounded border ${targetTime === time ? 'bg-purple-600 text-white' : 'bg-gray-100'
                            }`}
                    >
                        {time} Hours
                    </button>
                ))}
            </div>
            <div className="flex justify-between gap-2 mb-4">
                <label className="text-sm font-medium mb-1">Completed Time (hours):</label>
                <input
                    type="number"
                    value={completedTime}
                    onChange={(e) => setCompletedTime(Number(e.target.value))}
                    className="p-2 border rounded"
                />
            </div>
            <div className="flex justify-between gap-2">
                <button
                    onClick={handleUpdate}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    Update Metrics
                </button>
                {rate !== null && !isNaN(rate) && (
                    <div className={`mt-4 text-3xl font-bold ${rateColor}`}>
                        {rate}% <span className='text-sm'>Rate</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerformanceMetrics;
