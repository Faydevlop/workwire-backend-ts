import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import adminRoutes from './modules/admin/routes/adminRoute';
import employeeRoutes from './modules/employee/routes/userRoutes'

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());
// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/admin', adminRoutes);
app.use('/employee',employeeRoutes)

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => res.send('server is ready'));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
