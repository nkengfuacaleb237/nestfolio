import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  const { _id, title, price, location, images } = property;

  const imageUrl = images && images.length > 0 ? images[0] : null;

  return (
    <Link to={`/properties/${_id}`} className="group block">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#E8E2D6] mb-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-sm text-[#1C1B1A]/30">No photo</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-medium text-[#1C1B1A] leading-snug group-hover:text-[#C1622D] transition-colors">
          {title}
        </h3>
        <span className="text-sm font-medium text-[#1C1B1A]/70 whitespace-nowrap">
          ${price?.toLocaleString()}
        </span>
      </div>
      <p className="text-sm text-[#1C1B1A]/50 mt-0.5">
        {location?.city}, {location?.country}
      </p>
    </Link>
  );
}

export default PropertyCard;