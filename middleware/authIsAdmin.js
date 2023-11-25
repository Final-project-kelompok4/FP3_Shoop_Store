const isAdminRoleMiddleware = (req, res, next) => {
    const user = req.userData;

    if (!user || user.role !== "admin") {
        return res.status(403).json({
            status: 403,
            error: 'Forbidden - Diperlukan akses admin',
        });
    }

    next();
};

    module.exports = {
        isAdminRoleMiddleware,
    };