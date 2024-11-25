import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/helpers'; // Utility function to get the token
import MetaData from '../../components/Layout/Metadata';
import UserOrderNavigator from '../../components/Imports/UserOrderNavigator';
import {
    Card, CardContent, Typography, Grid, Rating, Box, CircularProgress, Alert
} from '@mui/material';
import ReviewModal from './ReviewModal'; // Import ReviewModal component
import { toast } from 'react-toastify';
const OrderReviews = () => {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [, setFormData] = useState({
        rating: 0,
        comment: '',
        images: []
    });
    const [, setImageFiles] = useState([]);
    
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = getToken(); 
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const { data } = await axios.get('http://localhost:4001/api/v1/reviews/all', config);
                setReviews(data.reviews);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load reviews');
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleEdit = (reviewId) => {
        const review = reviews.find((rev) => rev._id === reviewId);
        setSelectedReview(review);
        setFormData({
            rating: review.rating,
            comment: review.comment,
            images: review.images 
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedReview(null);
        setFormData({ rating: 0, comment: '', images: [] });
        setImageFiles([]);
    };



    const handleDelete = async (reviewId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this review?');
        if (!isConfirmed) {
            return;
        }
        const token = getToken();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            await axios.delete(`http://localhost:4001/api/v1/reviews/${reviewId}`, config);

            setReviews(reviews.filter((review) => review._id !== reviewId));
            setLoading(true);
            const { data } = await axios.get('http://localhost:4001/api/v1/reviews/all', config);
            setReviews(data.reviews);
            setLoading(false);
            toast.success('Review deleted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete review');
        }
    };

    return (
        <Fragment>
            <MetaData title="Your Reviews" />
            <div className="container mt-4">
                <UserOrderNavigator />
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {reviews.map((review) => (
                            <Grid item xs={12} sm={6} md={4} key={review._id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {review.product.name}
                                        </Typography>
                                        <Box display="flex" alignItems="center" marginBottom={1}>
                                            <Rating
                                                name={`rating-${review._id}`}
                                                value={review.rating}
                                                readOnly
                                                precision={0.5}
                                            />
                                            <Typography variant="body2" marginLeft={1}>
                                                {review.rating} ★
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" gutterBottom>
                                            <strong>Price:</strong> ₱
                                            {review.product.price
                                                .toFixed(0)
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            <strong>Color:</strong>{' '}
                                            {review.order.products.find(
                                                (p) => p.productId._id === review.product._id
                                            )?.color || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            {review.comment}
                                        </Typography>
                                        {review.images.length > 0 && (
                                            <Box display="flex" flexWrap="wrap" gap={1}>
                                                {review.images.map((img) => (
                                                    <img
                                                        key={img.public_id}
                                                        src={img.url}
                                                        alt="Review"
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            objectFit: 'cover',
                                                            borderRadius: '5px',
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                        <div className="card-footer text-end mt-2">
                                            <button
                                                className="btn btn-outline-dark me-2"
                                                onClick={() => handleEdit(review._id)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(review._id)} 
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </div>

            <ReviewModal
                show={openModal}
                onClose={handleCloseModal}
                product={selectedReview?.product}
                orderId={selectedReview?.order._id}
                token={getToken()}
                selectedReview={selectedReview}
                isEdit={true}
            />

        </Fragment>
    );
};

export default OrderReviews;
