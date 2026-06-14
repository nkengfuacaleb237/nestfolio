const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createListing,
  getAllListings,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
} = require('../controllers/propertyController');

// Public routes
router.get('/', getAllListings);

// Private routes (must come before "/:id" to avoid route conflicts)
router.get('/my-listings', protect, getMyListings);
router.post('/', protect, createListing);

// Public route with param
router.get('/:id', getListingById);

// Private routes with param
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;