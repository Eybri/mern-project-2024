import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../../components/Layout/Metadata';
import Loader from '../../components/Layout/Loader';
import Sidebar from './SideBar';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import MUIDataTable from 'mui-datatables';
import 'react-toastify/dist/ReactToastify.css';

const UserList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showUsers, setAllUsers] = useState([]);

    const config = useMemo(() => ({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }), []);

    const listUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:4001/api/v1/admin/users`, config);
            setAllUsers(data.users);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching users');
            setLoading(false);
        }
    }, [config]);

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        setLoading(true);
        try {
            await axios.delete(`http://localhost:4001/api/v1/admin/user/${id}`, config);
            toast.success('User deleted successfully!', { position: 'bottom-right' });
            setAllUsers(prev => prev.filter(user => user._id !== id)); // Update state to remove deleted user
        } catch (error) {
            toast.error(error.response?.data.message || 'Failed to delete user', { position: 'bottom-right' });
        } finally {
            setLoading(false);
        }
    };

    const deleteUserHandler = (id) => deleteUser(id);

    const columns = [
        {
            name: 'avatar',
            label: 'Profile',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    const user = showUsers[tableMeta.rowIndex];
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={user.avatar?.url}
                                alt="User Avatar"
                                style={{ width: 50, height: 50, borderRadius: '50%', marginRight: 10 }}
                            />
                            <div>
                                <div>{user.name}</div>
                                <div style={{ fontSize: '0.9em', color: '#666' }}>{user.email}</div>
                            </div>
                        </div>
                    );
                }
            }
        },
        { name: 'role', label: 'Role', options: { sort: true } },
        {
            name: 'actions',
            label: 'Actions',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    const userId = showUsers[tableMeta.rowIndex]._id;
                    return (
                        <Fragment>
                            <Link to={`/admin/user/${userId}`} className="btn btn-warning py-1 px-2">
                                <i className="bi bi-pencil-square"></i>
                            </Link>
                            <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteUserHandler(userId)}>
                                <i className="bi bi-trash3-fill"></i>
                            </button>
                        </Fragment>
                    );
                }
            }
        },
    ];

    const data = showUsers.map(user => ({
        avatar: user.avatar, 
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.shippingInfo?.address || '',
        city: user.shippingInfo?.city || '',
        phoneNo: user.shippingInfo?.phoneNo || '',
        postalCode: user.shippingInfo?.postalCode || '',
        country: user.shippingInfo?.country || ''
    }));

    const options = {
        filterType: 'dropdown',
        responsive: 'vertical',
        pagination: true,
        selectableRows: 'none',
        rowsPerPageOptions: [5, 10, 20, 50],
        page: 0,
        download: false,
        print: false,
        expandableRows: true,
        expandableRowsHeader: false,
        expandableRowsOnClick: true,
        renderExpandableRow: (rowData, rowMeta) => {
            const user = showUsers[rowMeta.dataIndex];
            return (
                <tr>
                    <td colSpan={columns.length}>
                        <div className="expandable-row">
                            <h4 className="product-details">Shipping Information</h4>
                            {user.shippingInfo?.address || user.shippingInfo?.city || user.shippingInfo?.phoneNo || user.shippingInfo?.postalCode || user.shippingInfo?.country ? (
                                <div className="product-details">
                                    <p><strong>Address:</strong> {user.shippingInfo?.address || 'N/A'}</p>
                                    <p><strong>City:</strong> {user.shippingInfo?.city || 'N/A'}</p>
                                    <p><strong>Phone No:</strong> {user.shippingInfo?.phoneNo || 'N/A'}</p>
                                    <p><strong>Postal Code:</strong> {user.shippingInfo?.postalCode || 'N/A'}</p>
                                    <p><strong>Country:</strong> {user.shippingInfo?.country || 'N/A'}</p>
                                </div>
                            ) : (
                                <span className="badge rounded-pill text-bg-warning">User did not input any shipping information yet.</span>
                            )}
                        </div>
                    </td>
                </tr>
            );
            
            
        }
    };

    useEffect(() => {
        listUsers();

        if (error) {
            toast.error(error, { position: 'bottom-right' });
            setError('');
        }
    }, [error, listUsers]);

    return (
        <Fragment>
            <MetaData title={'All Users'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-9">
                    <Fragment>
                    <div className="table-container">
                        <h1 className="my-5">All Users</h1>
                        {loading ? <Loader /> : (
                            <MUIDataTable
                                title={"User List"}
                                columns={columns}
                                data={data}
                                options={options}
                                className="table-header"
                            />
                        )}
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default UserList;
