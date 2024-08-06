"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
// import adminRoutes from './modules/admin/routes/adminRoute';
const app = (0, express_1.default)();
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Middleware to parse URL-encoded request bodies
app.use(express_1.default.urlencoded({ extended: true }));
// Mount routes
// app.use('/admin', adminRoutes);
// View engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.send('server is ready'));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
