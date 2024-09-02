import dotenv from 'dotenv';
dotenv.config();
import './modules/PayrollManagement/config/cronJobs'
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import adminRoutes from './modules/admin/routes/adminRoute';
import employeeRoutes from './modules/employee/routes/userRoutes'
import managerRoutes from './modules/manager/routes/managerRoutes'
import HrRoutes from './modules/hr/routes/HrRoutes'
import LeaveRoute from './modules/leaveManagement/routes/leaveRoutes'
import Department from './modules/Department/routes/departmentRoutes'
import TaskRoute from './modules/TaskManagement/routes/taskRoute'
import payroll from './modules/PayrollManagement/routes/payrollRoute'
import comment from './modules/TaskManagement/routes/commentRoute'
import meeting from './modules/meetings/routes/MeetingRoutes'

const app = express();


app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));


app.use('/admin', adminRoutes);
app.use('/employee',employeeRoutes)
app.use('/manager',managerRoutes)
app.use('/Hr',HrRoutes)
app.use('/leave',LeaveRoute)
app.use('/department',Department)
app.use('/task',TaskRoute)
app.use('/payroll',payroll)
app.use('/comment',comment)
app.use('/meeting',meeting)


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => res.send('server is ready'));


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
