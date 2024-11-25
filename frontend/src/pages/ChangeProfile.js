import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../components/Layout/Metadata';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../utils/helpers';

const UpdateProfile = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')
    // const [error, setError] = useState('')
    const [user,] = useState({})
    const [loading, setLoading] = useState(false)
    const [, setIsUpdated] = useState(false)
    let navigate = useNavigate();

    const getProfile = async () => {
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.get(`http://localhost:4001/api/v1/me`, config)
            console.log(data)
            // setUser(data.user)
            setName(data.user.name);
            setEmail(data.user.email);
            setAvatarPreview(data.user.avatar.url)
            setLoading(false)
        } catch (error) {
            toast.error('user not found', {
                position: 'bottom-left',
            });
        }
    }

    const updateProfile = async (userData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.put(`http://localhost:4001/api/v1/me/update`, userData, config)
            setIsUpdated(data.success)
            setLoading(false)
            toast.success('user updated', {
                position: 'bottom-left',
            });
            //  getProfile();
            navigate('/me', { replace: true })


        } catch (error) {
            console.log(error)
            toast.error('user not found', {
                position: 'bottom-left',
            });
        }
    }

    useEffect(() => {
        const token = getToken(); 
        if (!token) {
            navigate('/login');
        } else {
            getProfile()
        }
    }, [navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatar', avatar);
        updateProfile(formData)
    }

    const onChange = e => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(e.target.files[0])

    }
    console.log(user)
    return (
        <Fragment>
            <MetaData title={'Update Profile'} />

            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <form className="shadow-lg p-4" onSubmit={submitHandler} encType='multipart/form-data'>
                            <h1 className="text-center mb-4">Update Profile</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control shadow-none black-border"
                                    name='name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control shadow-none black-border"
                                    name='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor='avatar_upload'>Avatar</label>
                                <div className='d-flex align-items-center'>
                                    <div className='mr-3'>
                                        <figure className='avatar'>
                                            <img
                                                src={avatarPreview}
                                                className='rounded-circle'
                                                alt='Avatar Preview'
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        </figure>
                                    </div>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='avatar'
                                            className='custom-file-input'
                                            id='customFile'
                                            accept='image/*'
                                            onChange={onChange}
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Choose Avatar
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-dark btn-block mt-4" disabled={loading}>
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateProfile;
