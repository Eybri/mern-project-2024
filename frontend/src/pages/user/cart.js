import React, { Fragment } from 'react';
import MetaData from '../../components/Layout/Metadata';
import Loader from '../../components/Layout/Loader';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useFetchCart from '../../components/Hooks/FetchCart';

const Cart = () => {
const { loading, cartItems } = useFetchCart();

const calculateTotal = (items) => {
    return items.reduce((total, item) => {
        const itemTotal = item.quantity * item.product.price;
        return total + itemTotal;
    }, 0); 
};
const total = calculateTotal(cartItems);
const handleQuantityChange = async (itemId, action) => {
    try {
        const token = getToken();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        const data = { itemId, action };

        await axios.put(
            'http://localhost:4001/api/v1/cart/update',
            data,
            config
        );
        window.location.reload();  

    } catch (error) {
        console.log("Item ID and action being sent to API:", itemId, action);
        const message = error.response?.data?.message || `Error updating quantity!`;
        console.error(message);
    }
};

const handleIncrease = (itemId) => handleQuantityChange(itemId, 'increase');
const handleDecrease = (itemId) => handleQuantityChange(itemId, 'decrease');
const handleDelete = (itemId) => handleQuantityChange(itemId, 'delete');


const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.product.name]) {
        acc[item.product.name] = [];
    }
    acc[item.product.name].push(item);
    return acc;
}, {});

    return (
        <>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Your Cart'} />
                    <div className="container mt-4">
                        <h4 className="text-start mb-4" style={{ maxWidth: '850px', margin: '0 auto' }}><i class="bi bi-basket3"></i> Your Cart</h4>

                        {/* Check if cart is empty */}
                        {cartItems.length === 0 ? (
                            <div className="alert alert-warning text-center">
                                Cart is empty.
                            </div>
                        ) : (
                            // Cart items container
                            <div className="list-group"  style={{ maxWidth: '850px', margin: '0 auto' }}>
                                {Object.keys(groupedItems).map((productName) => (
                                    <div key={productName} className="card mb-3 shadow-sm " style={{borderRadius:'0px'}}>
                                        <div className="card-header">
                                            <h5>{productName}</h5>
                                        </div>
                                        <div className="">
                                            {groupedItems[productName].map((item, index) => (
                                                <div
                                                    key={`${item.product._id}-${item.color}-${index}`}
                                                    className="d-flex flex-row align-items-center p-3 mb-2"
                                                    style={{ borderRadius: '8px', backgroundColor: '#f8f9fa' }}
                                                >
                                                    {/* Product Image Column */}
                                                    <div className="d-flex justify-content-center align-items-center" style={{ flex: '0 0 100px', marginRight: '16px' }}>
                                                        <img
                                                            src={item.product.images[0].url}
                                                            alt={item.product.name}
                                                            className="img-fluid"
                                                            style={{
                                                                width: '80px',
                                                                height: '80px',
                                                                objectFit: 'cover', // Ensures the image retains aspect ratio without squeezing
                                                                borderRadius: '8px',
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Product Details Column */}
                                                    <div className="d-flex flex-column flex-grow-1" style={{ maxWidth: '500px' }}>
                                                        <h6>{item.product.name}</h6>
                                                        <div className="d-flex justify-content-between">
                                                            <small className="text-muted mt-1">Color: {item.color}</small>
                                                        </div>
                                                        <div className="d-flex justify-content-start align-items-center mt-2">
                                                            {/* Quantity input */}
                                                            <div className="quantity-container d-flex align-items-center" style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '4px', backgroundColor: '#f8f9fa' }}>
                                                                <button
                                                                    className="btn btn-sm btn-outline-secondary qty-custom"
                                                                    onClick={(e) => handleDecrease(item.id, 'decrease')} 
                                                                    // disabled={item.quantity <= 1}
                                                                    style={{
                                                                        border: 'none',
                                                                        backgroundColor: 'transparent',
                                                                        padding: '0',
                                                                        fontSize: '20px',
                                                                        fontWeight: 'bold',
                                                                        width: '20px',
                                                                        height: '30px',
                                                                        lineHeight: '30px',
                                                                        outline: 'none',
                                                                    }}
                                                                >
                                                                    -
                                                                </button>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm text-center"
                                                                    value={item.quantity}
                                                                    readOnly
                                                                    style={{
                                                                        width: '35px',
                                                                        height: '35px',
                                                                        border: 'none',
                                                                        backgroundColor: 'transparent',
                                                                        fontSize: '14px',
                                                                        fontWeight: 'bold',
                                                                    }}
                                                                />
                                                                <button
                                                                    className="btn btn-sm btn-outline-secondary qty-custom"
                                                                    onClick={() => handleIncrease(item.id, 'increase')}  
                                                                    style={{
                                                                        border: 'none',
                                                                        backgroundColor: 'transparent',
                                                                        padding: '0',
                                                                        fontSize: '20px',
                                                                        fontWeight: 'bold',
                                                                        width: '20px',
                                                                        height: '30px',
                                                                        lineHeight: '30px',
                                                                        outline: 'none',
                                                                    }}
                                                                    disabled={loading}
                                                                >
                                                                    {/* + */}
                                                                    {loading ? 'Updating...' : '+'}
                                                                </button>
                                                            </div>

                                                            {/* Trash button beside the quantity input */}
                                                            <button className="btn btn-link text-danger shadow-none"
                                                            onClick={() => handleDelete(item.id, 'delete')} 
                                                            >
                                                                <i className="bi bi-trash" style={{ fontSize: '1.1rem' }}></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <small className="text-muted mt-1">
                                                        Total: ₱{ (item.product.price * item.quantity).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }
                                                    </small>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className=" mt-1 mb-3 text-end">
                                <Link to="/order/summary">
                                    <button className="btn btn-dark btn-md">
                                        Proceed to Checkout - ₱{total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </button>
                                </Link>  
                                </div>
                            </div>
                        )}                               
                    </div>
                </Fragment>
            )}
        </>
    );
};

export default Cart;
