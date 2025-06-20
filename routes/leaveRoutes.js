const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

// Employee routes
router.post('/', auth, applyLeave);
router.get('/', auth, getMyLeaves);

// Admin routes
router.get('/all', auth, requireAdmin, getAllLeaves);
router.put('/:id', auth, requireAdmin, updateLeaveStatus);

module.exports = router;
