import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const forgotPassword = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await axios.post(`http://localhost:4001/api/v1/password/forgot`, formData, config);
            
            const { success, token, message } = response.data;
    
            setLoading(false);
            
            if (success) {
                toast.success(message, {
                    position: 'bottom-right'
                });
                navigate(`/password/reset/${token}`); 
            }
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.error || 'An error occurred';
            toast.error(errorMessage, {
                position: 'bottom-right'
            });
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('email', email);
        setLoading(true);
        forgotPassword(formData);
    };

    return (
        <Fragment>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6 col-lg-5">
                        <form className="shadow-lg p-4" onSubmit={submitHandler} style={{ borderRadius: '8px' }}>
                            {/* Logo on top */}
                            <div className="text-center mb-4">
                                <img
                                    src="../images/logoletter.png" 
                                    alt="Logo"
                                    style={{ width: '380px' }} 
                                />
                            </div>
                            
                            {/* <h2 className="mb-3 text-center">Forgot Password</h2> */}
                            
                            <div className="form-group">
                                <label htmlFor="email_field">Send Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>

                            <button
                                id="forgot_password_button"
                                type="submit"
                                className="btn btn-dark btn-block py-3"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Email'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ForgotPassword;
