const Review = require('../models/reviewModel');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/productModel');
// const Order = require('../models/orderModel')
const BadWords = require('bad-words');
const filter = new BadWords();

filter.addWords('tangina', 'bullshit', 'gago', 'putangina', 'yabang', 'puchaaaaa', 'bobo', 'shit', 'tanga', 'ulol', 'pakyu', 'kupal', 'pota');
const preComment = comment => comment.replace(/[.,!?;()&%$#@]/g, '').toLowerCase();

exports.addReview = async (req, res) => {
    try {
        const { product, rating, comment, order } = req.body;
        const images = req.files;

        if (!product || !rating || !comment || !order) return res.status(400).json({ message: 'All fields are required, including order ID.' });

        const existingReview = await Review.findOne({ product, user: req.user._id, order });
        if (existingReview) return res.status(400).json({ message: 'You have already reviewed this product for this order.' });

        const filteredComment = filter.clean(preComment(comment));

        const uploadedImages = images ? await Promise.all(images.map(image =>
            cloudinary.uploader.upload(image.path, { folder: 'reviews' })
                .then(result => ({ public_id: result.public_id, url: result.secure_url }))
        )) : [];

        const review = await new Review({
            user: req.user._id,
            product,
            order,
            rating,
            comment: filteredComment,
            images: uploadedImages
        }).save();

        const productToUpdate = await Product.findById(product);
        if (productToUpdate) {
            const totalReviews = productToUpdate.numReviews || 0;
        
            const validRating = parseFloat(rating);
            if (isNaN(validRating)) {
                throw new Error("Invalid rating value");
            }
        
            // Ensure currentTotalRating calculation is safe
            const currentTotalRating = (productToUpdate.averageRating || 0) * totalReviews;
        
            // Compute the new average rating
            const newTotalRating = currentTotalRating + validRating;
            const newAverageRating = totalReviews === 0 ? validRating : newTotalRating / (totalReviews + 1);
        
            // Update product's average rating and review count
            productToUpdate.reviews.push(review._id);
            productToUpdate.averageRating = parseFloat(newAverageRating.toFixed(1));
            productToUpdate.numReviews = totalReviews + 1;
        
            await productToUpdate.save();
        }
        res.status(201).json({ message: 'Review added successfully!', review });
    } catch (error) {
        console.error('Error adding review:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.getUserReviews = async (req, res) => {
    try {
        const user = req.user._id; 
        const reviews = await Review.find({ user: user })
        .populate({
            path: 'product',
            select: 'name description price images',
        })
        .populate({
            path: 'order',
            populate: {
                path: 'products.productId',
                select: 'color',
            },
        })
        .exec();

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this user.' });
        }

        res.status(200).json({ message: 'Reviews fetched successfully!', reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate({
                path: 'user',
                select: 'name email avatar',
            })
            .populate({
                path: 'product',
                select: 'name description price images',
            })
            .populate({
                path: 'order',
                select: '_id products', 
                populate: {
                    path: 'products.productId',
                    select: 'color', 
                },
            })
            .exec();

        res.status(200).json({ message: 'All reviews fetched successfully!', reviews });
    } catch (error) {
        console.error('Error fetching all reviews:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
};


exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params; 
        const { rating, comment, images } = req.body; 

        if (!rating || !comment) {
            return res.status(400).json({ message: 'Rating and comment are required.' });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        const cleanedComment = filter.clean(comment);  
        
        review.rating = rating;
        review.comment = cleanedComment;  

        if (images && images.length > 0) {
            for (let img of review.images) {
                await cloudinary.uploader.destroy(img.public_id);
            }

            const uploadedImages = await Promise.all(images.map(async (img) => {
                const uploadResult = await cloudinary.uploader.upload(img, {
                    folder: 'reviews', 
                });
                return {
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url,
                };
            }));

            review.images = uploadedImages;
        }

        await review.save();

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the review.' });
    }
};


exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        const product = await Product.findById(review.product);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const reviewIndex = product.reviews.indexOf(reviewId);
        if (reviewIndex !== -1) {
            product.reviews.splice(reviewIndex, 1);
        }

        const totalReviews = product.reviews.length;
        let newAverageRating = 5;  // Default rating when no reviews exist

        if (totalReviews > 0) {
            const reviews = await Review.find({ '_id': { $in: product.reviews } });

            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

            newAverageRating = totalRating / totalReviews;
        }

        product.numReviews = totalReviews;
        product.averageRating = parseFloat(newAverageRating.toFixed(1)); 

        await product.save();

        for (let img of review.images) {
            await cloudinary.uploader.destroy(img.public_id);
        }

        await review.deleteOne();

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the review.' });
    }
};


