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
exports.listViewdata = exports.listdataspecific = exports.hrlisting = exports.addPay = exports.showUser = exports.listDepartmetentwise = exports.listspecificId = exports.listallUsers = exports.listEmployee = exports.UpdatePaymentStatus = exports.UpdatePayroll = exports.AddPayroll = void 0;
const payrollModel_1 = __importDefault(require("../models/payrollModel"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const calculateTotalPay = (baseSalary, // Assume this is the annual salary
bonus, deductions, payPeriod, payPeriodStart, payPeriodEnd) => {
    const startDate = new Date(payPeriodStart);
    const endDate = new Date(payPeriodEnd);
    const monthsCount = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
    const monthlyBaseSalary = baseSalary / 12;
    const perMonthSalary = Math.round(monthlyBaseSalary + bonus - deductions);
    const totalAmount = Math.round(perMonthSalary * monthsCount);
    return { totalAmount, perMonthSalary };
};
const AddPayroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeId, payPeriodStart, payPeriodEnd, payPeriod, baseSalary, bonus, deductions, paymentStatus, paymentMethod } = req.body;
        if (!employeeId || !payPeriodStart || !payPeriodEnd || !payPeriod || !baseSalary || !paymentStatus || !paymentMethod) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        // Calculate the total amount and per month salary based on the inputs
        const { totalAmount, perMonthSalary } = calculateTotalPay(baseSalary, bonus || 0, deductions || 0, payPeriod, new Date(payPeriodStart), new Date(payPeriodEnd));
        const newPayroll = new payrollModel_1.default({
            employee: employeeId,
            payPeriodStart,
            payPeriodEnd,
            payPeriod,
            baseSalary,
            bonuses: 0,
            deductions: 0,
            totalAmount: totalAmount,
            permonthsalary: Number(perMonthSalary),
            paymentStatus,
            paymentMethod,
        });
        const user = yield userModel_1.default.findById(employeeId);
        if (!user) {
            res.status(400).json({ message: "User Not Found" });
            return;
        }
        user.payroll = newPayroll._id;
        yield user.save();
        yield newPayroll.save();
        res.status(201).json({ message: "Payroll record Updated successfully", data: newPayroll });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.AddPayroll = AddPayroll;
const UpdatePayroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Assuming the payroll ID is passed as a route parameter
        const { employeeId, payPeriodStart, payPeriodEnd, payPeriod, baseSalary, bonus, deductions, paymentStatus, paymentMethod } = req.body;
        if (!id || !employeeId || !payPeriodStart || !payPeriodEnd || !payPeriod || !baseSalary || !paymentStatus || !paymentMethod) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        // Find the payroll record by ID
        const payroll = yield payrollModel_1.default.findById(id);
        if (!payroll) {
            res.status(404).json({ message: "Payroll record not found" });
            return;
        }
        // Calculate the total amount and per month salary based on the updated inputs
        const { totalAmount, perMonthSalary } = calculateTotalPay(baseSalary, bonus || 0, deductions || 0, payPeriod, new Date(payPeriodStart), new Date(payPeriodEnd));
        // Update the payroll record
        payroll.employee = employeeId;
        payroll.payPeriodStart = new Date(payPeriodStart);
        payroll.payPeriodEnd = new Date(payPeriodEnd);
        payroll.payPeriod = payPeriod;
        payroll.baseSalary = baseSalary;
        payroll.bonuses = bonus || 0;
        payroll.deductions = deductions || 0;
        payroll.totalAmount = totalAmount;
        payroll.permonthsalary = Number(perMonthSalary);
        payroll.paymentStatus = paymentStatus;
        payroll.paymentMethod = paymentMethod;
        yield payroll.save();
        res.status(200).json({ message: "Payroll record updated successfully", data: payroll });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.UpdatePayroll = UpdatePayroll;
const UpdatePaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { payrollId, paymentStatus } = req.body;
        if (!payrollId || !paymentStatus) {
            res.status(400).json({ message: "Payroll ID and payment status are required" });
            return;
        }
        const payroll = yield payrollModel_1.default.findById(payrollId);
        if (!payroll) {
            res.status(404).json({ message: "Payroll record not found" });
            return;
        }
        payroll.paymentStatus = paymentStatus;
        // If the payment is made, reset bonuses and deductions
        if (paymentStatus === 'Paid') {
            payroll.bonuses = 0;
            payroll.deductions = 0;
            yield payroll.save();
        }
        res.status(200).json({ message: "Payment status updated successfully", data: payroll });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.UpdatePaymentStatus = UpdatePaymentStatus;
const listEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find({ payroll: null });
        if (!users) {
            res.status(400).json({ message: 'user not found' });
            return;
        }
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.listEmployee = listEmployee;
const listallUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find({ payroll: { $ne: null } }).populate('payroll');
        if (!users) {
            res.status(400).json({ message: 'Users not found' });
            return;
        }
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.listallUsers = listallUsers;
const listspecificId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { payrollId } = req.params;
    try {
        const payrolldetails = yield payrollModel_1.default.findById(payrollId)
            .populate('employee');
        if (!payrollId) {
            res.status(400).json({ message: 'Payroll details not found' });
            return;
        }
        res.status(200).json({ employee: payrolldetails });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.listspecificId = listspecificId;
const listDepartmetentwise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { managerId } = req.params;
        console.log(managerId);
        const managerinfo = yield userModel_1.default.findById(managerId).populate('department');
        if (!managerinfo || !managerinfo.department) {
            // Handle the case where managerinfo or department is null
            throw new Error("Manager information or department not found");
        }
        const users = yield userModel_1.default.find({
            department: managerinfo.department,
            position: 'Employee'
        }).populate('payroll');
        if (!users) {
            res.status(400).json({ message: 'Users not found' });
            return;
        }
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.listDepartmetentwise = listDepartmetentwise;
const showUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield userModel_1.default.findById(userId).populate('payroll');
        console.log(user);
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.showUser = showUser;
const addPay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('update request is here');
    try {
        const { payrollId } = req.params;
        const { deduction, bonuses } = req.body;
        const payroll = yield payrollModel_1.default.findById(payrollId);
        if (!payroll) {
            res.status(400).json({ message: 'payroll details not found' });
            return;
        }
        // Updating the deduction and bonuses logic
        payroll.deductions = (payroll.deductions || 0) + Number(deduction);
        payroll.bonuses = (payroll.bonuses || 0) + Number(bonuses);
        payroll.totalAmount = payroll.totalAmount - Number(deduction) + Number(bonuses);
        yield payroll.save();
        res.status(200).json({ message: 'Payroll details Updated succesfull' });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.addPay = addPay;
const hrlisting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allpayrolldata = yield payrollModel_1.default.find().populate('employee');
        if (!allpayrolldata) {
            res.status(400).json({ message: "no payroll exist" });
            return;
        }
        res.status(200).json({ payroll: allpayrolldata });
    }
    catch (error) {
    }
});
exports.hrlisting = hrlisting;
const listdataspecific = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req is here');
        const { userId } = req.params;
        const payrolldata = yield payrollModel_1.default.findOne({ employee: userId });
        if (!payrolldata) {
            res.status(400).json({ message: 'no Payroll data found' });
            return;
        }
        res.status(200).json({ payroll: payrolldata });
    }
    catch (error) {
    }
});
exports.listdataspecific = listdataspecific;
const listViewdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUser = yield userModel_1.default.find();
        const totalUsernotpayroll = yield userModel_1.default.find({ payroll: null });
        const listView = {
            totalUser: totalUser.length,
            nopayrollUser: totalUsernotpayroll.length
        };
        res.status(200).json({ listView });
    }
    catch (error) {
    }
});
exports.listViewdata = listViewdata;
