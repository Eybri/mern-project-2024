import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/helpers';

import 'react-toastify/dist/ReactToastify.css'; 

export const useOrders = (statusFilter = null) => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = getToken();
                const { data } = await axios.get('http://localhost:4001/api/v1/admin/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const filteredOrders = statusFilter ? data.orders.filter(order => order.status === statusFilter) : data.orders;
                setOrders(filteredOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [statusFilter]);

    return { orders, loading, setOrders };
};

export const useUpdateOrderStatus = () => {
    // const { setOrders, } = useOrders(); 
    
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = getToken();
            await axios.put('http://localhost:4001/api/v1/admin/orders/update', { orderId, status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // setOrders(prevOrders =>
            //     prevOrders.map(order =>
            //         order._id === orderId ? { ...order, status: newStatus } : order
            //     )
            // );
            
            setTimeout(() => {
                window.location.reload();  
            }, 1200); 
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return updateOrderStatus;
};

export const useDeleteOrder = () => {
    // const { setOrders,  } = useOrders(); 

    const deleteOrder = async (orderId) => {
        try {
            const token = getToken();
            await axios.delete('http://localhost:4001/api/v1/admin/orders/delete', {
                headers: { Authorization: `Bearer ${token}` },
                data: { orderId }
            });

            // setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            
            setTimeout(() => {
                window.location.reload();  
            }, 1200);
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    return deleteOrder;
};
