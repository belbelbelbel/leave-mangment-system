const express = require('express');
const router = express.Router();
const { createNotice, getAllNotices, updateNotice, deleteNotice } = require('../controllers/noticeController');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

// Public routes (all authenticated users can view notices)
router.get('/', auth, getAllNotices);

// Admin routes
router.post('/', auth, requireAdmin, createNotice);
router.put('/:id', auth, requireAdmin, updateNotice);
router.delete('/:id', auth, requireAdmin, deleteNotice);

module.exports = router;
