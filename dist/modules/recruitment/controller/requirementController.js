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
exports.updataJonlist = exports.getUserData = exports.deleteJobapplications = exports.listspecific = exports.listIReq = exports.referJob = exports.deleteItem = exports.listrquirements = exports.createRecruitment = void 0;
const recruitementMode_1 = __importDefault(require("../model/recruitementMode"));
const JobReferral_1 = __importDefault(require("../model/JobReferral"));
const createRecruitment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received data:', req.body);
    try {
        // Extract job post data from the request body
        const { jobTitle, role, department, jobDescription, requirements, responsibilities, location, employmentType, salaryRange, applicationProcess, contactEmail, contactPhone, applicationDeadline, eligibility, } = req.body;
        // Basic validation
        if (!jobTitle || !role || !department || !jobDescription || !requirements || !responsibilities || !location || !employmentType || !salaryRange || !applicationProcess || !contactEmail || !contactPhone || !applicationDeadline || !eligibility) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }
        // Create a new job post instance
        const newJobPost = new recruitementMode_1.default({
            jobTitle,
            role,
            department,
            jobDescription,
            requirements,
            responsibilities,
            location,
            employmentType,
            salaryRange,
            applicationProcess,
            contactEmail,
            contactPhone,
            applicationDeadline: new Date(applicationDeadline), // Ensure this is saved as a Date object
            eligibilityCriteria: eligibility,
        });
        // Save the job post to the database
        yield newJobPost.save();
        // Respond with success
        res.status(201).json({ message: 'Job post created successfully', jobPost: newJobPost });
    }
    catch (error) {
        // Handle errors
        console.error('Error creating job post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.createRecruitment = createRecruitment;
const listrquirements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listingReq = yield recruitementMode_1.default.find();
        if (!listingReq) {
            res.status(400).json({ message: 'No Job Listing found' });
            return;
        }
        res.status(200).json({ listingData: listingReq });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.listrquirements = listrquirements;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listId } = req.params;
        const deletedData = yield recruitementMode_1.default.findByIdAndDelete(listId);
        if (!deletedData) {
            res.status(400).json({ message: 'unaible to delete' });
            return;
        }
        res.status(200).json({ message: 'deleted succesefull' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.deleteItem = deleteItem;
const referJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, email, phone, address, qualifications, portfolio, referer, jobId } = req.body;
        const resumeUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path; // Cloudinary file URL
        console.log('Resume URL:', resumeUrl);
        // Create a new job referral entry in the database
        const jobReferral = new JobReferral_1.default({
            name,
            email,
            phone,
            address,
            qualifications,
            portfolio,
            referer,
            resume: resumeUrl,
            jobId
        });
        yield jobReferral.save();
        res.status(200).json({
            message: 'Job referred successfully'
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error referring job', error });
    }
});
exports.referJob = referJob;
const listIReq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listData = yield JobReferral_1.default.find().populate('referer').populate('jobId');
        if (!listData) {
            res.status(400).json({ message: "No Job Listing found" });
            return;
        }
        // console.log('here is the data',listData);
        res.status(200).json({ listData });
    }
    catch (error) {
        res.status(500).json({ message: 'Error listing job', error });
    }
});
exports.listIReq = listIReq;
const listspecific = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reqId } = req.params;
        const listDetail = yield JobReferral_1.default.findById(reqId).populate('jobId').populate('referer');
        if (!listDetail) {
            res.status(400).json({ message: 'No data found' });
            return;
        }
        res.status(200).json({ listDetail });
    }
    catch (error) {
        res.status(500).json({ message: 'Error listing job', error });
    }
});
exports.listspecific = listspecific;
const deleteJobapplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicationId } = req.params;
        console.log('delete req is here');
        const applicationdata = yield JobReferral_1.default.findByIdAndDelete(applicationId);
        if (!applicationdata) {
            res.status(400).json({ message: 'no application found' });
            return;
        }
        res.status(200).json({ message: 'application deleted successfully' });
    }
    catch (error) {
    }
});
exports.deleteJobapplications = deleteJobapplications;
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        const listingdata = yield recruitementMode_1.default.findById(jobId);
        if (!listingdata) {
            res.status(400).json({ message: 'listig data not found' });
            return;
        }
        res.status(200).json({ listdata: listingdata });
    }
    catch (error) {
    }
});
exports.getUserData = getUserData;
const updataJonlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        const { id, jobTitle, role, department, jobDescription, requirements, responsibilities, location, employmentType, salaryRange, applicationProcess, contactEmail, contactPhone, applicationDeadline, eligibility } = req.body;
        if (!jobId) {
            res.status(400).json({ message: 'Job ID is required' });
            return;
        }
        const updatedJob = yield recruitementMode_1.default.findByIdAndUpdate(jobId, {
            jobTitle,
            role,
            department,
            jobDescription,
            requirements,
            responsibilities,
            location,
            employmentType,
            salaryRange,
            applicationProcess,
            contactEmail,
            contactPhone,
            applicationDeadline,
            eligibility
        }, { new: true } // Return the updated document
        );
        if (!updatedJob) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
    }
    catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updataJonlist = updataJonlist;
