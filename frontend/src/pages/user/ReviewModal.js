import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, TextField, Rating, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReviewModal = ({ show, onClose, product, orderId, token, selectedReview, isEdit }) => {
    const [rating, setRating] = useState('');
    const [review, setReview] = useState('');
    const [, setError] = useState(null);
    const [, setSuccessMessage] = useState(null);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    useEffect(() => {
        if (isEdit && selectedReview) {
            setRating(selectedReview.rating);
            setReview(selectedReview.comment);
            setImagesPreview(selectedReview.images.map((img) => img.url));
        }
    }, [isEdit, selectedReview]);

    const handleImageChange = (e) => {
        const files = e.target.files;
        const fileArray = Array.from(files);

        setImagesPreview([]);
        setImages([]);

        fileArray.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((oldArray) => [...oldArray, reader.result]);
                    setImages((oldArray) => [...oldArray, file]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    const submitReview = async (e) => {
        e.preventDefault();

        if (!rating || !review || !product?._id || !orderId) {
            setError('All fields are required.');
            toast.error('All fields are required!');
            return;
        }

        const formData = new FormData();
        formData.set('product', product._id);
        formData.set('rating', rating);
        formData.set('comment', review);
        formData.set('order', orderId);

        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };

            const url = isEdit
                ? `http://localhost:4001/api/v1/reviews/${selectedReview._id}`
                : 'http://localhost:4001/api/v1/reviews';

            const method = isEdit ? 'put' : 'post';

            await axios[method](url, formData, config);

            setError(null);
            setSuccessMessage('Review submitted successfully!');
            toast.success('Review submitted successfully!');
            onClose();
            setTimeout(() => {
                window.location.reload();  
            }, 1200); 
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
            toast.error(err.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <Modal open={show} onClose={onClose}>
            <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="h5" align="center">{isEdit ? `Edit Review for ${product?.name}` : `Review ${product?.name}`}</Typography>
                <hr/>
                <IconButton 
                    onClick={onClose} 
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                    <CloseIcon />
                </IconButton>

                <form onSubmit={submitReview}>
                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        <Grid item xs={12}>
                            <Typography>Rating</Typography>
                            <Rating
                                name="rating"
                                value={rating}
                                onChange={(e, newValue) => setRating(newValue)}
                                precision={0.5}
                                size="large"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Review"
                                multiline
                                rows={4}
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Upload Images</Typography>
                            {imagesPreview.length > 0 && (
                                <Grid container spacing={1}>
                                    {imagesPreview.map((preview, index) => (
                                        <Grid item key={index}>
                                            <img 
                                                src={preview} 
                                                alt={`Preview ${index}`} 
                                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} 
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                            <input
                                type="file"
                                name="images"
                                multiple
                                onChange={handleImageChange}
                                className="form-control"
                                style={{ marginTop: 8 }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'end' }}>
                        <button type="submit" className="btn btn-outline-dark">
                            {isEdit ? 'Update Review' : 'Submit Review'}
                        </button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default ReviewModal;
