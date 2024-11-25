// hooks/useFetchCart.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/helpers';

const useFetchCart = () => {
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = getToken();
                if (!token) {
                    setCartItems([]);
                    setLoading(false);
                    return;
                }
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get('http://localhost:4001/api/v1/cart/items', config);
                setCartItems(response.data.items);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);
    

    return { loading, cartItems };
};


export default useFetchCart;
