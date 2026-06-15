import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PropertyForm from '../components/PropertyForm';

function CreateListing() {
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    const res = await api.post('/properties', payload);
    navigate(`/properties/${res.data._id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add a New Listing</h1>
      <PropertyForm onSubmit={handleCreate} submitLabel="Create Listing" />
    </div>
  );
}

export default CreateListing;