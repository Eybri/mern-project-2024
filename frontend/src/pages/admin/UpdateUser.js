import React, { Fragment, useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import MetaData from '../../components/Layout/Metadata';
import Sidebar from './SideBar';
import {successMsg } from '../../utils/helpers';
import { getToken } from '../../utils/helpers';
import axios from 'axios';

const UpdateUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        address: '',
        city: '',
        phoneNo: '',
        postalCode: '',
        country: ''
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const config = useMemo(() => ({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }), []);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4001/api/v1/admin/user/${id}`, config);
                const user = data.user;
                setFormData({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    address: user.shippingInfo?.address || '',
                    city: user.shippingInfo?.city || '',
                    phoneNo: user.shippingInfo?.phoneNo || '',
                    postalCode: user.shippingInfo?.postalCode || '',
                    country: user.shippingInfo?.country || ''
                });
                setLoading(false);
            } catch (error) {
                setError(error.response.data.message);
                setLoading(false);
            }
        };

        getUserDetails();
    }, [id, config]);

    useEffect(() => {
        if (isUpdated) {
            successMsg('User updated successfully');
            navigate('/admin/users');
        }
    }, [isUpdated, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`http://localhost:4001/api/v1/admin/user/${id}`, formData, config);
            setIsUpdated(data.success);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const hasShippingDetails = formData.address || formData.city || formData.phoneNo || formData.postalCode || formData.country;

    return (
        <Fragment>
            <MetaData title={`Update User`} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-9 mt-5 mb-4">
                    <div className="row wrapper">
                        <div className="col-lg-4"> {/* Thinner user details column */}
                            <div className="card shadow-lg mb-4" style={{ height: 'auto' }}>
                                <div className="card-body">
                                    <h1 className="mt-2 mb-5">User Information</h1>
                                    {error && <p className="alert alert-danger">{error}</p>}
                                    <form onSubmit={submitHandler}>
                                        <div className="form-group">
                                            <label htmlFor="name_field">Name</label>
                                            <input
                                                type="text"
                                                id="name_field"
                                                className="form-control shadow-none"
                                                name='name'
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email_field">Email</label>
                                            <input
                                                type="email"
                                                id="email_field"
                                                className="form-control shadow-none"
                                                name='email'
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="role_field">Role</label>
                                            <select
                                                id="role_field"
                                                className="form-control"
                                                name='role'
                                                value={formData.role}
                                                onChange={handleChange}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8"> {}
                        <div className="card shadow-lg mb-4" style={{ height: 'auto' }}>
                                <div className="card-body">
                                    <h1 className="mt-2 mb-5">Shipping Information</h1>
                                    {!hasShippingDetails && <p className="alert alert-warning">The user did not add Shipping details</p>}
                                    <form onSubmit={submitHandler}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="address_field">Address</label>
                                                    <input
                                                        type="text"
                                                        id="address_field"
                                                        className="form-control shadow-none"
                                                        name='address'
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="city_field">City</label>
                                                    <input
                                                        type="text"
                                                        id="city_field"
                                                        className="form-control shadow-none"
                                                        name='city'
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="phoneNo_field">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        id="phoneNo_field"
                                                        className="form-control shadow-none"
                                                        name='phoneNo'
                                                        value={formData.phoneNo}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="postalCode_field">Postal Code</label>
                                                    <input
                                                        type="text"
                                                        id="postalCode_field"
                                                        className="form-control shadow-none"
                                                        name='postalCode'
                                                        value={formData.postalCode}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="country_field">Country</label>
                                                    <input
                                                        type="text"
                                                        id="country_field"
                                                        className="form-control shadow-none"
                                                        name='country'
                                                        value={formData.country}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            id="update_button"
                                            type="submit"
                                            className="btn btn-dark mt-4"
                                            disabled={loading}
                                        >
                                            {loading ? 'Updating...' : 'Update'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateUser;
