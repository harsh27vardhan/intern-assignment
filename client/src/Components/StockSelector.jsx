import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks, fetchGraphData, setDurations } from '../slice/stockSlice';
import { Select, MenuItem, CircularProgress, FormControl, InputLabel, Grid, Box } from '@mui/material';
import MyChartComponent from './MyChartComponent';

const StockSelector = () => {
    const dispatch = useDispatch();
    const { stocks, durations, graphData, loading, error } = useSelector((state) => state.stocks);

    const [selectedStock, setSelectedStock] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);

    useEffect(() => {
        dispatch(fetchStocks());
    }, [dispatch]);

    const handleStockChange = async (event) => {
        const stockId = event.target.value;
        const stock = stocks.find((stock) => stock.id === stockId);
        setSelectedStock(stockId);

        // Update durations with the available durations from the selected stock
        dispatch(setDurations(stock.available));
    };

    const handleDurationChange = (event) => {
        const duration = event.target.value;
        setSelectedDuration(duration);
        console.log('Duration selected:', selectedStock, duration);
        dispatch(fetchGraphData({ selectedStock, duration }));
    };

    // Function to filter the graph data based on the selected duration
    const filterGraphData = (duration) => {
        if (!graphData) return [];

        let durationInDays;

        // Map duration to number of days
        switch (duration) {
            case "1 Month":
                durationInDays = 30;
                break;
            case "3 Months":
                durationInDays = 90;
                break;
            case "6 Months":
                durationInDays = 180;
                break;
            case "1 Year":
                durationInDays = 365;
                break;
            default:
                return [];
        }

        // Filter data based on the timestamp, comparing with the current date
        const now = new Date();
        return graphData.filter((entry) => {
            const entryDate = new Date(entry.timestamp);
            const diffTime = Math.abs(now - entryDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert time difference to days
            return diffDays <= durationInDays;
        });
    };

    const chartData = {
        labels: filterGraphData(selectedDuration).map((entry) => entry.timestamp),
        datasets: [{
            label: 'Stock Data',
            data: filterGraphData(selectedDuration).map((entry) => entry.price), // Use price as data
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        }],
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center' }}>Stock Duration Graph</h1>

            {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}

            <Grid container spacing={3} justifyContent="center" alignItems="center">
                {/* Stock Selection */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Stock</InputLabel>
                        <Select
                            onChange={handleStockChange}
                            value={selectedStock || ''}
                            sx={{ width: '100%' }}
                        >
                            {stocks.map((stock) => (
                                <MenuItem key={stock.id} value={stock.id}>
                                    {stock.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Duration Selection */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Duration</InputLabel>
                        <Select
                            onChange={handleDurationChange}
                            value={selectedDuration || ''}
                            sx={{ width: '100%' }}
                        >
                            {durations.map((duration, index) => (
                                <MenuItem key={index} value={duration}>
                                    {duration}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Render the Chart */}
            {selectedStock && selectedDuration && !loading && !error && (
                <Box sx={{ marginTop: '20px' }}>
                    <MyChartComponent chartData={chartData} />
                </Box>
            )}

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        </Box>
    );
};

export default StockSelector;
