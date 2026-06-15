const {
  createProperty,
  findAllProperties,
  findPropertiesByOwner,
  findPropertyById,
  updatePropertyById,
  deletePropertyById,
} = require('../repositories/propertyRepository');

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private
const createListing = async (req, res) => {
  try {
    const { title, description, price, location, propertyType, images } = req.body;

    // Basic validation
    if (!title || !description || !price || !location?.city || !location?.country || !propertyType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const property = await createProperty({
      title,
      description,
      price,
      location,
      propertyType,
      images,
      owner: req.user.id,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all properties (public feed) with optional filters
// @route   GET /api/properties
// @access  Public
const getAllListings = async (req, res) => {
  try {
    const { city, minPrice, maxPrice } = req.query;
    const properties = await findAllProperties({ city, minPrice, maxPrice });
    res.status(200).json(properties);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged-in user's own listings
// @route   GET /api/properties/my-listings
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const properties = await findPropertiesByOwner(req.user.id);
    res.status(200).json(properties);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get a single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const property = await findPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a property (owner only)
// @route   PUT /api/properties/:id
// @access  Private
const updateListing = async (req, res) => {
  try {
    const property = await findPropertyById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Ownership check
    if (property.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this listing' });
    }

    const updated = await updatePropertyById(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a property (owner only)
// @route   DELETE /api/properties/:id
// @access  Private
const deleteListing = async (req, res) => {
  try {
    const property = await findPropertyById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Ownership check
    if (property.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await deletePropertyById(req.params.id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
};