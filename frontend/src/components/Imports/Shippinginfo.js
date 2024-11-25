import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getToken } from '../../utils/helpers';

const ShippingInfo = ({ user, setUser }) => {
    const [shippingInfo, setShippingInfo] = useState({
        address: user?.shippingInfo?.address || '',
        city: user?.shippingInfo?.city || '',
        phoneNo: user?.shippingInfo?.phoneNo || '',
        postalCode: user?.shippingInfo?.postalCode || '',
        country: user?.shippingInfo?.country || '',
    });

    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo({ ...shippingInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            }
        };

        try {
            const { data } = await axios.put(`http://localhost:4001/api/v1/me/shipping`, shippingInfo, config);
            toast.success(data.message);
            setUser(prev => ({
                ...prev,
                shippingInfo: data.shippingInfo,
            }));
            setShowModal(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update shipping information", {
                position: 'top-right',
            });
        }
    };

    const handleOpenModal = () => {
        setShippingInfo({
            address: user.shippingInfo?.address || '',
            city: user.shippingInfo?.city || '',
            phoneNo: user.shippingInfo?.phoneNo || '',
            postalCode: user.shippingInfo?.postalCode || '',
            country: user.shippingInfo?.country || '',
        });
        setShowModal(true);
    };

    return (
        <div className="row justify-content-center mb-4 mt-1">
            <div className="col-md-10">
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h4>Shipping Information</h4>
                        {user.shippingInfo && Object.keys(user.shippingInfo).length > 0 && Object.values(user.shippingInfo).some(value => value) ? (
                            <div>
                                <p><strong>Address:</strong> {user.shippingInfo.address}</p>
                                <p><strong>City:</strong> {user.shippingInfo.city}</p>
                                <p><strong>Phone No:</strong> {user.shippingInfo.phoneNo}</p>
                                <p><strong>Postal Code:</strong> {user.shippingInfo.postalCode}</p>
                                <p><strong>Country:</strong> {user.shippingInfo.country}</p>
                                <button className="btn btn-dark btn-block mt-3" onClick={handleOpenModal}>
                                    <i className="bi bi-pencil-square"></i> Update Shipping Information
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className='text-danger'>No shipping information available.</p>
                                <button className="btn btn-dark btn-block mt-3" onClick={handleOpenModal}>
                                    Add Shipping Information
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for add and update */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Shipping Information</h5>
                            <button type="button" className="close" onClick={() => setShowModal(false)}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="city"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNo">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phoneNo"
                                        name="phoneNo"
                                        value={shippingInfo.phoneNo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="postalCode"
                                        name="postalCode"
                                        value={shippingInfo.postalCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="country"
                                        name="country"
                                        value={shippingInfo.country}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-dark btn-block mt-3">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for Modal */}
            {showModal && <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>}
        </div>
    );
};

export default ShippingInfo;
