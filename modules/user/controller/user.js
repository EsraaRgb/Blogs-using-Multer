import UserModel from "../../../DB/models/User.js";
import sendEmail from "../../../services/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../../../services/cloudinary.js";

export const updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const { userName, email, gender } = req.body;
    let confirmEmail;
    if (email && email !== req.user.email) {
      const token = jwt.sign({ id: req.user._id }, process.env.SECRET, {
        expiresIn: 60 * 60,
      });
      const link = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmation/${token}`;
      const message = `  <div> To Confirm Your Changed Email, Please <a  href= ${link}>Click Here</a> </div>`;
      sendEmail(email, message);
      confirmEmail = false;
    }
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        userName,
        email,
        gender,
        confirmEmail,
      },
      { new: true }
    );
    if (user) {
      res.status(202).json({ message: "Done", user });
    } else {
      res.status(404).json({ message: "wrong user id" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch error", error });
  }
};
export const addProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "please upload an image" });
    } else {
      const image = await cloudinary.uploader.upload(req.file.path, {
        folder: "user/profilePic",
      });
      await UserModel.updateOne(
        { _id: req.user._id },
        { profilePic: image.secure_url }
      );
      res.status(201).json({ message: "Done" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const addCoverPics = async (req, res) => {
  try {
    if (!req.files) {
      res.status(400).json({ message: "please upload an image" });
    } else {
      req.files.forEach(async (file) => {
        const image = await cloudinary.uploader.upload(file.path, {
          folder: "user/profilePic",
        });
        await UserModel.updateOne(
          { _id: req.user._id },
          { $addToSet: { coverPics: image.secure_url } }
        );
      });
      res.status(201).json({ message: "Done" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({gender:'male'}).select('email')
    res.status(200).json({users});
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const softDeleteProfile = async (req, res) => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      { isDeleted: true },
      { new: true }
    );
    if (result) {
      res.status(202).json({ message: "Done", result });
    } else {
      res.status(404).json({ message: "wrong user id" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
