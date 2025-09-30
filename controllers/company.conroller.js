import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

// ✅ Register Company
export const registerCompany = async (req, res) => {
  try {
    if (!req.id) {
      return res.status(401).json({
        message: "Unauthorized: Please log in",
        success: false,
      });
    }

    const { companyName } = req.body;
    if (!companyName || companyName.trim() === "") {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    let companyExists = await Company.findOne({ name: companyName.trim() });
    if (companyExists) {
      return res.status(400).json({
        message: "You can't register the same company twice",
        success: false,
      });
    }

    const company = await Company.create({
      name: companyName.trim(),
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.error("Register Company Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ✅ Get Companies by User ID
export const getCompany = async (req, res) => {
  try {
    if (!req.id) {
      return res.status(401).json({
        message: "Unauthorized: Please log in",
        success: false,
      });
    }

    let companies = await Company.find({ userId: req.id });
    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "No companies found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    //console.error("Get Company Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ✅ Get Company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received companyId:", id);
    // ✅ Check if companyId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid companyId format:", id);
      return res
        .status(400)
        .json({ success: false, message: "Invalid company ID" });
    }
    let company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    //console.log("✅ Found company:", company.name);

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Get Company By ID Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ✅ Update Company Details
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    let updateData = { name, description, website, location };

    // Handle logo upload if a file is provided
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      updateData.logo = cloudResponse.secure_url;
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.error("Update Company Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
