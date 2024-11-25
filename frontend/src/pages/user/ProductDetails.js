import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MetaData from '../../components/Layout/Metadata';
import { getToken } from '../../utils/helpers';
import { Card, CardContent, Typography, Avatar, Grid, Box, Rating } from '@mui/material';
import AddToCartModal from '../../pages/AddToCartModal';


const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [, setQuantity] = useState(1);
    const openAddToCartModal = () => {
        setModalOpen(true);
      };
    
    //   const closeAddToCartModal = () => {
    //     setModalOpen(false);
    //   };
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = getToken();
                const { data } = await axios.get(`http://localhost:4001/api/v1/product/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProduct(data.product);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center">Loading...</div>;

    if (error) return <div className="text-center text-danger">{error}</div>;

    return (
        <>
            <MetaData title={`Product Details - ${product.name}`} />
            <div className="container my-5">
                <div className="card shadow-lg p-4">
                    <h1 className="text-center mb-4">ˏˋ°•*⁀➷ {product.name} ˏˋ°•*⁀➷</h1>
                    <hr />
                    <div className="row">
                        <div className="col-md-6">
                            <div id="carouselExampleFade" className="carousel slide carousel-fade mb-5" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                {product.images.map((image, index) => (
                                    <div className={`carousel-item ${index === 0 ? 'active' : ''} carousel-detail`} key={index}>
                                        <img src={image.url} className="d-block w-100" alt={`View of ${product.name} - ${index + 1}`} />
                                    </div>
                                ))}

                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h2>
                                ₱{product.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </h2>
                            <div className="d-flex align-items-center">
                                <Rating
                                    value={product.averageRating}
                                    precision={0.1}
                                    readOnly
                                    className="ms-2"
                                />
                                <span className="ms-2">({product.numReviews} reviews)</span>
                            </div>
                            <p>{product.description}</p>
                            <p className='text-muted'><strong>Category:</strong> {product.category.name}</p>
                            <div>
                                <strong className='text-muted'>Colors:</strong>
                                <div className="d-flex mb-2">
                                    {product.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className="color-circle me-2"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p
                                className={`text-end ${product.stock === 0 ? 'text-danger' : product.stock < 5 ? 'text-primary' : 'text-success'}`}
                            >
                                {product.stock === 0 ? (
                                    'No stocks available'
                                ) : (
                                    <><strong>Stocks Available:</strong> {product.stock}</>
                                )}
                            </p>
                        </div>
                        <div className="text-end">
                            <button
                                className="btn btn-dark"
                                onClick={openAddToCartModal}
                            >
                                <i className="bi bi-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                    {modalOpen && (
                        <AddToCartModal
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        selectedProduct={product}
                        setQuantity={setQuantity}
                        />
                    )}

                    {product.reviews.length > 0 && (
                        <Box mt={4}>
                            <Typography variant="h4" gutterBottom>Reviews</Typography>
                            {product.reviews.map((review, index) => (
                                <Card key={index} sx={{ mb: 2, padding: 2 }}>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            {/* User Avatar and Name */}
                                            <Grid item>
                                                <Avatar src={review.user.avatar.url} alt={review.user.name} sx={{ width: 40, height: 40 }} />
                                            </Grid>
                                            <Grid item xs>
                                                <Typography variant="body1" fontWeight="bold">{review.user.name}</Typography>
                                                {/* Color Info */}
                                            </Grid>
                                        </Grid>
                                        
                                        {/* Rating */}
                                        <Box mt={2} display="flex" alignItems="center">
                                            <Typography variant="body2" mr={1}><strong>Rating:</strong></Typography>
                                            <Rating value={review.rating} precision={0.5} readOnly />
                                        </Box>
                                        <Box mt={2} display="flex" alignItems="center">
                                            <Typography variant="body2" mr={1}><strong>Colour: </strong></Typography>
                                            <Typography variant="body2" color="textSecondary"> {review.order.products[0].color}</Typography>
                                        </Box>
                                        {/* Review Comment */}
                                        <Box mt={2}>
                                            <Typography variant="body2">{review.comment}</Typography>
                                        </Box>

                                        {/* Review Images */}
                                        {review.images.length > 0 && (
                                            <Box mt={3}>
                                                {/* <Typography variant="body2" fontWeight="bold">Images:</Typography> */}
                                                <Grid container spacing={2} mt={2}>
                                                    {review.images.map((image, imgIndex) => (
                                                        <Grid item key={imgIndex}>
                                                            <img
                                                                key={imgIndex}
                                                                src={image.url}
                                                                alt={`Review ${imgIndex + 1}`}  
                                                                className="img-thumbnail"
                                                                style={{ width: '180px', height: '180px', objectFit: 'cover' }}
                                                            />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}

                </div>
            </div>
        </>
    );
};

export default ProductDetails;
