import React, { Fragment } from 'react';
import MetaData from '../../components/Layout/Metadata';
import Loader from '../../components/Layout/Loader'; 
import UserOrderNavigator from '../../components/Imports/UserOrderNavigator'; 
import useOrders from '../../components/Hooks/UserOrders'; 

const OrderShipped = () => {
    

    const { loading, orders, error } = useOrders('Shipped'); 

   

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
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-primary" role="alert">No Shipped Orders found.</div>
                        )}
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default OrderShipped;
