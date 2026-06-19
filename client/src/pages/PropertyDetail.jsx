import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Property not found.');
        } else {
          setError('Failed to load property. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    setDeleting(true);
    try {
      await api.delete(`/properties/${id}`);
      navigate('/my-listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-slate-500 py-20">Loading property...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="text-amber-500 font-medium hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  const { title, description, price, location, propertyType, images, owner } = property;
  const imageUrl = images && images.length > 0
    ? images[0]
    : 'https://via.placeholder.com/800x450?text=No+Image';

 const isOwner = user && owner && (owner._id === user._id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-80 object-cover rounded-lg mb-6"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/800x450?text=No+Image';
        }}
      />

      <div className="flex items-start justify-between mb-2">
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
          {propertyType}
        </span>
      </div>

      <p className="text-slate-500 mb-4">
        {location?.city}, {location?.country}
      </p>

      <p className="text-2xl font-bold text-slate-900 mb-6">
        FCFA {price?.toLocaleString()}
      </p>

      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-slate-800 mb-2">Description</h2>
        <p className="text-slate-600 whitespace-pre-line">{description}</p>
      </div>

      {owner?.username && (
        <p className="text-sm text-slate-500 mb-6">
          Listed by: <span className="font-medium text-slate-700">{owner.username}</span>
        </p>
      )}

      {isOwner && (
        <div className="flex gap-4">
          <Link
            to={`/edit-listing/${id}`}
            className="bg-slate-900 text-white px-6 py-2 rounded-md font-medium hover:bg-slate-800 transition"
          >
            Edit Listing
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-50 text-red-600 px-6 py-2 rounded-md font-medium hover:bg-red-100 transition disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Listing'}
          </button>
        </div>
      )}
    </div>
  );
}

export default PropertyDetail;
