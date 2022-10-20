import UserModel from "../../../DB/models/User.js";
import sendEmail from "../../../services/sendEmail.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Cryptr from "cryptr";

export const signUp = async (req, res) => {
  try {
    const {
      email,
      password,
      userName,
      gender,
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(403).json({ message: "Email exist" });
    } else {
      const hashedPassword = await bcrypt.hash(
        password,
        +process.env.SALT_ROUNDS
      );
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        userName,
        gender
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.SECRET, {
        expiresIn: 60 * 60,
      });
      const link = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmation/${token}`;
      const message = `  <div> To Confirm Your Account, Please <a  href= ${link}>Click Here</a> </div>`;
      sendEmail(email, message);
      res.status(201).json({ message: "Done, Please Confirm Your Account", savedUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch error", error });
  }
};

export const confirmAccount = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.SECRET);
    if (decoded && decoded.id) {
      const result = await UserModel.updateOne(
        { _id: decoded.id, confirmEmail: false },
        { confirmEmail: true }
      );
      if (result.modifiedCount) {
        res.status(202).json({ message: "Done" });
      } else {
        res.status(400).json({ message: "Already confirmed OR In-valid ID" });
      }
    } else {
      res.status(403).json({ message: "In-valid Token" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
      email,
      confirmEmail: true,
      isBlocked: false,
      isDeleted: false,
    });
    if (user) {
      const checkPassResult = await bcrypt.compare(password, user.password);
      if (checkPassResult) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.TOKENSIGNATURE,
          {
            expiresIn: 60 * 60,
          }
        );
        await UserModel.findByIdAndUpdate(
          { _id: user._id },
          { isOnline: true }
        );
        res.status(202).json({ message: "Done", token });
      } else {
        res.status(403).json({ message: "In-valid Password" });
      }
    } else {
      res.status(404).json({ message: "In-valid Email" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
