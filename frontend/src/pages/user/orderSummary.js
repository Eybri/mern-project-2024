import React, { useState, useEffect, Fragment } from 'react';
import MetaData from '../../components/Layout/Metadata';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../utils/helpers';
import ShippingInfo from '../../components/Imports/Shippinginfo'; 
import useFetchCart from '../../components/Hooks/FetchCart';
import Loader from '../../components/Layout/Loader'; // Import the Loader component
import PaymentMethod from '../../components/Imports/PaymentMethod';

const OrderSummary = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const { cartItems, isLoading: cartLoading } = useFetchCart();
    
    const calculateTotal = (items) => {
        return items.reduce((total, item) => {
            const itemTotal = item.quantity * item.product.price;
            return total + itemTotal;
        }, 0); 
    };

    const total = calculateTotal(cartItems);

    const getProfile = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            }
        };

        try {
            const { data } = await axios.get('http://localhost:4001/api/v1/me', config);
            setUser(data.user);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong", {
                position: 'top-right',
            });
            setLoading(false);
        }
    };

    const groupedItems = cartItems.reduce((acc, item) => {
        const existingProduct = acc.find(i => i.product.name === item.product.name);
        if (existingProduct) {
            existingProduct.items.push({
                color: item.color,
                quantity: item.quantity,
                price: item.product.price,
                image: item.product.images[0]?.url, 
            });
        } else {
            acc.push({
                product: item.product,
                items: [{
                    color: item.color,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.images[0]?.url, 
                }]
            });
        }
        return acc;
    }, []);

    const getProductTotalQuantityAndPrice = (group) => {
        const totalQuantity = group.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = group.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        return { totalQuantity, totalPrice };
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <Fragment>
            <MetaData title={'Order Summary'} />
            <div className="container mt-4 mb-5">
                {/* <h1 className="text-center mb-4" id="products_heading">Order Summary</h1>       */}
                <div className="row">
                    <div className="col-md-5">
                        {loading ? (
                            <Loader /> 
                        ) : (
                            <ShippingInfo user={user} setUser={setUser} />
                        )}
                    <div className="row justify-content-center mb-5">
                            <div className="col-md-10 text-start ">
                                <h5>Payment</h5>
                                <p>All transactions are secure and encrypted</p>
                            </div>
                            <PaymentMethod />
                        </div>
                    </div>
                    {/* Right Column: Cart Summary */}
                    <div className="col-md-7">
                        {cartLoading ? (
                            <Loader /> // Display loader if cart data is loading
                        ) : groupedItems.length === 0 ? (
                            <div className="alert alert-warning text-center">
                                Your cart is empty.
                            </div>
                        ) : (
                            <div className="list-group">
                                {groupedItems.map((group, index) => {
                                    const { totalQuantity, totalPrice } = getProductTotalQuantityAndPrice(group);
                                    return (
                                        <div key={index} className="list-group-item">
                                            <div className="d-flex">
                                                {/* Displaying the first image */}
                                                <img
                                                    src={group.items[0].image || '/path/to/default/image.jpg'} // Display default image if no product image
                                                    alt={group.product.name}
                                                    className="img-fluid"
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover', // Ensures the image retains aspect ratio without squeezing
                                                        borderRadius: '8px',
                                                        marginRight: '15px',
                                                    }}
                                                />
                                                <div className="w-100">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <strong>{group.product.name}</strong>
                                                        <span>₱{totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className='text-muted'>Quantity: {totalQuantity}</span>
                                                    </div>
                                                    <ul className="list-unstyled mt-2 d-flex flex-wrap">
                                                        {group.items.map((item, idx) => (
                                                            <li key={idx} className="mr-1 mb-1" style={{ display: 'inline-block' }}>
                                                                <span className="badge badge-success">{item.color}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="list-group-item">
                                    <div className=" d-flex justify-content-between mb-2">
                                        <strong className='text-muted'>Sub Total</strong>
                                        <span className='text-muted'>₱{total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                    </div>
                                    <div className=" d-flex justify-content-between mb-2">
                                        <strong className='text-muted'>Shipping Fee</strong>
                                        <span className='text-muted'>₱100</span>
                                    </div>
                                    <div className=" d-flex justify-content-between">
                                        <strong>Total</strong>
                                        <span>₱{(total + 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span> 
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default OrderSummary;
