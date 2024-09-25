"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jwt_1 = require("./jwt");
const protect = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        if (decoded) {
            req.user = decoded;
            next();
        }
        else {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
exports.protect = protect;
