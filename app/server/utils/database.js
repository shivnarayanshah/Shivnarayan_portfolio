"use server";
import mongoose from "mongoose";

const connectDatabase = async () => {
  const DB_URL = process.env.MONGO_URI;

  if (!DB_URL) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }
  if (mongoose?.connections?.[0]?.readyState === 1) {
    console.log("Database already connected");
    return;
  }
  await mongoose
    .connect(DB_URL)
    .then(() => console.log("databse connected successfully."))
    .catch((error) => console.log(error.message));
};

export default connectDatabase;
