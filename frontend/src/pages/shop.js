import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Slider from '@mui/material/Slider';
import AddToCartModal from './AddToCartModal';
import axios from 'axios';
import { Pagination, Select, MenuItem } from '@mui/material';
import Loader from '../components/Layout/Loader';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [, setQuantity] = useState(1);
  // const [, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [price, setPrice] = useState([0, 10000]); 
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = {
          page: currentPage,
          price: price.join('-'), 
          rating: rating, 
        };

        const { data } = await axios.get('http://localhost:4001/api/v1/products', { params: queryParams });
        setProducts(data.products);
        setTotalPages(Math.ceil(data.productsCount / 8));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, price, rating]);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePriceChange = (event, newValue) => {
    setPrice(newValue);
  };

  return (
    <Fragment>
      <div className="container my-5">
        {/* Filters */}
        <div className="row mb-4">
          <div className="col-lg-3">
            <h5>Price Range</h5>
            <Slider
              value={price}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `₱${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
              min={0}
              max={10000}
              style={{
                color: 'black', 
              }}
            />
          </div>
          <div className="col-lg-3">
            <h5>Rating</h5>
            <Select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              fullWidth
            >
              <MenuItem value={0}>All Ratings</MenuItem>
              <MenuItem value={1}>1 & above</MenuItem>
              <MenuItem value={2}>2 & above</MenuItem>
              <MenuItem value={3}>3 & above</MenuItem>
              <MenuItem value={4}>4 & above</MenuItem>
              <MenuItem value={4.5}>4.5 & above</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </div>
        </div>

        <div className="row">
          {loading ? <Loader /> : (
            products.map((product) => (
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
            ))
          )}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
            shape="rounded"
          />
        </div>
      </div>

      {selectedProduct && (
        <AddToCartModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          selectedProduct={selectedProduct}
          setQuantity={setQuantity}
        />
      )}
    </Fragment>
  );
};

export default Shop;