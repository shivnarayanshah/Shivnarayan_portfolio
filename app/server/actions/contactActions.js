"use server";

import Contact from "../models/contactModel.js";
import connectDatabase from "../utils/database.js";

export const useAddContact = async (previousState, formData) => {
  const { name, email, subject, message } = Object.fromEntries(
    formData.entries()
  );
  console.log(name, email, subject, message);
  await connectDatabase();
  try {
    await Contact.create({
      name,
      email,
      subject,
      message,
    });
    return { success: true, message: "Thank You for contacting." };
  } catch (error) {
    console.log(`ContactError:${error}`);
    return { success: false, message: "Something went wrong." };
  }
};

export const useGetAllContact = async () => {
  await connectDatabase();
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return { success: true, message: "All contacts fetched", contacts };
  } catch (error) {
    return { success: false, message: "Something went wrong." };
  }
};
export const useDeleteContactById = async (id) => {
  await connectDatabase();
  try {
    const contact = await Contact.findById(id);
    if (!contact) return { success: false, message: "No contact found." };
    await Contact.findByIdAndDelete(id);
    return { success: true, message: "Contact deleted successfully." };
  } catch (error) {
    console.log(`DeleteContactError : ${error}`);
    return { success: false, message: "Something went wrong" };
  }
};

export const markAsRead = async (id) => {
  await connectDatabase();
  try {
    const contact = await Contact.findById(id);

    if (!contact) return { success: false, message: "No contact Found." };
    if (contact.read === true) {
      return { success: false, message: "Already marked as read." };
    }
    contact.read = true;

    await contact.save();

    return { success: true, message: "Marked as read" };
  } catch (error) {
    console.log(`ContactUpdateError : ${error}`);
    return { success: false, message: "Something went wrong." };
  }
};
