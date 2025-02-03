import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MyChartComponent = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const storedData = JSON.parse(sessionStorage.getItem('data'));
        const timestamps = storedData.map(entry => entry.timestamp);
        const prices = storedData.map(entry => entry.price);

        // chart data
        const data = {
            labels: timestamps,
            datasets: [{
                label: 'Price Over Time',
                data: prices,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            }],
        };
        setChartData(data);
    }, []);

    if (!chartData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Price Over Time</h2>
            <Line data={chartData} />
        </div>
    );
};

export default MyChartComponent;
