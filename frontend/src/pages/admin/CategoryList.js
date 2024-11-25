import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import MUIDataTable from 'mui-datatables';
import MetaData from '../../components/Layout/Metadata';
import Loader from '../../components/Layout/Loader';
import Sidebar from './SideBar';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox'; 
import '../../App.css';

const CategoryList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);

// API ENDPOINT FOR CATEGORY
    const config = useMemo(() => ({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }), []);

    const listCategories = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:4001/api/v1/admin/categories`, config);
            setCategories(data.category);
        } catch (error) {
            setError(error.response ? error.response.data.message : error.message || 'Error fetching categories');
        } finally {
            setLoading(false);
        }
    }, [config]);

    useEffect(() => {
        listCategories();
    }, [listCategories]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' });
            setError('');
        }
    }, [error]);

// API ENPOINT REQ FOR CAT EDIT AND ADDPRODUCT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (modalMode === 'add') {
                const response = await axios.post('http://localhost:4001/api/v1/admin/category/new', { name, description }, config);
                toast.success('Category created successfully!', { position: 'bottom-right' });
                setCategories(prev => [...prev, response.data.category]);
            } else {
                const response = await axios.put(`http://localhost:4001/api/v1/admin/category/${editCategoryId}`, { name, description }, config);
                toast.success('Category updated successfully!', { position: 'bottom-right' });
                setCategories(prev => prev.map(category => (category._id === editCategoryId ? response.data.category : category)));
            }
            setName('');
            setDescription('');
            setShowModal(false);
        } catch (error) {
            toast.error(error.response.data.message || 'Operation failed', { position: 'bottom-right' });
        } finally {
            setLoading(false);
        }
    };

// SINGLE CAT DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("All the child products will be deleted, Are you sure you want to delete this category?")) return;
        try {
            await axios.delete(`http://localhost:4001/api/v1/admin/category/${id}`, config);
            toast.success('Category deleted successfully!', { position: 'bottom-right' });
            setCategories(prev => prev.filter(category => category._id !== id));
        } catch (error) {
            toast.error(error.response?.data.message || 'Failed to delete category', { position: 'bottom-right' });
        }
    };

// BULKDELETE
    const handleBulkDelete = async () => {
        if (selectedCategories.length === 0) {
            toast.warn('No categories selected for deletion', { position: 'bottom-right' });
            return;
        }
        
        if (!window.confirm(`All the child products will be deleted, Are you sure you want to delete ${selectedCategories.length} categories?`)) return;

        try {
            await Promise.all(selectedCategories.map(id => axios.delete(`http://localhost:4001/api/v1/admin/category/${id}`, config)));
            toast.success('Selected categories deleted successfully!', { position: 'bottom-right' });
            setCategories(prev => prev.filter(category => !selectedCategories.includes(category._id)));
            setSelectedCategories([]); // Clear selected categories
        } catch (error) {
            toast.error(error.response?.data.message || 'Failed to delete selected categories', { position: 'bottom-right' });
        }
    };
// MODAL CONTROLLERS
    const openModal = (category = null) => {
        if (category) {
            setModalMode('edit');
            setEditCategoryId(category._id);
            setName(category.name);
            setDescription(category.description || '');
        } else {
            setModalMode('add');
            setName('');
            setDescription('');
        }
        setShowModal(true);
    };

// SELECT ALL FOR BULK DELETE
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedCategories(categories.map(category => category._id));
        } else {
            setSelectedCategories([]);
        }
    };

// KEEP SELECTED CAT 
    const handleSelectCategory = (id) => {
        setSelectedCategories(prev => {
            if (prev.includes(id)) {
                return prev.filter(selectedId => selectedId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

//    COLUMNS
const columns = [
    {
        name: "select",
        label: "Select",
        options: {
            filter: false,
            sort: false,
            customHeadRender: () => (
                <th>
                    <Checkbox checked={selectedCategories.length === categories.length} onChange={handleSelectAll} />
                </th>
            ),
            customBodyRender: (value, tableMeta) => {
                const category = categories[tableMeta.rowIndex];
                return (
                    <Checkbox
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleSelectCategory(category._id)}
                    />
                );
            },
        },
    },
    {
        name: "name",
        label: "Category Name",
    },
    {
        name: "description",
        label: "Description",
        options: {
            display: false,
        },
    },
    {
        name: "actions",
        label: "Actions",
        options: {
            customBodyRender: (value, tableMeta) => {
                const category = categories[tableMeta.rowIndex];
                return (
                    <Fragment key={category._id}> {/* Make sure this is unique */}
                        <button className="btn btn-warning py-1 px-2" onClick={() => openModal(category)}>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => handleDelete(category._id)}>
                            <i className="bi bi-trash3-fill"></i>
                        </button>
                    </Fragment>
                );
            },
        },
    },
    
];


// EXPANDABLE ROWS DETAILS
    const options = {
        selectableRows: false, 
        expandableRows: true,
        expandableRowsOnClick: true,
        renderExpandableRow: (rowData, rowMeta) => {
            const category = categories[rowMeta.dataIndex];
            return (
                <tr>
                    <td colSpan={3}>
                    <div className="expandable-row">
                        <div className="product-details">
                            <p><strong>Description:</strong> {category.description || 'No description available'}</p>
                        </div>
                    </div>
                    </td>
                </tr>
            );
        },
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20, 50],
    };

    return (
        <Fragment>
            <MetaData title={'All Categories'} />
            <ToastContainer />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-8 mb-5">
                    <Fragment>
                        <div className="table-container"> {/* Added table container for styling */}
                        <h1 className="products_heading">All Categories</h1>
                        <Button variant="" className='btn-danger mb-2' onClick={handleBulkDelete}><i className="bi bi-trash3-fill"></i></Button>
                        <Button variant="" className='btn-dark mb-2 ml-2' onClick={() => openModal()}><i className="bi bi-plus-lg"></i> New Category</Button>
                            {loading ? <Loader /> : (
                                <MUIDataTable
                                    title={""}
                                    data={categories}
                                    columns={columns}
                                    options={options}
                                />
                            )}
                        </div>
                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>{modalMode === 'add' ? 'Add New Category' : 'Edit Category'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Category Name</label>
                                        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                    <Button type="submit" className="mt-3 btn btn-dark">{modalMode === 'add' ? 'Add Category' : 'Update Category'}</Button>
                                </form>
                            </Modal.Body>
                        </Modal>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default CategoryList;
