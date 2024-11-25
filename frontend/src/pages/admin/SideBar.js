import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

const Sidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar-wrapper ${isOpen ? 'active' : ''}`}>
            <nav id="sidebar">
                <div className="sidebar-logo">
                    <img 
                        src="../../images/logobw2.png" 
                        alt="Sidebar Logo" 
                        className="img-fluid rounded-circle"
                    />
                    <button 
                        className="btn collapse-toggle d-md-none" 
                        onClick={toggleSidebar}
                    >
                        <i className="fa fa-bars"></i>
                    </button>
                </div>
                <ul className="list-unstyled components">
                    <li className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
                        <Link to="/admin/dashboard">
                            <i className="fa fa-tachometer"></i> 
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <a href="#productSubmenu" data-bs-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                            <i className="bi bi-tag-fill"></i> 
                            <span>Categories</span>
                        </a>
                        <ul className="collapse list-unstyled" id="productSubmenu">
                            <li className={location.pathname === '/admin/categories' ? 'active' : ''}>
                                <Link to="/admin/categories">
                                    <i className="bi bi-tags-fill"></i> 
                                    <span>All</span>
                                </Link>
                            </li>
                            <li className={location.pathname === '/admin/products' ? 'active' : ''}>
                                <Link to="/admin/products">
                                    <i className="fa fa-plus"></i> 
                                    <span>Products</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className={location.pathname === '/admin/orders' ? 'active' : ''}>
                        <Link to="/admin/orders">
                            <i className="fa fa-shopping-basket"></i> 
                            <span>Orders</span>
                        </Link>
                    </li>
                    <li className={location.pathname === '/admin/users' ? 'active' : ''}>
                        <Link to="/admin/users">
                            <i className="fa fa-users"></i> 
                            <span>Users</span>
                        </Link>
                    </li>
                    <li className={location.pathname === '/admin/reviews' ? 'active' : ''}>
                        <Link to="/admin/reviews">
                            <i className="fa fa-star"></i> 
                            <span>Reviews</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
