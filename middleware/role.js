const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    next();
};

const requireEmployee = (req, res, next) => {
    if (req.user.role !== 'Employee') {
        return res.status(403).json({ message: 'Access denied. Employee role required.' });
    }
    next();
};

module.exports = {
    requireAdmin,
    requireEmployee
}; 