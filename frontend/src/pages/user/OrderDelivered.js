import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../../components/Layout/Metadata';
import Loader from '../../components/Layout/Loader';
import UserOrderNavigator from '../../components/Imports/UserOrderNavigator';
import useOrders from '../../components/Hooks/UserOrders';
import ReviewModal from './ReviewModal'; 
import { getToken } from '../../utils/helpers';
import axios from 'axios';

const OrderDelivered = () => {
    const { loading, orders, error } = useOrders('Delivered');
    const [userReviews, setUserReviews] = useState([]);  

    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const fetchUserReviews = async () => {
            const token = getToken();
            try {
                const response = await axios.get('http://localhost:4001/api/v1/reviews/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserReviews(response.data.reviews); 
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
            }
        };

        fetchUserReviews();
    }, []); 

    const handleRateClick = (product, orderId) => {
        setSelectedProduct(product); 
        setSelectedOrderId(orderId);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false); 
        setSelectedOrderId(null);    
        setSelectedProduct(null); 
    };

    const isReviewed = (productId, orderId) => {
        return userReviews.some((review) => review.product._id === productId && review.order._id === orderId);
    };
    

    return (
        <Fragment>
            <MetaData title={'Your Orders'} />
            <div className="container mt-4">
                <UserOrderNavigator />

                {loading ? (
                    <Loader />
                ) : error ? (
                    <p className="text-center text-danger">{error}</p>
                ) : (
                    <div>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order._id} className="order-item mb-4 p-4 border rounded shadow-sm">
                                    <h5 className="mb-3">Order ID: {order._id}</h5>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>Total Price: ₱{order.totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                            <p>Shipping Fee: ₱100</p>
                                            <p>Status: <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 
                                                order.status === 'Pending' ? 'bg-primary' : 
                                                order.status === 'Shipped' ? 'bg-warning' : ''}`}>
                                                {order.status}
                                            </span></p>
                                        </div>

                                        <div className="col-md-6">
                                            <h6>Products:</h6>
                                            <ul>
                                            {order.products.map((product) => {
                                                const productImage = product.productId.images && product.productId.images.length > 0
                                                    ? product.productId.images[0].url 
                                                    : 'https://via.placeholder.com/80'; 

                                                return (
                                                    <li key={product.productId._id} className="d-flex align-items-center mb-3">
                                                        {/* Product Image */}
                                                        <div className="d-flex justify-content-center align-items-center" style={{ flex: '0 0 100px', marginRight: '16px' }}>
                                                            <img
                                                                src={productImage}
                                                                alt={product.productId.name}
                                                                className="img-fluid"
                                                                style={{
                                                                    width: '70px',
                                                                    height: '70px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <strong>{product.productId.name}</strong> ({product.quantity}) - Price: ₱{product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                            {product.color && (
                                                                <div className="mt-2">
                                                                    <span className={`badge bg-dark text-light`} style={{ padding: '6px 12px' }}>
                                                                        {product.color}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {/* Display Already Reviewed text if product is already reviewed */}
                                                            {isReviewed(product.productId._id, order._id) && (
                                                                <div className="mt-2 text-success">
                                                                    <span className="badge bg-success text-light">Already Reviewed</span>
                                                                </div>
                                                            )}
                                                            <div className="mt-2 text-end">
                                                                {!isReviewed(product.productId._id, order._id) && (
                                                                    <button
                                                                        className="btn btn-outline-dark"
                                                                        onClick={() => handleRateClick(product.productId, order._id)}
                                                                    >
                                                                        Rate
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                            </ul>
                                        </div>
                                        <div className="text-end mt-3">
                                            <small className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</small>
                                        </div>
                                        <div className='text-start'>
                                            <hr />                                   
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-primary" role="alert">No Delivered Orders found.</div>
                        )}
                    </div>
                )}
            </div>

            {showModal && (
                <ReviewModal
                    show={showModal}
                    onClose={handleModalClose}
                    product={selectedProduct} // Passing selected product details
                    orderId={selectedOrderId} // Passing order ID
                    token={getToken()} // Passing token for authorization
                />
            )}
        </Fragment>
    );
};

export default OrderDelivered;
