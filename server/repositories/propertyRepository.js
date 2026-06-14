const Property = require('../models/Property');

// Create a new property listing
const createProperty = async (propertyData) => {
  const property = new Property(propertyData);
  return await property.save();
};

// Get all properties, with optional filters (city, price range)
const findAllProperties = async (filters = {}) => {
  const query = {};

  if (filters.city) {
    query['location.city'] = { $regex: filters.city, $options: 'i' };
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  return await Property.find(query).populate('owner', 'username email');
};

// Get all properties belonging to a specific user
const findPropertiesByOwner = async (ownerId) => {
  return await Property.find({ owner: ownerId });
};

// Get a single property by ID
const findPropertyById = async (id) => {
  return await Property.findById(id);
};

// Update a property by ID
const updatePropertyById = async (id, updateData) => {
  return await Property.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

// Delete a property by ID
const deletePropertyById = async (id) => {
  return await Property.findByIdAndDelete(id);
};

module.exports = {
  createProperty,
  findAllProperties,
  findPropertiesByOwner,
  findPropertyById,
  updatePropertyById,
  deletePropertyById,
};