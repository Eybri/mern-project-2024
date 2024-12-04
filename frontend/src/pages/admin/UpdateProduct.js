import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../../components/Layout/Metadata';
import Loader from '../../components/Layout/Loader';
import Sidebar from './SideBar';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProduct = () => {
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [updateError, setUpdateError] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);
    const [colors, setColors] = useState([]);

    let navigate = useNavigate();
    let { id } = useParams();

    const errMsg = (message = '') => toast.error(message, { position: 'bottom-right' });
    const successMsg = (message = '') => toast.success(message, { position: 'bottom-right' });

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${getToken()}` } };
                const { data } = await axios.get('http://localhost:4001/api/v1/admin/categories', config);
                setCategories(data.category);
            } catch (error) {
                setError('Error fetching categories!');
            } finally {
                setLoading(false);
            }
        };

        const fetchProduct = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${getToken()}` } };
                const { data } = await axios.get(`http://localhost:4001/api/v1/product/${id}`, config);
                const { name, description, price, stock, category, colors, images } = data.product;
                setName(name);
                setDescription(description);
                setPrice(price);
                setStock(stock);
                setCategory(category._id);
                setColors(colors);
                setImagesPreview(images.map(img => img.url));
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching product!');
            }
        };

        fetchCategories();
        fetchProduct();
    }, [id]);

    const updateProduct = async (productData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${getToken()}`,
                }
            };
            const { data } = await axios.put(`http://localhost:4001/api/v1/admin/product/${id}`, productData, config);
            setIsUpdated(data.success);
        } catch (error) {
            const message = error.response?.data?.message || 'Error updating product!';
            setUpdateError(message);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);
        formData.set('price', price);
        formData.set('stock', stock);
        formData.set('category', category);

        colors.forEach(color => formData.append('colors[]', color));
        images.forEach(image => formData.append('images', image));

        updateProduct(formData);
    };

    const onChange = (e) => {
        const files = Array.from(e.target.files);
        setImagesPreview([]);
        setImages(files);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((oldArray) => [...oldArray, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleColorChange = (e) => {
        const color = e.target.value;
        setColors(prevColors =>
            prevColors.includes(color)
                ? prevColors.filter(c => c !== color)
                : [...prevColors, color]
        );
    };

    useEffect(() => {
        if (error) {
            errMsg(error);
            setError('');
        }
        if (updateError) {
            errMsg(updateError);
            setUpdateError('');
        }
        if (isUpdated) {
            successMsg('Product updated successfully!');
            navigate('/admin/products');
            setIsUpdated(false);
        }
    }, [error, isUpdated, updateError, navigate]);

    return (
        <Fragment>
            <ToastContainer />
            {loading ? <Loader /> : (
                <Fragment>
                    <div className="row">
                        <div className="col-12 col-md-2">
                            <Sidebar />
                        </div>
                        <div className="col-12 col-md-8">
                            <MetaData title="Update Product" />
                            <div className="container-fluid">
                                <h1 id="products_heading">Update Product</h1>
                                <div className="card shadow-lg mb-4">
                                    <div className="card-body">
                                        <form onSubmit={submitHandler} className="p-3 bg-white" encType="multipart/form-data">
                                            <div className="form-group">
                                                <label htmlFor="name">Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    className="form-control"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <textarea
                                                    id="description"
                                                    className="form-control"
                                                    rows="5"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="price">Price</label>
                                                        <input
                                                            type="number"
                                                            id="price"
                                                            className="form-control"
                                                            value={price}
                                                            onChange={(e) => setPrice(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="stock">Stock</label>
                                                        <input
                                                            type="number"
                                                            id="stock"
                                                            className="form-control"
                                                            value={stock}
                                                            onChange={(e) => setStock(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="category">Category</label>
                                                        <select
                                                            id="category"
                                                            className="form-control"
                                                            value={category}
                                                            onChange={(e) => setCategory(e.target.value)}
                                                        >
                                                            <option value="">Select Category</option>
                                                            {categories.map((cat) => (
                                                                <option key={cat._id} value={cat._id}>
                                                                    {cat.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Available Colors</label>
                                                <div className="color-picker-row">
                                                    {['Red', 'Green', 'Blue', 'Black', 'White'].map((color, index) => (
                                                        <div key={index} className="color-circle-container">
                                                            <input
                                                                type="checkbox"
                                                                value={color}
                                                                checked={colors.includes(color)}
                                                                onChange={handleColorChange}
                                                                id={`color-${color}`}
                                                                className="color-input"
                                                            />
                                                            <label
                                                                htmlFor={`color-${color}`}
                                                                className={`color-circle ${colors.includes(color) ? 'checked' : ''}`}
                                                                style={{ backgroundColor: color }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Images</label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="form-control"
                                                    onChange={onChange}
                                                />
                                            </div>
                                            {imagesPreview.length > 0 && (
                                                <div className="form-group">
                                                    <label>Image Preview</label>
                                                    <div className="image-preview-container">
                                                        {imagesPreview.map((src, index) => (
                                                            <img key={index} src={src} alt={`preview-${index}`} className="preview-image" />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <button type="submit" className="btn btn-primary">Update Product</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default UpdateProduct;
