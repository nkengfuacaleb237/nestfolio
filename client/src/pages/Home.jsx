import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";
import FilterSidebar from "../components/FilterSidebar";
import { useAuth } from "../context/AuthContext";

const FULL_TEXT = "Find a place that feels like home.";

function Home() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ city: "", minPrice: "", maxPrice: "" });
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    let timeout;
    if (typing) {
      if (indexRef.current < FULL_TEXT.length) {
        timeout = setTimeout(() => {
          setDisplayed(FULL_TEXT.slice(0, indexRef.current + 1));
          indexRef.current += 1;
        }, 60);
      } else {
        timeout = setTimeout(() => { setTyping(false); }, 2000);
      }
    } else {
      if (indexRef.current > 0) {
        timeout = setTimeout(() => {
          setDisplayed(FULL_TEXT.slice(0, indexRef.current - 1));
          indexRef.current -= 1;
        }, 35);
      } else {
        timeout = setTimeout(() => { setTyping(true); }, 500);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing]);

  const fetchProperties = async (activeFilters = {}) => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (activeFilters.city) params.city = activeFilters.city;
      if (activeFilters.minPrice) params.minPrice = activeFilters.minPrice;
      if (activeFilters.maxPrice) params.maxPrice = activeFilters.maxPrice;
      const res = await api.get("/properties", { params });
      setProperties(res.data);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const handleSearch = (e) => { if (e) e.preventDefault(); fetchProperties(filters); };
  const handleClear = () => { setFilters({ city: "", minPrice: "", maxPrice: "" }); fetchProperties({}); };

  return (
    <div>
      <section className="relative bg-[#0A0F1E] overflow-hidden min-h-[680px]">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
          alt="Modern property"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-20 sm:pb-28 flex flex-col">

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-10 self-start">
            <div className="w-2 h-2 bg-[#F5A623] rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Property Trust Marketplace</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight max-w-3xl" style={{minHeight: "140px"}}>
            {displayed}
            <span className="inline-block w-[3px] h-[0.9em] bg-[#F5A623] ml-1 align-middle animate-pulse" />
          </h1>

          <div style={{marginTop: "120px", marginBottom: "48px"}}>
            <a href="#listings" className="group relative overflow-hidden bg-transparent border-2 border-[#F5A623] text-[#F5A623] px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:text-[#0A0F1E] hover:shadow-2xl hover:shadow-[#F5A623]/40 hover:-translate-y-1 before:absolute before:inset-0 before:bg-[#F5A623] before:translate-y-full before:transition-transform before:duration-300 hover:before:translate-y-0 before:-z-10">
              Browse Properties
            </a>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#F5A623]/20 flex items-center justify-center group-hover:bg-[#F5A623]/30 transition-colors">
                <svg className="w-5 h-5 text-[#F5A623]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-xl leading-none">{properties.length}+</p>
                <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">Live Listings</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#F5A623]/20 flex items-center justify-center group-hover:bg-[#F5A623]/30 transition-colors">
                <svg className="w-5 h-5 text-[#F5A623]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-xl leading-none">Douala &amp; Yaounde</p>
                <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">Cities Covered</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#F5A623]/20 flex items-center justify-center group-hover:bg-[#F5A623]/30 transition-colors">
                <svg className="w-5 h-5 text-[#F5A623]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-xl leading-none">Verified</p>
                <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">Trusted Listings</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 flex-shrink-0">
            <FilterSidebar filters={filters} onChange={handleFilterChange} onSearch={handleSearch} onClear={handleClear} />
          </div>
          <div className="flex-1">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-52 bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-semibold text-[#0A0F1E] mb-1">Something went wrong</p>
                <p className="text-gray-400 text-sm">{error}</p>
              </div>
            )}
            {!loading && !error && properties.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-semibold text-[#0A0F1E] mb-1">No properties found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters or clear them to see all listings.</p>
              </div>
            )}
            {!loading && !error && properties.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

