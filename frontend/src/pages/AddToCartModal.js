import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import { getToken } from '../utils/helpers';
import { toast } from 'react-toastify';

const AddToCartModal = ({ modalOpen, setModalOpen, selectedProduct, setQuantity }) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setLocalQuantity] = useState(1);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);

  useEffect(() => {
    // Reset color and quantity when the modal is opened or product changes
    if (modalOpen) {
      setSelectedColor('');
      setLocalQuantity(1);
    }
  }, [modalOpen, selectedProduct]);

  const handleConfirmAddToCart = async () => {
    if (!selectedColor) return toast.warning('Please select a color');

    const token = getToken();
    if (!token) {
      return toast.info('Please log in to add items to the cart.', {
        onClose: () => window.location.href = '/login',
      });
    }

    if (selectedProduct?.stock === 0) return toast.info('No stocks available yet for this product.');

    setLoadingAddToCart(true);
    const productData = {
      productId: selectedProduct?._id,
      color: selectedColor,
      quantity: parseInt(quantity, 10),
      price: selectedProduct?.price,
    };

    try {
      const response = await axios.post(
        'http://localhost:4001/api/v1/cart/add',
        productData,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Product added to cart successfully!');
        setModalOpen(false);
        setQuantity(1); 
        setTimeout(() => {
          window.location.reload();
      }, 100);
      } else {
        toast.error('Failed to add product to cart. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data.message || 'An error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoadingAddToCart(false);
    }
  };

  return (
    <div className={`modal fade ${modalOpen ? 'show' : ''}`} style={{ display: modalOpen ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="addToCartModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addToCartModalLabel">Add to Cart</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-4">
                <div className="d-flex flex-wrap">
                  {selectedProduct?.images.slice(0, 3).map((image, index) => (
                    <div key={index} className="m-2">
                      <img
                        src={image.url}
                        alt={`${selectedProduct?.name} - ${index + 1}`} 
                        className="img-fluid"
                        style={{ maxWidth: '160px', maxHeight: '160px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-8">
                <h6>{selectedProduct?.name}</h6>
                <p>Price: ₱{selectedProduct?.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                <p>{selectedProduct?.description}</p>
                <div className="mb-3 d-flex">
                  <Rating value={selectedProduct?.averageRating || 0} readOnly precision={0.5} />
                  <span className="ms-2">({selectedProduct?.numReviews} Reviews)</span>
                </div>
                <div className="mb-3">
                  <label htmlFor="colorSelect" className="form-label">Select Color</label>
                  <div className="d-flex flex-wrap">
                    {selectedProduct?.colors.map((color, index) => (
                      <div
                        key={index}
                        className={`color-swatch me-2 mb-2 ${selectedColor === color ? 'selected' : ''}`}
                        style={{
                          backgroundColor: color,
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          border: selectedColor === color ? '4px solid white' : '1px solid grey',
                          boxShadow: selectedColor === color ? '0px 4px 8px rgba(0, 0, 0, 1)' : 'none',
                          transition: 'box-shadow 0.4s ease, border 0.3s ease',
                        }}
                        onClick={() => setSelectedColor(color)}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setLocalQuantity(e.target.value)}
                    min="1"
                  />
                </div>
                <p style={{ color: selectedProduct?.stock <= 5 ? 'red' : 'green' }}>
                  Remaining Stocks: {selectedProduct?.stock}
                </p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-primary" data-bs-dismiss="modal" onClick={() => setModalOpen(false)}>Close</button>
            <button type="button" className="btn btn-dark" onClick={handleConfirmAddToCart}>
              {loadingAddToCart ? 'Adding...' : 'Add to Cart'}
            </button>                            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
