import React, { useState } from 'react';
import Loader from '../../components/Layout/Loader';
import OrderLayout from '../../components/Imports/OrderLayout';
import { useOrders, useDeleteOrder } from '../../components/Hooks/RudOrders';
import { 
    TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse, Typography, Paper, Select, MenuItem, TablePagination 
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { toast } from 'react-toastify';

const statusColors = {
    Pending: 'blue', Shipped: 'grey', Delivered: 'green', Cancelled: 'red',
};

const OrderCancelled = () => {
    const { orders, loading, setOrders } = useOrders('Cancelled'); // Fetch cancelled orders
    // const updateOrderStatus = useUpdateOrderStatus();
    const deleteOrder = useDeleteOrder();
    const [openDetails, setOpenDetails] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleToggle = (index) => {
        setOpenDetails((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleStatusChange = async (orderId, newStatus) => {
        // Cancelled orders should not be deleted or updated further
        if (newStatus === 'Delete' && window.confirm('Are you sure you want to delete this order?')) {
            await deleteOrder(orderId);
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            toast.success('Order deleted successfully');
        }
    };

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const filteredOrders = orders.filter((order) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            order._id.toLowerCase().includes(searchLower) ||
            (order.userId?.email || '').toLowerCase().includes(searchLower)
        );
    });

    const paginatedOrders = filteredOrders.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <OrderLayout title="Cancelled Orders">
            <nav aria-label="breadcrumb" style={{marginTop:'10px' }}>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="/admin/orders">Orders</a>
                    </li>
                    <li className="breadcrumb-item">
                        <a href="/admin/orders/shipped">Shipped</a>
                    </li>
                    <li className="breadcrumb-item">
                        <a href="/admin/orders/delivered">Delivered</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Cancelled
                    </li>
                </ol>
            </nav>
            {loading ? (
                <Loader />
            ) : orders.length === 0 ? (
                <div className="alert alert-primary" role="alert">No cancelled orders available.</div>
            ) : (
                <div>
                    <TextField
                        label="Search by Order ID or User Email"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{ marginBottom: '20px' }}
                    />
                    <TableContainer component={Paper} className="mb-4">
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#343a40', color: '#fff' }}>
                                    {['Order ID', 'User', 'Total Price', 'Status', 'Date Cancelled', 'Actions'].map((header) => (
                                        <TableCell key={header} style={{ color: '#fff' }}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedOrders.map((order, index) => (
                                    <React.Fragment key={order._id}>
                                        <TableRow>
                                            <TableCell>{order._id}</TableCell>
                                            <TableCell>{order.userId?.email || 'N/A'}</TableCell>
                                            <TableCell>₱{order.totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</TableCell>
                                            <TableCell style={{ color: statusColors[order.status] }}>
                                                <i class="bi bi-x-circle-fill"></i> {order.status}
                                            </TableCell>
                                            <TableCell>{new Date(order.updatedAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleToggle(index)} size="small" aria-label="expand row">
                                                    {openDetails[index] ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                                <Select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    size="small"
                                                    style={{ marginLeft: '10px', minWidth: '120px' }}
                                                >
                                                    <MenuItem value={order.status} disabled>{order.status}</MenuItem>
                                                    {/* Removed "Ship" and "Deliver" options for cancelled orders */}
                                                    <MenuItem value="Delete" className='text-danger'><i className="bi bi-trash-fill"></i> Delete</MenuItem>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                                <Collapse in={openDetails[index]} timeout="auto" unmountOnExit>
                                                    <div className="p-3 bg-light border">
                                                        <Typography variant="h6" gutterBottom component="div">Order Details</Typography>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                            <div>
                                                                <p><strong>Shipping Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                                                                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                                                {order.paymentMethod === 'creditcard' && (
                                                                    <p><strong>Card Number:</strong> **** **** **** {order.paymentDetails?.cardNumber.slice(-4)}</p>
                                                                )}
                                                                <p><strong>Shipping fee:</strong> ₱100.00</p>
                                                                <p><strong>Order placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ color: statusColors[order.status] }}>{order.status}...</p> 
                                                                <p>{order.status === 'Cancelled' ? order.note || 'N/A' : 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Products</Typography>
                                                        <ul>
                                                            {order.products.map(product => (
                                                                <li key={product.productId._id}>
                                                                    {product.productId.name} (x{product.quantity}): ₱{product.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredOrders.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                    />
                </div>
            )}
        </OrderLayout>
    );
};

export default OrderCancelled;
