import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { EcommerceCard } from './Utils/EcommerceCard';
import { Spinner } from '@material-tailwind/react';
import { formatINR } from '../utils/currency';

function Catalogs() {
  const [catalogsByCategory, setCatalogsByCategory] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const url = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3018').replace(/\/$/, '');

  useEffect(() => {
    const normalizeCatalogs = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.catalogues)) return payload.catalogues;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.results)) return payload.results;
      return [];
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/catalogue/get-all`);
        const catalogs = normalizeCatalogs(response.data);

        // Group catalogs by category
        const catalogsGroupedByCategory = {};
        catalogs.forEach(catalog => {
          const categoryKey =
            typeof catalog?.category === "object"
              ? catalog?.category?.category
              : catalog?.category;
          const safeKey = categoryKey || "Uncategorized";

          if (safeKey in catalogsGroupedByCategory) {
            catalogsGroupedByCategory[safeKey].push(catalog);
          } else {
            catalogsGroupedByCategory[safeKey] = [catalog];
          }
        });

        setCatalogsByCategory(catalogsGroupedByCategory);
      } catch (error) {
        console.error('Error fetching catalogs:', error);
        setErrorMessage('Unable to load catalogues right now. Please check backend connection and try again.');
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, [url]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
       <Spinner/>
      </div>
    );
  }

  return (
    <div className="lux-shell">
      <div className="lux-container py-12">
        <div className="lux-panel-highlight p-8 md:p-10">
          <span className="lux-chip">Catalogue showcase</span>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
            Browse curated products in a premium commerce interface.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Explore categories, scan visual inventory quickly, and open products
            in a cleaner, more detailed experience designed for modern ecommerce.
          </p>
        </div>

        <div className="mt-10 space-y-10">
      <h2 className="text-sm uppercase tracking-[0.26em] text-slate-500">Catalogs by Category</h2>
      {errorMessage ? (
        <div className="lux-panel p-6 text-sm text-rose-200">{errorMessage}</div>
      ) : null}
      {!errorMessage && Object.keys(catalogsByCategory).length === 0 ? (
        <div className="lux-panel p-6 text-sm text-slate-300">
          No catalogues found yet. Add catalogue data to see products here.
        </div>
      ) : null}
      {Object.entries(catalogsByCategory).map(([category, catalogs]) => (
        <section key={category} className="lux-panel p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Category</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white md:text-3xl">{category}</h2>
            </div>
            <p className="text-sm text-slate-400">{catalogs.length} curated products</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {catalogs.map((catalog) => {
              const catalogId = catalog?._id || catalog?.id;
              if (!catalogId) return null;

              const productImage = catalog?.product_image_1;
              const imageUrl = productImage
                ? String(productImage).startsWith("http")
                  ? productImage
                  : `${url}${productImage}`
                : null;

              return (
                <Link key={catalogId} to={`/catalogue/${catalogId}`} className="block">
                  <EcommerceCard
                    imageUrl={imageUrl}
                    productName={catalog.product_name}
                    price={formatINR(catalog.selling_price)}
                    description={catalog.description || `MRP: ${catalog.mrp}`}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      ))}
        </div>
      </div>
    </div>
  );
}

export default Catalogs;
