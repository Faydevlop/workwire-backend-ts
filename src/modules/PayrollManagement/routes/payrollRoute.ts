import express , {Router} from 'express'
import { addPay, AddPayroll, listallUsers, listDepartmetentwise, listEmployee, listspecificId, showUser } from '../controllers/payrollController';

const router:Router = express.Router();
// adding payroll
router.post('/addpayroll',AddPayroll);
// listing employee who does not have payroll
router.get('/listEmpo',listEmployee)
// lsiting add employee details   
router.get('/listusers',listallUsers)
// listing of specific details 
router.get('/listdetails/:payrollId',listspecificId)
// listing of payroll in deparmentwise
router.get('/listdepartmentwise/:managerId',listDepartmetentwise)
// show user for deduction and bonus (manager)
router.get('/showdata/:userId',showUser)
// adding deduction and the bouneses
router.post('/addpay/:payrollId',addPay)


export default router