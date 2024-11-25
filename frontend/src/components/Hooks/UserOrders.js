import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/helpers';

const UserOrders = (filterCondition = 'Pending') => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const token = getToken();
                const response = await axios.get('http://localhost:4001/api/v1/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const filteredOrders = response.data.orders.filter(order => order.status === filterCondition);
                setOrders(filteredOrders);

            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user orders');
            } finally {
                setLoading(false);
            }
        };

        fetchUserOrders();
    }, [filterCondition]); // Trigger when filterCondition changes

    return { loading, orders, error };
};

export default UserOrders;
