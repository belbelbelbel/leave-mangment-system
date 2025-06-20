const Notice = require('../models/Notice');

// Create notice (Admin)
const createNotice = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required.' });
        }

        const notice = new Notice({
            title,
            content,
            postedBy: req.user._id
        });

        await notice.save();

        res.status(201).json({
            message: 'Notice created successfully',
            notice
        });
    } catch (error) {
        console.error('Create notice error:', error);
        res.status(500).json({ message: 'Server error while creating notice.' });
    }
};

// Get all notices (All users)
const getAllNotices = async (req, res) => {
    try {
        const notices = await Notice.find({ isActive: true })
            .populate('postedBy', 'name')
            .sort({ postedDate: -1 });

        res.json(notices);
    } catch (error) {
        console.error('Get notices error:', error);
        res.status(500).json({ message: 'Server error while fetching notices.' });
    }
};

// Update notice (Admin)
const updateNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found.' });
        }

        if (title) notice.title = title;
        if (content) notice.content = content;

        await notice.save();

        res.json({
            message: 'Notice updated successfully',
            notice
        });
    } catch (error) {
        console.error('Update notice error:', error);
        res.status(500).json({ message: 'Server error while updating notice.' });
    }
};

// Delete notice (Admin)
const deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;

        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found.' });
        }

        // Soft delete by setting isActive to false
        notice.isActive = false;
        await notice.save();

        res.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        console.error('Delete notice error:', error);
        res.status(500).json({ message: 'Server error while deleting notice.' });
    }
};

module.exports = {
    createNotice,
    getAllNotices,
    updateNotice,
    deleteNotice
}; 