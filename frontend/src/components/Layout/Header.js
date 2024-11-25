import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, logout, getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../App.css'; 

const Header = () => {
    const [user, setUser] = useState(null);
    const [cartItemCount, setCartItemCount] = useState(0);  
    const [isScrolled, setIsScrolled] = useState(false); 
    const navigate = useNavigate();
    const location = useLocation();
    const hasFetched = useRef(false);  

    // Logout function
    const logoutUser = async () => {
        try {
            await axios.post(`http://localhost:4001/api/v1/logout`);
            setUser(null);
            logout(() => navigate('/'));
            toast.success('Logged out successfully', { position: 'bottom-right' });
            window.location.reload();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0); 
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (hasFetched.current) return;  
        hasFetched.current = true;

        const currentUser = getUser();
        if (!currentUser) return; 

        setUser(currentUser); 

        const fetchCartCount = async () => {
            try {
                const response = await axios.get('http://localhost:4001/api/v1/cart/count', {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                setCartItemCount(response.data.cartItemCount);
            } catch (error) {
                console.error('Error fetching cart count:', error);
                setCartItemCount(0);  // Reset to 0 on error
            }
        };

        fetchCartCount(); // Call the function to fetch cart count
    }, []);  // Empty dependency array means this effect runs once after initial render

    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <nav
            className={`navbar navbar-expand-lg ${isAdminRoute ? 'bg-dark admin-header' : 'bg-body-tertiary'} ${isScrolled ? 'scrolled' : ''}`}
            style={{
                borderBottom: isAdminRoute ? 'none' : 'solid 1px black',
                boxShadow: isAdminRoute ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none'
            }}
        >
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <img
                        src={isAdminRoute ? "../../images/admin.png" : "../../images/logoletter.png"}
                        alt="Ayhea Folk Logo"
                        className="logo"
                        width="300"
                    />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        {!isAdminRoute && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link header-nav active" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link header-nav" to="/Shop">Shop</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link header-nav" to="/pricing">Collections</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="d-flex align-items-center ms-auto">
                        {!isAdminRoute && (
                            <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
                                <i className="fa fa-shopping-bag ml-3" style={{ fontSize: '26px', color: 'black' }}></i>
                                <span
                                    className="badge"
                                    id="cart_count"
                                    style={{
                                        position: 'absolute',
                                        top: '-5px', 
                                        right: '-10px', 
                                        fontSize: '13px', 
                                        backgroundColor: 'white',
                                        color: 'black',
                                        borderRadius: '50%',
                                        padding: '2px 5px',
                                        border: '1px solid black'
                                    }}
                                >
                                    {cartItemCount}
                                </span>
                            </Link>
                        )}
                        <div className="ms-auto">
                            {user ? (
                                <div className="dropdown ms-3">
                                    <Link
                                        to="#!"
                                        className={`btn dropdown-toggle ${isAdminRoute ? 'text-light' : 'text-dark'} d-flex align-items-center`}
                                        id="dropDownMenuButton"
                                        data-toggle="dropdown"
                                    >
                                        <figure className="avatar avatar-nav mb-0">
                                            <img src={user.avatar?.url} alt={user.name} className="rounded-circle" style={{ width: '30px', height: '30px' }} />
                                        </figure>
                                        <span className="ml-2 text-light">{user.name}</span>
                                    </Link>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="/me"><i className="bi bi-person-fill"></i> View Profile</Link>
                                        {user.role === 'admin' && <Link className="dropdown-item" to="admin/dashboard"><i className="bi bi-database-fill-dash"></i> Dashboard</Link>}
                                        <Link className="dropdown-item" to="/orders"><i className="bi bi-cart-check-fill"></i> Order Status</Link>
                                        <Link className="dropdown-item text-danger" to="/" onClick={logoutUser}>Logout</Link>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="btn btn-dark ms-3" id="login_btn">Login</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
