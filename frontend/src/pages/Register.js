import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name = '', email = '', password = '' } = user || {};

    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        if (error) {
            toast.error(error, { position: 'bottom-right' });
            setError(null);
        }
    }, [error, isAuthenticated, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('avatar', avatar);

        register(formData);
    };

    const onChange = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post(`http://localhost:4001/api/v1/register`, userData, config);
            setIsAuthenticated(true);
            toast.success('Registered successfully!', { position: 'bottom-right' });
            setUser(data.user);
            navigate('/');
        } catch (error) {
            setIsAuthenticated(false);
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <div className="container mt-2 mb-2">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5">
                        <form
                            className="shadow-lg p-4"
                            onSubmit={submitHandler}
                            encType="multipart/form-data"
                            style={{ borderRadius: '8px', backgroundColor: '#f8f9fa' }}
                        >
                            <div className="text-center mb-4">
                                <img
                                    src="../images/logoletter.png"
                                    alt="Logo"
                                    style={{ width: '380px' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password_field">Password</label>
                                <input
                                    type="password"
                                    id="password_field"
                                    className="form-control"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="avatar_upload">Avatar</label>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <figure className="avatar mr-3 item-rtl">
                                            <img
                                                src={avatarPreview}
                                                className="rounded-circle"
                                                alt="Avatar Preview"
                                                style={{ width: '60px', height: '60px' }}
                                            />
                                        </figure>
                                    </div>
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            name="avatar"
                                            className="custom-file-input"
                                            id="customFile"
                                            accept="image/*"
                                            onChange={onChange}
                                            required
                                        />
                                        <label className="custom-file-label" htmlFor="customFile">
                                            Choose Avatar
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button
                                id="register_button"
                                type="submit"
                                className="btn btn-dark btn-block py-3"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Register;
