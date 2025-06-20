const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser, getCurrentUser, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

// User profile routes
router.get('/me', auth, getCurrentUser);
router.put('/me', auth, updateProfile);

// Admin routes
router.get('/', auth, requireAdmin, getAllUsers);
router.get('/:id', auth, requireAdmin, getUserById);
router.put('/:id', auth, requireAdmin, updateUser);
router.delete('/:id', auth, requireAdmin, deleteUser);

module.exports = router; 