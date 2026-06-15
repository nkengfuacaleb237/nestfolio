import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import PropertyForm from '../components/PropertyForm';

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load property.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleUpdate = async (payload) => {
    await api.put(`/properties/${id}`, payload);
    navigate(`/properties/${id}`);
  };

  if (loading) {
    return <div className="text-center text-slate-500 py-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/my-listings" className="text-amber-500 font-medium hover:underline">
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Listing</h1>
      <PropertyForm
        initialData={property}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
      />
    </div>
  );
}

export default EditListing;