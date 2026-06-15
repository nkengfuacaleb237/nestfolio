import { useState, useEffect } from 'react';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchProperties = async (activeFilters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (activeFilters.city) params.city = activeFilters.city;
      if (activeFilters.minPrice) params.minPrice = activeFilters.minPrice;
      if (activeFilters.maxPrice) params.maxPrice = activeFilters.maxPrice;

      const res = await api.get('/properties', { params });
      setProperties(res.data);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(filters);
  };

  const handleClear = () => {
    setFilters({ city: '', minPrice: '', maxPrice: '' });
    fetchProperties({});
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Find your next place
      </h1>

      {/* Filter Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white shadow-sm rounded-lg p-4 mb-8 flex flex-col sm:flex-row gap-4"
      >
        <input
          type="text"
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
          placeholder="City"
          className="flex-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          placeholder="Min Price"
          className="flex-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          placeholder="Max Price"
          className="flex-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          type="submit"
          className="bg-slate-900 text-white px-6 py-2 rounded-md font-medium hover:bg-slate-800 transition"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-slate-100 text-slate-700 px-6 py-2 rounded-md font-medium hover:bg-slate-200 transition"
        >
          Clear
        </button>
      </form>

      {/* Content States */}
      {loading && (
        <div className="text-center text-slate-500 py-12">Loading properties...</div>
      )}

      {!loading && error && (
        <div className="text-center text-red-500 py-12">{error}</div>
      )}

      {!loading && !error && properties.length === 0 && (
        <div className="text-center text-slate-500 py-12">
          No properties found. Try adjusting your search.
        </div>
      )}

      {!loading && !error && properties.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;