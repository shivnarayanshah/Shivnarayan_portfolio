"use server";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import connectDatabase from "../utils/database.js";

export const useLoginAction = async (previousState, formData) => {
  const { email, password } = Object.fromEntries(formData.entries());
  await connectDatabase();
  try {
    const isExist = await User.findOne({ email });
    if (!isExist) return { success: false, message: "User not found." };

    const pwdCheck = await bcrypt.compare(password, isExist.password);
    if (!pwdCheck) return { success: false, message: "Incorrect Password" };
    const token = jwt.sign(
      {
        isExist,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log(token);
    return { success: true, message: "Login successful", token };
  } catch (error) {
    console.log(`LoginError : ${error}`);
    return { success: false, message: "Something went wrong while logging" };
  }
};

export const useRegisterAction = async (previousState, formData) => {
  const { email, password } = Object.fromEntries(formData.entries());
  await connectDatabase();
  try {
    const isExist = await User.findOne({ email });
    if (isExist)
      return { success: false, message: "User already exist try loging In." };
    const hashedPwd = await bcrypt.hash(password, 12);
    await User.create({
      email,
      password: hashedPwd,
    });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.log(`RegisterationError : ${error}`);
    return { success: false, message: "Something Went wrong." };
  }
};
