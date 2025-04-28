import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product._id}>
      <div className="card shopping-card h-100 shadow-sm product-card">
        <div
          id={`custom-carousel-${product._id}`}
          className="carousel slide carousel-fade mb-4"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {product.images.map((image, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""} carousel-detail`}
                key={image.public_id}
              >
                <img
                  className="d-block w-100 custom-carousel-image"
                  src={image.url}
                  alt={`View of ${product.name} - ${index + 1}`}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card-body shopping-card-body">
          <h5 className="card-title custom-title">{product.name}</h5>
          <p className="card-text custom-price">
            Price: ₱{product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
          <div className="d-flex align-items-center custom-rating">
            <Rating value={product.averageRating} readOnly precision={0.5} />
            <span className="ms-2 text-muted">({product.numReviews} Reviews)</span>
          </div>
          <div className="custom-colors">
            <span className="colors-text">Colors: {product.colors.length}</span>
            <div className="color-options">
              {product.colors.map((color, index) => (
                <span
                  key={index}
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                ></span>
              ))}
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-dark btn-sm"
              onClick={() => handleAddToCart(product)}
            >
              <i className="bi bi-cart-plus"></i>
            </button>
            <Link to={`/product/details/${product._id}`} className="btn btn-outline-primary py-1 px-2 btn-sm">
              <i className="bi bi-eye"></i> View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;