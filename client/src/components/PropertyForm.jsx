import { useState } from 'react';

const initialState = {
  title: '',
  description: '',
  price: '',
  city: '',
  country: '',
  propertyType: 'Apartment',
  images: '',
};

function PropertyForm({ initialData, onSubmit, submitLabel = 'Submit' }) {
  const [formData, setFormData] = useState(() => {
    if (!initialData) return initialState;
    return {
      title: initialData.title || '',
      description: initialData.description || '',
      price: initialData.price || '',
      city: initialData.location?.city || '',
      country: initialData.location?.country || '',
      propertyType: initialData.propertyType || 'Apartment',
      images: (initialData.images || []).join(', '),
    };
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.title.trim()) return 'Title is required.';
    if (!formData.description.trim()) return 'Description is required.';
    if (!formData.price || Number(formData.price) <= 0) {
      return 'Price must be a positive number.';
    }
    if (!formData.city.trim()) return 'City is required.';
    if (!formData.country.trim()) return 'Country is required.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      location: {
        city: formData.city.trim(),
        country: formData.country.trim(),
      },
      propertyType: formData.propertyType,
      images: formData.images
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url.length > 0),
    };

    setLoading(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-md px-4 py-2">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Cozy Downtown Apartment"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Describe the property..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price (FCFA)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="450"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Studio">Studio</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Yaounde"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Cameroon"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Image URLs (comma-separated)
        </label>
        <input
          type="text"
          name="images"
          value={formData.images}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-slate-900 text-white px-6 py-2 rounded-md font-medium hover:bg-slate-800 transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}

export default PropertyForm;