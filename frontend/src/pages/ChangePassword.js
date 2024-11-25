import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MetaData from '../components/Layout/Metadata';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../utils/helpers';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UpdatePassword = () => {
    const [error, setError] = useState('');
    const [, setIsUpdated] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updatePassword = async (formData) => {
        setLoading(true);
        setError('');
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.put(`http://localhost:4001/api/v1/password/update`, formData, config);
            setIsUpdated(data.success);
            toast.success('Password updated', {
                position: 'top-left',
            });
            navigate('/me');
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong. Please try again later.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'top-left',
            });
            setError('');
        }
    }, [error]);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            password: '',
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('*Old password is required'),
            password: Yup.string()
                .min(9, '*Password must be more than 8 characters')
                .required('*New password is required'),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.set('oldPassword', values.oldPassword);
            formData.set('password', values.password);
            updatePassword(formData);
        },
    });

    return (
        <Fragment>
            <MetaData title={'Change Password'} />
            <div className="container mt-5">
                <div className="col-10 col-lg-5 mx-auto">
                    <form className="shadow-lg p-4" onSubmit={formik.handleSubmit}>
                        <h1 className="mt-2 mb-4 text-center">Update Password</h1>
                        <div className="form-group">
                            <label htmlFor="old_password_field">Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control shadow-none black-border"
                                name="oldPassword"
                                value={formik.values.oldPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                            />
                            {formik.touched.oldPassword && formik.errors.oldPassword ? (
                                <div className="text-danger">{formik.errors.oldPassword}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control shadow-none black-border"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-danger">{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3 btn-dark" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdatePassword;
