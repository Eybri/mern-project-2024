import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import NewPassword from './pages/NewPassword';
import "react-toastify/dist/ReactToastify.css";
import Header from './components/Layout/Header'; 
import Footer from './components/Layout/Footer'; 
import Profile from './pages/Profile';
import ChangeProfile from './pages/ChangeProfile';
import ChangePassword from './pages/ChangePassword';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/Route/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';
import UpdateUser from './pages/admin/UpdateUser';
import CategoryList from './pages/admin/CategoryList';
import ProductList from './pages/admin/ProductList';
import NewProduct from './pages/admin/NewProduct';
import UpdateProduct from './pages/admin/UpdateProduct';
import OrderShipped from './pages/admin/orderShipped';
import OrderDelivered from './pages/admin/orderDelivered';
import OrderCancelled from './pages/admin/orderCancelled';

import Cart from './pages/user/cart';
import Shop from './pages/shop';
import OrderSummary from './pages/user/orderSummary';
import Orders from './pages/user/Orders';
import 'bootstrap-icons/font/bootstrap-icons.css';
import OrderList from './pages/admin/orderList';
import ReviewList from './pages/admin/ReviewList';

import OrderUserShipped from './pages/user/OrderShipped';
import OrderUserDelivered from './pages/user/OrderDelivered';
import OrderUserCancelled from './pages/user/OrderCancelled';
import OrderUserReviews from './pages/user/OrderReviews';
import ProductDetails from './pages/user/ProductDetails';


// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


function App() {
    return (
        <Router>
            <div id="root">
                <Header />
                <main>
                    <ToastContainer />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/password/forgot" element={<ForgotPassword />} />
                        <Route path="/password/reset/:token" element={<NewPassword />} />
                        <Route path="/me" element={<Profile />} />
                        <Route path="/me/update" element={<ChangeProfile />} />
                        <Route path="/password/update" element={<ChangePassword />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/orders/shipped" element={<OrderUserShipped />} />
                        <Route path="/orders/delivered" element={<OrderUserDelivered />} />
                        <Route path="/orders/cancelled" element={<OrderUserCancelled />} />
                        <Route path="/orders/reviews" element={<OrderUserReviews />} />
                        <Route path="/product/details/:id" element={<ProductDetails />} />

                        <Route
                            path="/admin/reviews"
                            element={
                                <ProtectedRoute isAdmin={true}>
                                    <ReviewList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/order/summary"
                            element={
                                <ProtectedRoute isUser={true}>
                                    <OrderSummary />
                                </ProtectedRoute>
                            }
                        />
                        {/* Admin Routes */}
                        <Route
                            path="admin/dashboard"
                            element={
                            <ProtectedRoute isAdmin={true}>
                                <AdminDashboard />
                            </ProtectedRoute>
                            }
                        />
                        <Route
                            path="admin/users"
                            element={
                            <ProtectedRoute isAdmin={true}>
                                <UserList />
                            </ProtectedRoute>
                            }
                        />
                        <Route path="/admin/user/:id" element={
                            <ProtectedRoute isAdmin={true}>
                                <UpdateUser />
                            </ProtectedRoute>} 
                            />
                        <Route
                            path="admin/categories"
                            element={
                            <ProtectedRoute isAdmin={true}>
                                <CategoryList />
                            </ProtectedRoute>
                            }
                        />
                        <Route
                            path="admin/products"
                            element={
                                <ProtectedRoute isAdmin={true}>
                                <ProductList />
                            </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <ProtectedRoute isAdmin={true}>
                                    <OrderList />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/admin/orders/shipped" element={
                            <ProtectedRoute isAdmin={true}>
                                <OrderShipped />
                            </ProtectedRoute>} 
                        />
                        <Route path="/admin/orders/delivered" element={
                            <ProtectedRoute isAdmin={true}>
                                <OrderDelivered />
                            </ProtectedRoute>} 
                        />
                        <Route path="/admin/orders/cancelled" element={
                            <ProtectedRoute isAdmin={true}>
                                <OrderCancelled />
                            </ProtectedRoute>} 
                        />
                        <Route path="/admin/product" element={
                            <ProtectedRoute isAdmin={true}>
                                <NewProduct />
                            </ProtectedRoute>} 
                        />
                        <Route path="/admin/product/:id" element={
                            <ProtectedRoute isAdmin={true}>
                                <UpdateProduct />
                            </ProtectedRoute>} 
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
        
    );
}

export default App;
