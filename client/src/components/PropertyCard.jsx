import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  const { _id, title, price, location, propertyType, images } = property;

  const imageUrl = images && images.length > 0
    ? images[0]
    : 'https://via.placeholder.com/400x250?text=No+Image';

  return (
    <Link
      to={`/properties/${_id}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden block"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
        }}
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-800 truncate">{title}</h3>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
            {propertyType}
          </span>
        </div>
        <p className="text-slate-500 text-sm mb-2">
          {location?.city}, {location?.country}
        </p>
        <p className="text-lg font-bold text-slate-900">
          ${price?.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export default PropertyCard;