import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Payroll document
interface IPayroll extends Document {
  employee: mongoose.Schema.Types.ObjectId;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  payDate: Date;
  baseSalary: number;
  bonuses: number;
  totalAmount: number;
  deductions: number;
  paymentStatus: 'Pending' | 'Paid' | 'Overdue';
  paymentMethod: string;
}

// Define the Payroll Schema
const payrollSchema: Schema<IPayroll> = new Schema({
  // Reference to the Employee model
  employee: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Payroll period and dates
  payPeriodStart: { 
    type: Date, 
    required: true 
  },
  payPeriodEnd: { 
    type: Date, 
    required: true 
  },
  payDate: { 
    type: Date, 
    required: true 
  },

  // Compensation details
  baseSalary: { 
    type: Number, 
    required: true 
  },
  bonuses: { 
    type: Number, 
    default: 0 
  },

  totalAmount: { 
    type: Number, 
    default: 0 
  },
  deductions: { 
    type: Number, 
    default: 0 
  },


  // Payment status and method
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid','Overdue'], 
    default: 'Pending' 
  },
  paymentMethod: { 
    type: String, 
    default: 'Direct Deposit' 
  },
});

// Export the Payroll model
const Payroll = mongoose.model<IPayroll>('Payroll', payrollSchema);
export default Payroll;
