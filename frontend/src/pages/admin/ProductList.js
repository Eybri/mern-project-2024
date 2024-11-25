import React, { Fragment, useState, useEffect, useMemo } from 'react';
import MetaData from '../../components/Layout/Metadata';
import Loader from '../../components/Layout/Loader';
import Sidebar from './SideBar';
import '../../App.css';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Rating from '@mui/material/Rating';
import Checkbox from '@mui/material/Checkbox'; 

const ProductList = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const config = useMemo(() => ({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }), []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('http://localhost:4001/api/v1/admin/products', config);
                setProducts(data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('http://localhost:4001/api/v1/admin/categories', config);
                setCategories(data.category);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        fetchCategories();
    }, [config]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:4001/api/v1/admin/product/${id}`, config);
                setProducts(products.filter(product => product._id !== id));
                toast.success('Product deleted successfully');
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Error deleting product');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) {
            toast.warning("No products selected for deletion");
            return;
        }
        if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
            setLoading(true);
            try {
                await Promise.all(
                    selectedProducts.map(id => axios.delete(`http://localhost:4001/api/v1/admin/product/${id}`, config))
                );
                setProducts(products.filter(product => !selectedProducts.includes(product._id)));
                setSelectedProducts([]);
                setSelectAll(false);
                toast.success("Products deleted successfully");
            } catch (error) {
                console.error("Error deleting products:", error);
                toast.error("Error deleting selected products");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prev => 
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(product => product._id));
        }
        setSelectAll(!selectAll);
    };

    const columns = [
        {
            name: 'select',
            label: (
                <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                />
            ),
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => {
                    const productId = products[dataIndex]._id;
                    return (
                        <Checkbox
                            checked={selectedProducts.includes(productId)}
                            onChange={() => handleSelectProduct(productId)}
                        />
                    );
                }
            }
        },
        {
            name: 'image',
            label: 'Image',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => (
                    <img src={value} alt="Product" style={{ width: '50px', height: '50px' }} />
                ),
            },
        },
        { name: 'name', label: 'Name', options: { filter: true, sort: true } },
        {
            name: 'actions',
            label: 'Actions',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    const productId = products[tableMeta.rowIndex]._id;
                    return (
                        <Fragment>
                            <Link to={`/admin/product/${productId}`} className="btn btn-primary py-1 px-2">
                                <i className="bi bi-pencil-square"></i>
                            </Link>
                            <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => handleDelete(productId)}>
                                <i className="bi bi-trash3-fill"></i>
                            </button>
                        </Fragment>
                    );
                },
            },
        },
    ];

    const data = products.map(product => ({
        image: product.images[0]?.url || '',
        name: product.name,
    }));

    const expandedRowRender = (product) => {
        return (
            <div className="expandable-row">
                <h4 className="product-details">Product Details:</h4>
                <div className="product-details">
                    <p><strong>Description:</strong> {product.description}</p>
                    <p style={{ color: product.stock <= 5 ? 'red' : 'green' }}>
                        <strong>Stock Level:</strong> {product.stock}
                    </p>
                    <p className="product-price">
                        <strong>Product Price:</strong> ₱{product.price}
                    </p>
                    <p><strong>Average Rating:</strong>
                        <Rating
                            name="read-only"
                            value={product.averageRating}
                            readOnly
                            precision={0.5}
                        />
                    </p>
                    <p><strong>Category:</strong> {categories.find(cat => cat._id === product.category)?.name || 'N/A'}</p>
                    <p className="product-price">
                        <strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <div className="row">
                        <div className="col-12 col-md-2">
                            <Sidebar />
                        </div>
                        <div className="col-12 col-md-9">
                            <MetaData title={'Product List'} />
                            <div className="table-container">
                                <h1 id="products_heading">All Products</h1>
                                <div className="d-flex justify-content-between mb-2">
                                    <Link to={`/admin/product`} className='btn btn-dark'>
                                    <i class="bi bi-plus-lg"></i> Add Product
                                    </Link>
                                    <button className="btn btn-danger" onClick={handleBulkDelete}>
                                        Delete Selected
                                    </button>
                                </div>
                                <MUIDataTable
                                    title={"Product List"}
                                    columns={columns}
                                    data={data}
                                    options={{
                                        filterType: 'dropdown',
                                        responsive: 'vertical',
                                        pagination: true,
                                        selectableRows: 'none',
                                        expandableRows: true,
                                        expandableRowsHeader: false,
                                        renderExpandableRow: (rowData, rowMeta) => {
                                            const product = products[rowMeta.dataIndex];
                                            return (
                                                <tr>
                                                    <td colSpan={columns.length}>
                                                        {expandedRowRender(product)}
                                                    </td>
                                                </tr>
                                            );
                                        },
                                        rowsPerPage: 5,
                                        rowsPerPageOptions: [5, 10, 20, 50],
                                    }}
                                    className="table-header"
                                />
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductList;
