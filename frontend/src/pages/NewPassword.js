import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const NewPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    let navigate = useNavigate();
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    let { token } = useParams();

    const resetPassword = async (token, passwords) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const { data } = await axios.put(`http://localhost:4001/api/v1/password/reset/${token}`, passwords, config)
            setSuccess(data.success)
        } catch (error) {
            setError(error.response.data.message); // Ensure we display the actual error message
        }
    }

    useEffect(() => {
        if (error) {
            toast.error(error, { // Display the error message in toast
                position: 'bottom-right'
            });
        }
        if (success) {
            toast.success('Password updated successfully', {
                position: 'bottom-right'
            });
            navigate('/login');
        }
    }, [error, success, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = {
            password,
            confirmPassword
        };
        resetPassword(token, formData);
    }

    return (
        <Fragment>
            <div className="container mt-5"style={{borderRadius:'24px'}}>
                <div className="col-10 col-lg-5 mx-auto">
                    <form className="shadow-lg border rounded p-4" onSubmit={submitHandler}>
                        {/* <h1 className="mb-4 text-center text-dark">Set New Password</h1> */}

                        {/* Logo on top */}
                        <div className="text-center mb-4">
                            <img
                                src="../../images/logoletter.png" 
                                alt="Logo"
                                style={{ width: '380px' }} 
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password_field" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control shadow-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label htmlFor="confirm_password_field" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                className="form-control shadow-none"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                required
                            />
                        </div>

                        <button
                            id="new_password_button"
                            type="submit"
                            className="btn btn-dark btn-block py-3"
                        >
                            Set Password
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default NewPassword;
