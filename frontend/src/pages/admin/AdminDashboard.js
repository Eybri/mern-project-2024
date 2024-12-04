import React, { Fragment, useState, useEffect, useRef } from 'react';
import MetaData from '../../components/Layout/Metadata';
import Loader from '../../components/Layout/Loader';
import Sidebar from './SideBar';
import { Pie, Line } from 'react-chartjs-2'; 
import axios from 'axios';
import '../../App.css';
import { getToken } from '../../utils/helpers';

import {
    Chart,
    ArcElement, 
    LineElement,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);


const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [categoryStock, setCategoryStock] = useState([]);
    // const [deliveredOrdersStats, setDeliveredOrdersStats] = useState([]);
    const [totalSalesStats, setTotalSalesStats] = useState([]);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: ''
    });

    const chartRef = useRef(null);

    // Fetch data when component mounts
    useEffect(() => {
        // Fetch category stock data
        const fetchCategoryStock = async () => {
            try {
                const token = getToken();
                const baseURL = 'http://localhost:4001';
                const { data } = await axios.get(`${baseURL}/api/v1/admin/category-stock`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategoryStock(data.stockData || []);
            } catch (error) {
                console.error('Error fetching category stock data:', error);
                setError(error.message || 'Failed to fetch data');
            }
        };

        // Fetch total sales stats based on date filter
        const fetchTotalSalesStats = async () => {
            try {
                const token = getToken();
                const baseURL = 'http://localhost:4001';
                const { data } = await axios.get(`${baseURL}/api/v1/admin/orders/delivered-stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        startDate: dateFilter.startDate,
                        endDate: dateFilter.endDate
                    }
                });
    
                setTotalSalesStats(data.salesData || []);
            } catch (error) {
                console.error('Error fetching total sales stats:', error);
                setError(error.message || 'Failed to fetch data');
            }
        };
    
        if (dateFilter.startDate && dateFilter.endDate) {
            fetchTotalSalesStats();
        }

        fetchCategoryStock();
        fetchTotalSalesStats();

        setLoading(false);
    }, [dateFilter]);

    // Handle date filter change
    const handleDateFilterChange = (e) => {
        const { name, value } = e.target;
        setDateFilter((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Pie Chart Data for Category Stock
    const categoryChartData = {
        labels: categoryStock.map((data) => data.category),
        datasets: [
            {
                label: 'Stock Count',
                data: categoryStock.map((data) => data.stock),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
        ],
    };


    // Line Chart Data for Total Sales
    const salesChartData = {
        labels: totalSalesStats.map((data) => data.date),
        datasets: [
            {
                label: 'Total Sales',
                data: totalSalesStats.map((data) => data.totalSales),
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    // Handle loading and error states
    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <Fragment>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <MetaData title={'Admin Dashboard'} />
                    <div className="container-fluid">
                        <h1 id="products_heading">Admin Dashboard</h1>

                        {/* Date Filter Section */}
                        <div>
                            <label>Start Date:</label>
                            <input
                                type="date"
                                name="startDate"
                                value={dateFilter.startDate}
                                onChange={handleDateFilterChange}
                            />
                            <label>End Date:</label>
                            <input
                                type="date"
                                name="endDate"
                                value={dateFilter.endDate}
                                onChange={handleDateFilterChange}
                            />
                        </div>

                        <div className="charts-container" style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                            {/* Pie Chart for Category Stock */}
                            <div className="chart-container" style={{ flex: '1', height: '500px' }}>
                                <h2>Stock per Category (Pie)</h2>
                                {categoryStock.length > 0 ? (
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <Pie ref={chartRef} data={categoryChartData} options={chartOptions} />
                                    </div>
                                ) : (
                                    <div>No stock data available</div>
                                )}
                            </div>

                            {/* Line Chart for Total Sales */}
                            <div className="chart-container" style={{ flex: '1', height: '500px' }}>
                                <h2>Total Sales (Line Chart)</h2>
                                {totalSalesStats.length > 0 ? (
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <Line ref={chartRef} data={salesChartData} options={chartOptions} />
                                    </div>
                                ) : (
                                    <div>No sales data available</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default AdminDashboard;
