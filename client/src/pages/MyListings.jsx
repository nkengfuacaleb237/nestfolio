import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';

function MyListings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyListings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/properties/my-listings');
        setProperties(res.data);
      } catch (err) {
        setError('Failed to load your listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-800">My Listings</h1>
        <Link
          to="/create-listing"
          className="bg-amber-400 text-slate-900 px-4 py-2 rounded-md font-medium hover:bg-amber-300 transition"
        >
          + Add Listing
        </Link>
      </div>

      {loading && (
        <div className="text-center text-slate-500 py-12">Loading your listings...</div>
      )}

      {!loading && error && (
        <div className="text-center text-red-500 py-12">{error}</div>
      )}

      {!loading && !error && properties.length === 0 && (
        <div className="text-center text-slate-500 py-12">
          You haven't listed any properties yet.{' '}
          <Link to="/create-listing" className="text-amber-500 font-medium hover:underline">
            Create your first listing
          </Link>
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

export default MyListings;