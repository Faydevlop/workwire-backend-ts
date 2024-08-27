import cron from 'node-cron';
import Payroll from '../models/payrollModel';
import moment from 'moment';


const checkAndUpdatePayments = async (): Promise<void> => {
    try {
        const currentDate = moment();

       
        const payrolls = await Payroll.find({ paymentStatus: 'Pending' });

        for (const payroll of payrolls) {
            const payPeriodStart = moment(payroll.payPeriodStart);
            const payPeriodEnd = moment(payroll.payPeriodEnd);
            const payPeriod = payroll.payPeriod;
            
        
            let nextPaymentDate: moment.Moment | null = null;

            switch (payPeriod) {
                case "Weekly":
                    nextPaymentDate = payPeriodStart.clone().add(1, 'weeks').startOf('week');
                    break;
                case "Biweekly":
                    nextPaymentDate = payPeriodStart.clone().add(2, 'weeks').startOf('week');
                    break;
                case "Semi-monthly":
                    nextPaymentDate = payPeriodStart.clone().add(15, 'days');
                    break;
                case "Monthly":
                    nextPaymentDate = payPeriodStart.clone().add(1, 'months').startOf('month');
                    break;
                default:
                    console.log('Unknown pay period');
                    continue;
            }

          
            if (currentDate.isSameOrAfter(nextPaymentDate, 'day')) {
          
                payroll.paymentStatus = 'Pending'; 
                await payroll.save();
                console.log(`Payment status updated to Pending for payroll ID: ${payroll._id}`);
                
               
                sendNotificationToAdmin(payroll);
            }
        }

    } catch (error) {
        console.error("Error in cron job:", error);
    }
};


const sendNotificationToAdmin = async (payroll: any) => {
    // Implement  notification logic here
    console.log(`Notification sent to admin: Employee ID ${payroll.employee} is due for payment.`);
};


cron.schedule('0 0 * * *', checkAndUpdatePayments);

export default checkAndUpdatePayments;
