const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const cloudinary = require('cloudinary');

exports.newProduct = async (req, res, next) => {
    try {
        let images = [];
	  if (typeof req.body.images === 'string') {
		images.push(req.body.images);
	  } else {
		images = req.body.images;
	  }
  
	  let imagesLinks = [];
	  for (let i = 0; i < images.length; i++) {
		try {
		  const result = await cloudinary.v2.uploader.upload(images[i], {
			folder: 'products',
			width: 150,
			crop: "scale",
		  });
  
		  imagesLinks.push({
			public_id: result.public_id,
			url: result.secure_url
		  });
            } catch (uploadError) {
                console.error('Cloudinary Upload Error:', uploadError);
                return res.status(500).json({
                    success: false,
                    message: 'Image upload failed'
                });
            }
        }

        req.body.images = imagesLinks;
        req.body.user = req.user.id;

        const categoryExists = await Category.findById(req.body.category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Category not found'
            });
        }

        const product = await Product.create(req.body);

        if (!product) {
            return res.status(400).json({
                success: false,
                message: 'Product not created'
            });
        }

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        console.error('Product Creation Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const APILayout = require('../utils/apiLayout');
exports.getProducts = async (req, res, next) => {
    try {
        const resPerPage = 8; 
        const page = Number(req.query.page) || 1; 

        const apiQuery = new APILayout(Product.find(), req.query);
        apiQuery
            .priceFilter()   
            .ratingFilter()  
            .pagination(resPerPage);  

        const products = await apiQuery.query;

        const productsCount = await Product.countDocuments();

        const filteredProductsCount = products.length;

        return res.status(200).json({
            success: true,
            filteredProductsCount,
            productsCount,
            products,
            resPerPage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve products',
            error: error.message
        });
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        let images = req.files.images ? req.files.images : []; 

        if (images.length > 0) {
            for (let image of product.images) {
                await cloudinary.v2.uploader.destroy(image.public_id);
            }

            let imagesLinks = [];
            for (let image of images) {
                const result = await cloudinary.v2.uploader.upload(image.path, {
                    folder: 'products',
                    width: 150,
                    crop: 'scale',
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }

            req.body.images = images.length > 0 ? imagesLinks : product.images;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error updating product:', error); 
        res.status(500).json({
            success: false,
            message: 'Failed to update product Sheesh',
            error: error.message
        });
    }
};


exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name') 
            .populate({
                path: 'reviews',
                populate: { 
                    path: 'user', 
                    select: 'name email avatar' 
                },
                select: 'rating comment images',
            })
            .populate({
                path: 'reviews',
                populate: {
                    path: 'order',
                    select: 'products',
                    populate: {
                        path: 'products.productId',
                        match: { _id: req.params.id },
                        select: 'color'
                    }
                }
            });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error fetching product:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
};


exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        for (let image of product.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
}
