import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Loader from '../components/Layout/Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { authenticate, getUser } from '../utils/helpers';
import MetaData from '../components/Layout/Metadata';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { auth } from '../firebase-config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '';

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required')
        }),
        onSubmit: async (values) => {
            const { email, password } = values;
            try {
                setLoading(true);
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const { data } = await axios.post(`http://localhost:4001/api/v1/login`, { email, password }, config);
                
                authenticate(data, () => {
                    toast.success('Logged in successfully!', {
                        position: 'bottom-right'
                    });
                    localStorage.setItem('loginSuccess', 'true');
                    navigate(redirect || "/");
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                });

            } catch (error) {
                toast.error(error.response?.data?.message || "Invalid user or password", {
                    position: 'bottom-right'
                });
            } finally {
                setLoading(false);
            }
        }
    });

    useEffect(() => {
        if (getUser() && redirect === 'shipping') {
            navigate(`/${redirect}`);
        }
    }, [navigate, redirect]);
    

    // Google Sign-In function
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            const userData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                password: 'somePassword'  
            };
    
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
    
            const { data: existingUserData } = await axios.post('http://localhost:4001/api/v1/check-user', { email: user.email }, config);
    
            if (existingUserData.exists) {
                const loginData = {
                    email: user.email,
                    password: 'somePassword' 
                };
    
                const { data: loginResponse } = await axios.post('http://localhost:4001/api/v1/login', loginData, config);
    
                if (loginResponse.success) {
                    localStorage.setItem('authToken', loginResponse.token);
                    toast.success(`Welcome back, ${user.displayName}`, { position: 'bottom-right' });
    
                    authenticate(loginResponse, () => {
                        // toast.success('Logged in successfully!', {
                        //     position: 'bottom-right'
                        // });
                        localStorage.setItem('loginSuccess', 'true');
                        navigate(redirect || "/");
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    });
                } 
                // else {
                //     toast.error("Login failed. Please try again.", { position: 'bottom-right' });
                // }
            } else {
                const { data: registerResponse } = await axios.post('http://localhost:4001/api/v1/register', userData, config);
    
                if (registerResponse.success) {
                    localStorage.setItem('authToken', registerResponse.token);
                    toast.success(`Welcome, ${user.displayName}`, { position: 'bottom-right' });
    
                    authenticate(registerResponse, () => {
                        // toast.success('Logged in successfully!', {
                        //     position: 'bottom-right'
                        // });
                        localStorage.setItem('loginSuccess', 'true');
                        navigate(redirect || "/");
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    });
                } 
                // else {
                //     toast.error("Registration failed. Please try again.", { position: 'bottom-right' });
                // }
            }
    
        } catch (error) {
            // toast.warning("Roror", { position: 'bottom-right' });
        }
    };
    
    
    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Login'} />
                    <div className="container">
                        <div className="row justify-content-center align-items-center mt-5">
                            <div className="col-md-8 d-flex shadow-lg p-0" style={{ borderRadius: '15px' }}>
                                
                                <div className="col-5 d-none d-md-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px' }}>
                                    <div className="text-center my-5">
                                        <img
                                            src="../images/AFlogo-nobg.png"
                                            alt="Logo"
                                            className="img-fluid"
                                            style={{ width: '100%', maxWidth: '250px' }}
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-7 p-5">
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="email_field">Email</label>
                                            <input
                                                type="email"
                                                id="email_field"
                                                className="form-control"
                                                {...formik.getFieldProps('email')}
                                                placeholder="Enter your email"
                                            />
                                            {formik.touched.email && formik.errors.email ? (
                                                <div className="text-danger">{formik.errors.email}</div>
                                            ) : null}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password_field">Password</label>
                                            <input
                                                type="password"
                                                id="password_field"
                                                className="form-control"
                                                {...formik.getFieldProps('password')}
                                                placeholder="Enter your password"
                                            />
                                            {formik.touched.password && formik.errors.password ? (
                                                <div className="text-danger">{formik.errors.password}</div>
                                            ) : null}
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <Link to="/password/forgot" className="text-muted">Forgot Password?</Link>
                                        </div>

                                        <button
                                            id="login_button"
                                            type="submit"
                                            className="btn btn-dark btn-block py-3 rounded-pill"
                                            disabled={loading}
                                        >
                                            LOGIN
                                        </button>

                                        <div className="d-flex justify-content-center mt-4">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary py-3 px-4 w-100 rounded-pill shadow-lg"
                                                onClick={handleGoogleSignIn}
                                            >
                                                <i className="bi bi-google"></i> Sign in with Google
                                            </button>
                                        </div>


                                        <div className="text-center mt-4">
                                            <Link to="/register" className="text-muted">New User? Register Here</Link>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                    
                </Fragment>
            )}
        </Fragment>
    );
};

export default Login;
