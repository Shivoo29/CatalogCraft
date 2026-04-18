import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, Typography, Button, Spinner } from '@material-tailwind/react';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [catalogues, setCatalogues] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3018').replace(/\/$/, '');

    useEffect(() => {
        const normalizeCatalogues = (payload) => {
            if (Array.isArray(payload)) return payload;
            if (Array.isArray(payload?.catalogues)) return payload.catalogues;
            if (Array.isArray(payload?.data)) return payload.data;
            if (Array.isArray(payload?.results)) return payload.results;
            return [];
        };

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoading(false);
            return;
        }

        // Fetch the user details from your API
        axios.get(`${backendUrl}/auth/user-details`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Add the token to the 'Authorization' header
                'Content-Type': 'application/json', // Adjust headers as needed
            }
        })
            .then((response) => {
                // Assuming the API response contains user data
                setUser(response.data);
                // Fetch the catalogues of the logged-in user
                return axios.get(`${backendUrl}/catalogue/get`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            })
            .then((response) => {
                setCatalogues(normalizeCatalogues(response.data));
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [backendUrl]);

    return (
        <div className="lux-shell">
            <div className="lux-container py-12 max-w-4xl mx-auto">
            {loading ? (
                <div className='flex justify-center items-center'> 
                <Spinner className=" h-16 w-16 text-white/50" />
                </div>
            ) : (
                <>
                    <Card className="mb-4 lux-panel !bg-white/[0.04] !border-white/10">
                        <CardHeader className="bg-slate-950/70 text-white p-5">
                            <Typography variant="h4" color="white">
                                Welcome
                            </Typography>
                        </CardHeader>
                        <CardBody>
                            <Typography variant="h6">Email:<span className='!font-normal text-white'> {user?.email || '-'}</span></Typography>
                            <Typography variant="h6">Name: <span className='!font-normal text-white'>{user?.name || '-'}</span></Typography>
                            {/* <Typography variant="h6">Number<span className='!font-normal text-black'>: {user.number}</Typography> */}
                            <Typography variant="h6">Role: <span className='!font-normal text-white'>{user?.role || '-'}</span></Typography>
                        </CardBody>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="lux-panel !bg-white/[0.04] !border-white/10">
                            <CardBody>
                                <Typography variant="h6" className="mb-2">Your Total Catalogues</Typography>
                                <Typography variant="h4">{catalogues.length}</Typography>
                            </CardBody>
                        </Card>
                        <Card className="lux-panel !bg-white/[0.04] !border-white/10">
                            <CardBody>
                                <Typography variant="h6" className="mb-2">Complete Catalogues</Typography>
                                <Typography variant="h4">{catalogues.filter(catalogue => catalogue.complete).length}</Typography>
                            </CardBody>
                        </Card>
                    </div>
                    <br />
                    <div>
                        <Card className="lux-panel !bg-white/[0.04] !border-white/10">
                            <CardBody className="flex flex-col items-start justify-center">
                                <Typography variant="h6" className="mb-2">Wanna add a new Product?</Typography>
                                <Link to={'/product-search'} className='w-fit'>
                                    <Button className="w-full bg-[#ff5a1f] hover:bg-[#ff7a2a] text-black font-bold py-2 px-4 rounded">
                                        Create Catalog
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>
                    </div>
                    <br />
                    <div>
                        <br />
                        <Card className="lux-panel !bg-white/[0.04] !border-white/10">
                            <CardHeader className="flex justify-between items-center p-4">
                                <Typography variant="h6" className='!text-white'>
                                    Your Catalogues
                                </Typography>
                                <Link to={'/my-cata'}>
                                    <Button variant="text" className="!text-[#ff5a1f]">
                                        View All
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardBody>
                                {catalogues.slice(0, 5).map((catalogue) => (
                                    <div key={catalogue.id || catalogue._id} className="mb-4 border border-white/10 rounded-xl bg-white/[0.03] shadow-[0_18px_60px_rgba(0,0,0,0.25)] p-5">
                                        {catalogue.product_image_1 ? (
                                            <img
                                                src={String(catalogue.product_image_1).startsWith('http') ? catalogue.product_image_1 : `${backendUrl}${catalogue.product_image_1}`}
                                                alt={`${catalogue.name} image`}
                                                className="w-32 h-24 object-cover mb-2 rounded-lg"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="mb-2 flex h-24 w-32 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-center text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                                No image
                                            </div>
                                        )}
                                        <Typography variant="h6" className="font-bold text-white">{catalogue.product_name}</Typography>
                                        <Typography variant="body2" className="text-slate-300">{catalogue.description}</Typography>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                    </div>
                </>
            )}
            </div>
        </div>
    );
}

export default Dashboard;
