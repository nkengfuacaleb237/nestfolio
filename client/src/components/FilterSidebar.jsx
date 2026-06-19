function FilterSidebar({ filters, onChange, onSearch, onClear }) {
  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-24">
      <h2 className="font-bold text-[#0A0F1E] text-lg mb-6">Search Filters</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#0A0F1E] mb-2">City</label>
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={onChange}
            placeholder="Example: Douala"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0A0F1E] mb-2">Minimum Price</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={onChange}
            placeholder="100000"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0A0F1E] mb-2">Maximum Price</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={onChange}
            placeholder="300000"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623] transition-all"
          />
        </div>

        <button
          onClick={onSearch}
          className="w-full bg-[#0A0F1E] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1a2035] transition-colors"
        >
          Apply Filters
        </button>

        <button
          onClick={onClear}
          className="w-full border border-gray-200 text-[#0A0F1E] py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}

export default FilterSidebar;