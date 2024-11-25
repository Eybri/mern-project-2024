import React, { Fragment, useState } from 'react';
import MetaData from '../../components/Layout/Metadata';
import Loader from '../../components/Layout/Loader'; 
import UserOrderNavigator from '../../components/Imports/UserOrderNavigator'; 
import useOrders from '../../components/Hooks/UserOrders'; 
import { getToken } from '../../utils/helpers';
import axios from 'axios';

const Orders = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [note, setNote] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
    const [, setOrders] = useState([]);

    const cancellationReasons = [
        'Ordered by mistake',
        'Found a better price elsewhere',
        'Item is not needed anymore',
        'Change in delivery address',
        'Other'
    ];

    const { loading, orders, error } = useOrders('Pending'); 

    const handleCancelOrder = async () => {
        if (!selectedReason.trim()) {
            alert('Please select a reason for cancellation.');
            return;
        }
    
        if (!note.trim()) {
            alert('Please provide additional details.');
            return;
        }
    
        const fullNote = `${selectedReason}: ${note}`;
    
        try {
            const token = getToken();
            await axios.put(
                'http://localhost:4001/api/v1/admin/orders/update',
                { orderId: selectedOrderId, status: 'Cancelled', note: fullNote },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            setOrders(orders.filter(order => order._id !== selectedOrderId));
            alert('Order cancelled successfully, and stock updated.');
            setShowModal(false);
            setSelectedReason('');
            setNote('');
        } catch (err) {
            // setError(err.response?.data?.message || 'Failed to cancel order');
        }
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
                                            <button 
                                                className='btn btn-danger' 
                                                onClick={() => {
                                                    setSelectedOrderId(order._id);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Cancel Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-primary" role="alert">No Pending Orders found.</div>
                        )}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cancel Order</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <label>Select a reason for cancellation:</label>
                                <select 
                                    className="form-select mb-3"
                                    value={selectedReason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                >
                                    <option value="">-- Select Reason --</option>
                                    {cancellationReasons.map((reason, index) => (
                                        <option key={index} value={reason}>{reason}</option>
                                    ))}
                                </select>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Provide additional details (optional)..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={handleCancelOrder}
                                >
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default Orders;
