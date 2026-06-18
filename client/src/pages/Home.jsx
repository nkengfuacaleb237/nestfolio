import { useState, useEffect } from 'react';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({ city: '', minPrice: '', maxPrice: '' });

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
    <div>
      {/* Hero */}
      
      <section className="relative h-[70vh] min-h-[480px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80"
          alt="A bright modern living room"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1C1B1A]/35" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <h1 className="font-display text-5xl sm:text-7xl font-semibold leading-[1.05] tracking-tight text-[#FAF6F0] max-w-2xl drop-shadow-sm">
            Find a place that feels like home.
          </h1>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-7 relative z-10">
        <form
          onSubmit={handleSearch}
          className="bg-white border border-[#E8E2D6] rounded-2xl shadow-lg shadow-[#1C1B1A]/5 p-3 flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="City"
            className="flex-1 px-4 py-3 rounded-xl border border-transparent focus:border-[#C1622D]/30 bg-[#FAF6F0] text-sm focus:outline-none transition-colors"
          />
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min price"
            className="sm:w-32 px-4 py-3 rounded-xl border border-transparent focus:border-[#C1622D]/30 bg-[#FAF6F0] text-sm focus:outline-none transition-colors"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max price"
            className="sm:w-32 px-4 py-3 rounded-xl border border-transparent focus:border-[#C1622D]/30 bg-[#FAF6F0] text-sm focus:outline-none transition-colors"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-[#1C1B1A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#1C1B1A]/85 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-3 rounded-xl text-sm font-medium text-[#1C1B1A]/50 hover:text-[#1C1B1A] transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 mt-4">
        {loading && (
          <div className="text-center text-[#1C1B1A]/40 py-24 font-display text-xl">
            Loading listings…
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-24">
            <p className="font-display text-xl text-[#1C1B1A] mb-2">Something went wrong</p>
            <p className="text-[#1C1B1A]/50 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-[#1C1B1A] mb-2">No matches yet</p>
            <p className="text-[#1C1B1A]/50 text-sm">Try a different city or clear your filters.</p>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;