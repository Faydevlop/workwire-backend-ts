"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const payrollModel_1 = __importDefault(require("../models/payrollModel"));
const moment_1 = __importDefault(require("moment"));
const checkAndUpdatePayments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = (0, moment_1.default)();
        const payrolls = yield payrollModel_1.default.find({ paymentStatus: 'Pending' });
        for (const payroll of payrolls) {
            const payPeriodStart = (0, moment_1.default)(payroll.payPeriodStart);
            const payPeriodEnd = (0, moment_1.default)(payroll.payPeriodEnd);
            const payPeriod = payroll.payPeriod;
            let nextPaymentDate = null;
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
                yield payroll.save();
                console.log(`Payment status updated to Pending for payroll ID: ${payroll._id}`);
                sendNotificationToAdmin(payroll);
            }
        }
    }
    catch (error) {
        console.error("Error in cron job:", error);
    }
});
const sendNotificationToAdmin = (payroll) => __awaiter(void 0, void 0, void 0, function* () {
    // Implement  notification logic here
    console.log(`Notification sent to admin: Employee ID ${payroll.employee} is due for payment.`);
});
node_cron_1.default.schedule('0 0 * * *', checkAndUpdatePayments);
exports.default = checkAndUpdatePayments;
