// middleware/checkAuthenticatedAPI.js

module.exports = function (req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ success: false, message: 'Unauthorized. Please log in to upload files.' });
}
// This middleware checks if the user is authenticated before allowing access to protected API routes.