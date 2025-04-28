import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Select, MenuItem, Slider } from '@mui/material';
import Loader from '../components/Layout/Loader';
import AddToCartModal from './AddToCartModal';
import ProductCard from './ProductCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [, setQuantity] = useState(1);
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
              <ProductCard 
                key={product._id} 
                product={product} 
                handleAddToCart={handleAddToCart} 
              />
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