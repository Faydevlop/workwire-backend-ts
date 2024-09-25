"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const jwt_1 = require("../../middlewares/jwt");
const refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    console.log('refreshToken from body:', refreshToken);
    if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token provided' });
        return;
    }
    try {
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        if (!decoded) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return;
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)(decoded.userId);
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.error('Error during refresh token process:', error);
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};
exports.refreshToken = refreshToken;
