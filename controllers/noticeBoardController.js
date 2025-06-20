const Notice = require('../models/Notice');

// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add a new notice (Admin)
exports.addNotice = async (req, res) => {
  const { title, body, type } = req.body;
  try {
    const notice = new Notice({ title, body, type });
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit a notice (Admin)
exports.editNotice = async (req, res) => {
  const { title, body, type } = req.body;
  try {
    const updated = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, body, type },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Notice not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a notice (Admin)
exports.deleteNotice = async (req, res) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
