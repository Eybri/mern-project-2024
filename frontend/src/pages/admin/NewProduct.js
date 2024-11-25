import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../../components/Layout/Metadata';
import Loader from '../../components/Layout/Loader';
import Sidebar from './SideBar';
import axios from 'axios'; 
import '../../App.css'; 
import { getToken } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const NewProduct = () => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [colors, setColors] = useState([]); // State for selected colors
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true); 
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    }
                };
                const { data } = await axios.get('http://localhost:4001/api/v1/admin/categories', config);
                setCategories(data.category); 
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Error fetching categories!');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleColorChange = (e, setFieldValue) => {
        const color = e.target.value;
        const updatedColors = e.target.checked
            ? [...colors, color]
            : colors.filter(c => c !== color);

        setColors(updatedColors);  
        setFieldValue("colors", updatedColors);
    };

    const handleSubmit = async (values) => {
        setLoading(true);

        const formData = new FormData();
        formData.set('name', values.name);
        formData.set('description', values.description);
        formData.set('price', values.price);
        formData.set('stock', values.stock);
        formData.set('category', values.category);

        // Append selected colors to form data
        values.colors.forEach(color => formData.append('colors[]', color));

        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${getToken()}` } };
            const { data } = await axios.post('http://localhost:4001/api/v1/admin/product/new', formData, config);
            
            console.log('Product Created:', data);
            setSuccess(true);
        } catch (error) {
            console.error('Error creating product:', error);
            setError('Error creating product!');
        } finally {
            setLoading(false);
        }
    };

    const onChange = e => {
        const files = Array.from(e.target.files);
        setImagesPreview([]);
        setImages([]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
            setError(null);
        }

        if (success) {
            toast.success('Product created successfully!', {
                position: 'bottom-right'
            });
            navigate('/admin/products');
            setSuccess(false);
        }

    }, [error, success, navigate]);

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        price: Yup.number().required('Price is required').positive('Price must be greater than zero'),
        stock: Yup.number().required('Stock is required').integer('Stock must be an integer').min(0, 'Stock cannot be negative'),
        category: Yup.string().required('Category is required'),
        colors: Yup.array().min(1, 'At least one color must be selected').required('Colors are required')
    });

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
                            <MetaData title={'Add Product'} />
                            <div className="container-fluid">
                                <h1 id="products_heading">Add New Product</h1>
                                <div className="card shadow-lg mb-4" style={{ height: 'auto' }}>
                                    <div className="card-body">
                                        <Formik
                                            initialValues={{
                                                name: '',
                                                description: '',
                                                price: 0,
                                                stock: 0,
                                                category: '',
                                                colors: [] 
                                            }}
                                            validationSchema={validationSchema}
                                            onSubmit={handleSubmit}
                                        >
                                            {({ setFieldValue, values }) => (
                                                <Form className="p-3 bg-white" encType="multipart/form-data">
                                                    <div className="form-group">
                                                        <label htmlFor="name">Name</label>
                                                        <Field
                                                            type="text"
                                                            id="name"
                                                            className="form-control"
                                                            name="name"
                                                        />
                                                        <ErrorMessage name="name" component="div" className="text-danger" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="description">Description</label>
                                                        <Field
                                                            as="textarea"
                                                            id="description"
                                                            className="form-control"
                                                            rows="5"
                                                            name="description"
                                                        />
                                                        <ErrorMessage name="description" component="div" className="text-danger" />
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="price">Price</label>
                                                                <Field
                                                                    type="number"
                                                                    id="price"
                                                                    className="form-control"
                                                                    name="price"
                                                                />
                                                                <ErrorMessage name="price" component="div" className="text-danger" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="stock">Stock</label>
                                                                <Field
                                                                    type="number"
                                                                    id="stock"
                                                                    className="form-control"
                                                                    name="stock"
                                                                />
                                                                <ErrorMessage name="stock" component="div" className="text-danger" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="category">Category</label>
                                                                <Field
                                                                    as="select"
                                                                    id="category"
                                                                    className="form-control"
                                                                    name="category"
                                                                >
                                                                    <option value="">Select Category</option>
                                                                    {categories.map((cat) => (
                                                                        <option key={cat._id} value={cat._id}>
                                                                            {cat.name}
                                                                        </option>
                                                                    ))}
                                                                </Field>
                                                                <ErrorMessage name="category" component="div" className="text-danger" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Colors Selection */}
                                                    <div className="form-group">
                                                        <label>Available Colors</label>
                                                        <div className="color-picker-row">
                                                            {['Red', 'Green', 'Blue', 'Black', 'White'].map((color, index) => (
                                                                <div key={index} className="color-circle-container">
                                                                    <input
                                                                        type="checkbox"
                                                                        value={color}
                                                                        checked={colors.includes(color)} // Check if color is selected
                                                                        onChange={(e) => handleColorChange(e, setFieldValue)}
                                                                        id={`color-${color}`}
                                                                        className="color-input"
                                                                    />
                                                                    <label
                                                                        htmlFor={`color-${color}`}
                                                                        className={`color-circle ${colors.includes(color) ? 'checked' : ''}`}
                                                                        style={{ backgroundColor: color }}
                                                                    ></label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <ErrorMessage name="colors" component="div" className="text-danger" />
                                                    </div>

                                                    {/* Image Upload */}
                                                    <div className="form-group">
                                                        <label>Product Images</label>
                                                        <input
                                                            type="file"
                                                            name="images"
                                                            className="form-control"
                                                            multiple
                                                            onChange={onChange}
                                                        />
                                                        <div className="image-preview">
                                                            {imagesPreview.map((img, index) => (
                                                                <img src={img} alt={`Preview ${index}`} key={index} className="mt-3 mr-2" width="55" height="52" />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <button
                                                type="submit"
                                                className="btn btn-dark btn-block mt-2 py-2"
                                            >
                                                CREATE
                                            </button>
                                                </Form>
                                            )}
                                        </Formik>
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

export default NewProduct;
