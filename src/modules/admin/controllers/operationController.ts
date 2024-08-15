import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../../employee/models/userModel";

export const getAllmanager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const managers = await User.find({
      position: "Manager",
      projectAssigned: false,
    });
    if (managers.length === 0) {
      res.status(400).json({ message: "Manager Not Found" });
      return;
    }
    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching manager" });
  }
};

export const getAvilableempo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const unassignedEmployees = await User.find({
      position: "Employee",
      projectAssigned: false,
    });
    if (unassignedEmployees.length === 0) {
      res.status(400).json({ message: "unAssigned Employees are not found" });
      return;
    }
    res.status(200).json(unassignedEmployees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unassigned employees" });
  }
};
