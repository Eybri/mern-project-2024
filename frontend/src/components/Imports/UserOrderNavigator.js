import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'; 
import MetaData from '../../components/Layout/Metadata';

const UserOrderNavigator = () => {
    return (
        <>
            <Fragment>
                <MetaData title={'Order Navigator'} />
                <div className="card status-user-card p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center m-2">
                        <div className="status-item text-center status-user-item">
                            <Link to="/orders" className="status-user-link text-dark">
                                <i className="bi bi-clock-fill status-user-icon"></i>
                            </Link>
                            <p>Pending</p>
                        </div>

                        <div className="status-item text-center status-user-item">
                            <Link to="/orders/shipped" className="status-user-link text-dark">
                                <i className="bi bi-box2-heart-fill status-user-icon"></i>
                            </Link>
                            <p>Shipped</p>
                        </div>

                        <div className="status-item text-center status-user-item">
                            <Link to="/orders/delivered" className="status-user-link text-dark">
                                <i className="bi bi-mailbox2-flag status-user-icon"></i>
                            </Link>
                            <p>Delivered</p>
                        </div>

                        <div className="status-item text-center status-user-item">
                            <Link to="/orders/reviews" className="status-user-link text-dark">
                                <i className="bi bi-chat-square-text-fill status-user-icon"></i>
                            </Link>
                            <p>Reviews</p>
                        </div>

                        <div className="status-item text-center status-user-item">
                            <Link to="/orders/cancelled" className="status-user-link text-dark">
                                <i className="bi bi-x-circle-fill status-user-icon"></i>
                            </Link>
                            <p>Cancelled</p>
                        </div>
                    </div>
                </div>
            </Fragment>
        </>
    );
};

export default UserOrderNavigator;
