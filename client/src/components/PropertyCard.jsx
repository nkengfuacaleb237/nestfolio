import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  const title = property.title;
  const description = property.description;
  const price = property.price;
  const location = property.location;
  const propertyType = property.propertyType;
  const images = property.images;
  const _id = property._id;

  const imageUrl = images && images.length > 0 ? images[0] : null;

  return (
    <Link to={"/properties/" + _id} className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-[#F5A623] text-xs font-semibold uppercase tracking-wide mb-1.5">
          {propertyType}
        </p>

        <h3 className="font-bold text-[#0A0F1E] text-base leading-snug mb-1 group-hover:text-[#F5A623] transition-colors line-clamp-2">
          {title}
        </h3>

        {description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{location && location.city}, {location && location.country}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-[#F5A623] font-bold text-lg">
            FCFA {price && price.toLocaleString()}
          </p>
          <div className="w-8 h-8 bg-[#F5A623]/10 rounded-full flex items-center justify-center group-hover:bg-[#F5A623] transition-colors">
            <svg className="w-4 h-4 text-[#F5A623] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
