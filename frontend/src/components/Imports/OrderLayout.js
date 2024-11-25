import React from 'react';
import Sidebar from '../../pages/admin/SideBar';
import MetaData from '../../components/Layout/Metadata';
import OrderNavigator from '../../components/Imports/OrderNavigator';

const OrderLayout = ({ children, title }) => {
    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-9">
                <MetaData title={title} />
                <div className="container-fluid">
                    <OrderNavigator />
                    {children}
                </div>
            </div>
        </div>
    );
};

export default OrderLayout;
