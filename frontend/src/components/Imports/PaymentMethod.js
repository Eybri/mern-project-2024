import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/helpers'; // Adjust path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Loader from '../../components/Layout/Loader'; // Import your Loader component

const PaymentMethod = () => {
    const [paymentMethod, setPaymentMethod] = useState('cashondelivery');
    const [loading, setLoading] = useState(false); // Loading state

    const initialValues = {
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    };

    const validationSchema = Yup.object({
        cardNumber: Yup.string()
            .matches(/^[0-9]{13,16}$/, 'Card number must be 13 to 16 digits')
            .required('Card number is required'),
        expiryDate: Yup.string().required('Expiry date is required'),
        cvv: Yup.string()
            .matches(/^[0-9]{3}$/, 'CVV must be exactly 3 digits')
            .required('CVV is required')
    });

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleCheckout = async (values) => {
        setLoading(true); // Start loading when checkout starts

        try {
            const token = getToken();
            const decodedToken = JSON.parse(atob(token.split('.')[1])); 
            const userId = decodedToken.id; 
            const checkoutData = {
                userId, 
                paymentMethod,
                paymentDetails: paymentMethod === 'creditcard' ? values : null
            };

            const response = await axios.post('http://localhost:4001/api/v1/orders/create', checkoutData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload();
            toast.success("Order created successfully!");
            console.log('Order response:', response.data);

        } catch (error) {
            console.error('Error creating order:', error.response ? error.response.data : error);
            toast.error('There was an issue with your checkout. Please try again.');
        } finally {
            setLoading(false); // Stop loading after the API call completes (success or failure)
        }
    };

    return (
        <div className="col-md-10">
            <ToastContainer />
            <div className="card shadow-sm mb-4" style={{ borderRadius: '0px' }}>
                <div className="card-body">
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="form-check me-5">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id="paymentMethod1"
                                value="cashondelivery"
                                checked={paymentMethod === 'cashondelivery'}
                                onChange={handlePaymentMethodChange}
                            />
                            <label className="form-check-label" htmlFor="paymentMethod1">
                                COD <i className="bi bi-truck"></i>
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id="paymentMethod2"
                                value="creditcard"
                                checked={paymentMethod === 'creditcard'}
                                onChange={handlePaymentMethodChange}
                            />
                            <label className="form-check-label" htmlFor="paymentMethod2">
                                Card <i className="bi bi-credit-card-fill"></i>
                            </label>
                        </div>
                    </div>

                    {loading && <Loader />} {/* Show Loader when loading is true */}

                    {paymentMethod === 'creditcard' && (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleCheckout}
                        >
                            {({ errors, touched }) => (
                                <Form className="mt-4">
                                    <div className="form-group">
                                        <label htmlFor="cardNumber">Card Number</label>
                                        <Field
                                            type="text"
                                            className={`form-control ${errors.cardNumber && touched.cardNumber ? 'is-invalid' : ''}`}
                                            id="cardNumber"
                                            name="cardNumber"
                                            placeholder="Enter your card number"
                                        />
                                        <ErrorMessage name="cardNumber" component="div" className="invalid-feedback" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="expiryDate">Expiry Date</label>
                                        <Field
                                            type="month"
                                            className={`form-control ${errors.expiryDate && touched.expiryDate ? 'is-invalid' : ''}`}
                                            id="expiryDate"
                                            name="expiryDate"
                                        />
                                        <ErrorMessage name="expiryDate" component="div" className="invalid-feedback" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cvv">CVV</label>
                                        <Field
                                            type="text"
                                            className={`form-control ${errors.cvv && touched.cvv ? 'is-invalid' : ''}`}
                                            id="cvv"
                                            name="cvv"
                                            placeholder="Enter CVV"
                                        />
                                        <ErrorMessage name="cvv" component="div" className="invalid-feedback" />
                                    </div>

                                    <div className="mt-3 text-start">
                                        <button type="submit" className="btn btn-dark btn-block">
                                            Check Out
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}

                    {paymentMethod === 'cashondelivery' && (
                        <div className="mt-3 text-start">
                            <button onClick={handleCheckout} className="btn btn-dark btn-block">
                                Check Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PaymentMethod;
