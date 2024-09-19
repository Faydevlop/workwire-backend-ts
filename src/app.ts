import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import './modules/PayrollManagement/config/cronJobs'
import './modules/meetings/cronjob/meeting-cron'
import { Server } from 'socket.io';
import http from 'http';

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
import jobs from './modules/recruitment/routes/reqruitmentRoutes'
import { refreshToken } from './auth/authRoute/authRoute';
import Message from './modules/chat/chatModel';
import chat from './modules/chat/chatRoutes'
import notification from './modules/notification/routes/notificaitoRoutes'

const app = express();
const server = http.createServer(app)


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies to be sent
}));

app.use(cookieParser());

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
app.use('/jobs',jobs)
app.use('/chat',chat)
app.post('/refresh-token', refreshToken);
app.use('/notifications', notification);



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => res.send('server is ready'));


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const io = new Server(server,{
  cors:{
    origin:process.env.FRONTENDAPI,
    methods:['GET','POST']
  }
})

  io.on('connection',(socket)=>{
    // console.log('a user connected',socket.id);

    socket.on('message',async(data)=>{
      console.log('message from client',data);  

      const newMessage = new Message({
        sender:data.sender,
        receiver:data.receiver,
        content:data.content,
        timestamp:new Date()
      })

      await newMessage.save()


      io.emit('message',data)
      
    })



    

    // handle disconnect
    socket.on('disconnect',()=>{
      console.log('user disconnected',socket.id);
      
    })

  })


mongoose.connect(process.env.MONGO_URI!,{
  serverSelectionTimeoutMS: 50000 // Increase timeout
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});