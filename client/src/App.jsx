import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyListings from './pages/MyListings';
import PropertyDetail from './pages/PropertyDetail';
import CreateListing from './pages/CreateListing';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;