// CatalogueAdmin.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Select, Option } from '@material-tailwind/react';
import Modal from './Modal';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function CatalogueAdmin() {
    const [catalogues, setCatalogues] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [catalogueData, setCatalogueData] = useState({
        product_name: '',
        mrp: '',
        gst_percentage: '',
        asin: '',
        upc: '',
        product_image_1: '',
        product_image_2: '',
        product_image_3: '',
        product_image_4: '',
        product_image_5: '',
        standardized: false,
        category: ''
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [sortCriteria, setSortCriteria] = useState('');

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchCatalogues();
        fetchCategories();
    }, []);

    const fetchCatalogues = async () => {
        try {
            const response = await axios.get(`${API_URL}/catalogue/get/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCatalogues(response.data);
        } catch (error) {
            console.error('Error fetching catalogues', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/catalogue/categories/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCatalogueData({ ...catalogueData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCatalogueData({ ...catalogueData, [name]: checked });
    };

    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };
    //TODO : edit this form and handle submit to update seller catalogue details
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (catalogueData.id) {
                await axios.put(`${API_URL}/catalogue/update-sellercatalogue/${catalogueData.id}/`, catalogueData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                const response = await axios.post(`${API_URL}/catalogue/create/`, catalogueData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setCatalogues([...catalogues, response.data]);
            }
            resetForm();
            setModalOpen(false);
            fetchCatalogues();
        } catch (error) {
            console.error('Error submitting catalogue', error);
        }
    };

    const resetForm = () => {
        setCatalogueData({
            product_name: '',
            mrp: '',
            gst_percentage: '',
            asin: '',
            upc: '',
            product_image_1: '',
            product_image_2: '',
            product_image_3: '',
            product_image_4: '',
            product_image_5: '',
            standardized: false,
            category: ''
        });
    };

    const handleEdit = (catalogue) => {
        setCatalogueData(catalogue);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/catalogue/delete-sellercatalogue/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCatalogues(catalogues.filter(catalogue => catalogue.id !== id));
        } catch (error) {
            console.error('Error deleting catalogue', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCatalogues = catalogues.filter((catalogue) =>
        catalogue.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCatalogues = sortCriteria
        ? filteredCatalogues.sort((a, b) => {
            if (sortCriteria === 'price') {
                return a.mrp - b.mrp;
            } else if (sortCriteria === 'category') {
                return a.category.localeCompare(b.category);
            } else {
                return 0;
            }
        })
        : filteredCatalogues;

    return (
        <div className="p-4 ">
            <h1 className="text-4xl font-bold my-4 text-center">Catalogue Admin</h1>
            <div className="flex justify-around items-center mb-4 flex-col gap-5">
                <div className='flex gap-5 w-[90%] m-auto'>
                    <div>
                        <Input
                            label='Search Catalogues'
                            id='searchbar'
                            type="text"
                            placeholder="Search Catalogues"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="border p-2 border-black rounded-xl"
                        />
                    </div>
                    <a href="">
                        
                    </a>
                    <Button
                    >
                        Add Catalogue
                    </Button>

                </div>
                <Select
                    value={sortCriteria}
                    label='Sort by'
                    onChange={handleSortChange}
                >
                    <Option value="price">Price</Option>
                    <Option value="category">Category</Option>
                </Select>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                catalogueData={catalogueData}
                handleInputChange={handleInputChange}
                handleCheckboxChange={handleCheckboxChange}
                categories={categories}
            />

            <div className=''>
                <h2 className="text-2xl my-4 ml-12">Catalogue List:</h2>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className=''>
                            <th className="py-2 text-start px-4 border-b border-gray-200">Name</th>
                            <th className="py-2 text-start px-4 border-b border-gray-200">MRP</th>
                            <th className="py-2 text-start px-4 border-b border-gray-200">GST Percentage</th>
                            <th className="py-2 text-start px-4 border-b border-gray-200">CSIN</th>
                            <th className="py-2 text-start px-4 border-b border-gray-200">EAN</th>
                            <th className="py-2 text-start px-4 border-b border-gray-200">Category</th>
                            <th className="py-2 text-start px-4 border-b border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCatalogues.map((catalogue, index) => (
                            <tr key={catalogue.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} border-t border-gray-200`}>
                                <td className="py-2 px-4">{catalogue.product_name}</td>
                                <td className="py-2 px-4">{catalogue.mrp}</td>
                                <td className="py-2 px-4">{catalogue.gst_percentage}</td>
                                <td className="py-2 px-4">{catalogue.csin}</td>
                                <td className="py-2 px-4">{catalogue.ean}</td>
                                <td className="py-2 px-4">{catalogue.category}</td>
                                <td className="py-2 px-4 flex gap-2 flex-wrap">
                                    <Button
                                        color='amber'
                                        onClick={() => handleEdit(catalogue)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color='red'
                                        onClick={() => handleDelete(catalogue.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CatalogueAdmin;