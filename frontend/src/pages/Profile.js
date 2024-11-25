import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Layout/Loader';
import MetaData from '../components/Layout/Metadata';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../utils/helpers';
import ShippingInfo from '../components/Imports/Shippinginfo'; 

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState('');
    const navigate = useNavigate();

    const getProfile = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        };
        try {
            const { data } = await axios.get(`http://localhost:4001/api/v1/me`, config);
            console.log(data);
            setUser(data.user);
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", {
                position: 'top-right',
            });
        }
    };

    useEffect(() => {
        const token = getToken(); 
        if (!token) {
            navigate('/login');
        } else {
            getProfile(); 
        }
    }, [navigate]);

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Your Profile'} />

                    <h2 className="mt-5 text-center">My Profile</h2>
                    <div className="container mt-5">
                        <div className="row justify-content-center">
                            {/* 1 Column */}
                            <div className="col-md-5">
                                <div className="card shadow-sm mb-4">
                                    <div className="card-body">
                                        <h4>Full Name</h4>
                                        <p>{user.name}</p>

                                        <h4>Email Address</h4>
                                        <p>{user.email}</p>

                                        <h4>Joined On</h4>
                                        <p>{String(user.createdAt).substring(0, 10)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="card shadow-sm mb-4 text-center">
                                    <div className="card-body">
                                        <figure className='avatar avatar-profile'>
                                            <img className="rounded-circle img-fluid" src={user.avatar?.url} alt={user.name} />
                                        </figure>
                                        <Link to="/me/update" id="edit_profile" className="btn btn-dark btn-block">
                                        <i className="bi bi-pencil-square"></i> Edit Profile
                                        </Link>
                                        <Link to="/password/update" className="btn btn-danger btn-block mt-3">
                                            <i class="bi bi-shield-lock-fill"></i> Change Password
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ShippingInfo user={user} setUser={setUser} />
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Profile;
