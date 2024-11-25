import React from 'react';

const OrderNavigator = () => {
  return (
    <div className="card mx-auto mt-5" style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <div className="card-body">
        <h5 className="card-title text-center mb-4">Order Status</h5>
        <div className="d-flex justify-content-between">
          <div className="nav flex-column flex-sm-row w-100">
            <a href="/admin/orders" className="nav-link text-center py-2 px-4 mx-2 rounded-pill text-primary border">
            <i className="bi bi-arrow-clockwise"></i> Pending Request
            </a>
            <a href="/admin/orders/shipped" className="nav-link text-center py-2 px-4 mx-2 rounded-pill text-secondary border">
            <i className="bi bi-truck"></i> To Ship
            </a>
            <a href="/admin/orders/delivered" className="nav-link text-center py-2 px-4 mx-2 rounded-pill text-success border">
            <i className="bi bi-send-check-fill"></i> Success
            </a>
            <a href="/admin/orders/cancelled" className="nav-link text-center py-2 px-4 mx-2 rounded-pill text-danger border">
            <i className="bi bi-x-circle-fill"></i> Cancelled
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderNavigator;
