import React, { useEffect, useState } from 'react';
import MetaData from '../../components/Layout/Metadata';
import Sidebar from './SideBar';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { Card, CardContent, Grid, Typography, Avatar, Box, Rating, Button, Pagination } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [reviewsPerPage] = useState(6);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = getToken();
                const response = await axios.get('http://localhost:4001/api/v1/admin/reviews/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReviews(response.data.reviews);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching reviews');
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleDelete = async (reviewId) => {
        if (window.confirm(`Are you sure you want to delete the review with ID: ${reviewId}?`)) {
            try {
                const token = getToken();
                await axios.delete(`http://localhost:4001/api/v1/reviews/${reviewId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReviews(reviews.filter(review => review._id !== reviewId));
                toast.success('Review deleted successfully!');
            } catch (error) {
                setError(error.response?.data?.message || 'Error deleting review');
            }
        }
    };

    const handleToggle = (reviewId) => {
        setExpanded(expanded === reviewId ? null : reviewId);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const currentReviews = reviews.slice((page - 1) * reviewsPerPage, page * reviewsPerPage);

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-2"><Sidebar /></div>
                <div className="col-12 col-md-10">
                    <MetaData title={'All Reviews'} />
                    <div className="container-fluid">
                        <h1 className="mb-4">Reviews List</h1>
                        {loading && <p>Loading reviews...</p>}
                        {error && <p className="text-danger">{error}</p>}
                        {reviews.length === 0 && !loading && <div className="alert alert-warning">No reviews yet.</div>}
                        <Container>
                            <Row>
                                {currentReviews.map((review) => (
                                    <Col key={review._id} xs={12} md={6} lg={4}>
                                        <Card className="mb-4 shadow-sm">
                                            <CardContent>
                                                <Grid container spacing={2}>
                                                    <Grid item><Avatar alt={review.user.name} src={review.user.avatar.url} sx={{ width: 50, height: 50 }} /></Grid>
                                                    <Grid item xs={8}>
                                                        <Typography variant="h6">{review.user.name}</Typography>
                                                        <Typography variant="body2" color="textSecondary">{review.user.email}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Button onClick={() => handleToggle(review._id)} variant="outlined" sx={{ mt: 2 }}>
                                                    {expanded === review._id ? 'Show Less' : 'Show More'}
                                                </Button>
                                                {expanded === review._id && (
                                                    <>
                                                        <Typography variant="body1" className="mt-2"><strong>Product:</strong> {review.product.name}</Typography>
                                                        <Typography variant="body2" className="mb-1"><strong>Color:</strong> {review.order.products.map((product) => product.color).join(', ')}</Typography>
                                                        <Typography display="flex" alignItems="center" marginBottom={1}>
                                                            <Rating name={`rating-${review._id}`} value={review.rating} readOnly precision={0.5} />
                                                            <Typography variant="body2" marginLeft={1}>{review.rating} ★</Typography>
                                                        </Typography>
                                                        <Typography variant="body1" className="mt-2"><strong>Review:</strong> {review.comment}</Typography>
                                                        {review.images.length > 0 && (
                                                            <Box display="flex" flexWrap="wrap" gap={1}>
                                                                {review.images.map((img) => (
                                                                    <img key={img.public_id} src={img.url} alt="Review" style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '5px' }} />
                                                                ))}
                                                            </Box>
                                                        )}
                                                    </>
                                                )}
                                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {format(new Date(review.createdAt), 'EEE, MMM d, yyyy h:mm a')}
                                                    </Typography>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleDelete(review._id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                        <Pagination count={Math.ceil(reviews.length / reviewsPerPage)} page={page} onChange={handlePageChange} sx={{ mt: 3, display: 'flex', justifyContent: 'center' }} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewList;
