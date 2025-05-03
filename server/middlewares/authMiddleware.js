import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Check if user is logged in using JWT
export const isLoggedIn = async (req, res, next) => {
    try {
        let token;

        // Get token from cookies
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        // Or from Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if user is active
            // if (!user.isActive) {
            //     return res.status(401).json({
            //         success: false,
            //         message: 'Your account has been deactivated'
            //     });
            // }

            // Attach user to request object
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Your session has expired. Please login again'
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};