import React, { useState } from 'react';
import Loader from '../../components/Layout/Loader';
import OrderLayout from '../../components/Imports/OrderLayout';
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from '../../components/Hooks/RudOrders';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse, Typography, Paper, Select, MenuItem, TextField, TablePagination 
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { toast } from 'react-toastify';
const statusColors = {
    Pending: 'blue', Shipped: 'grey',  Delivered: 'green',  Cancelled: 'red',
};

const OrderShipped = () => {
    const { orders, loading, setOrders } = useOrders('Delivered');
    const updateOrderStatus = useUpdateOrderStatus();
    const deleteOrder = useDeleteOrder();
    const [openDetails, setOpenDetails] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleToggle = (index) => {
        setOpenDetails((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleStatusChange = async (orderId, newStatus) => {
        if (newStatus === 'Delete' && window.confirm('Are you sure you want to delete this order?')) {
            await deleteOrder(orderId);
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            toast.success('Order deleted successfully');
        } else {
            await updateOrderStatus(orderId, newStatus);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
            toast.success(`Order status updated to ${newStatus}`);
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
        <OrderLayout title="Order List">
            <nav aria-label="breadcrumb" style={{ marginBottom: '10px', marginTop:'10px' }}>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="/admin/orders">Orders</a>
                    </li>
                    <li className="breadcrumb-item">
                        <a href="/admin/orders/shipped">Shipped</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Delivered
                    </li>
                    <li className="breadcrumb-item">
                        <a href="/admin/orders/cancelled">Cancelled</a>
                    </li>
                </ol>
            </nav>
            {loading ? (
                <Loader />
            ) : orders.length === 0 ? (
                <div className="alert alert-primary" role="alert">No orders available yet.</div>
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
                                    {['Order ID', 'User', 'Total Price', 'Status', 'Order Date', 'Actions'].map((header) => (
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
                                        <TableCell style={{ color: statusColors[order.status] }}><i className="bi bi-send-check-fill"></i> {order.status}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
                                                {order.status === "Pending" && <>
                                                    <MenuItem value="Shipped" className='text-secondary'><i className="bi bi-arrow-left-right"></i> Ship</MenuItem>
                                                    <MenuItem value="Delivered" className='text-success'><i className="bi bi-truck"></i> Deliver</MenuItem>
                                                </>}
                                                {order.status === "Shipped" && <MenuItem value="Delivered" className='text-success'><i className="bi bi-truck"></i> Deliver</MenuItem>}
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
                                                        </div>
                                                        <div>
                                                            <p><strong>Shipping fee:</strong> ₱100.00</p>
                                                            <p><strong>Order placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                                            <p style={{ color: statusColors[order.status] }}>{order.status}...</p> 
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

export default OrderShipped;
