import { Schema, model, models, type Model, type Types } from "mongoose";

export interface ContactMessageDocument {
  _id: Types.ObjectId;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<ContactMessageDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    subject: { type: String, trim: true, maxlength: 160, default: "Portfolio enquiry" },
    message: { type: String, required: true, trim: true, maxlength: 5_000 },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false },
);

ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ read: 1, createdAt: -1 });

export const ContactMessage: Model<ContactMessageDocument> =
  (models.ContactMessage as Model<ContactMessageDocument> | undefined) ??
  model<ContactMessageDocument>("ContactMessage", ContactMessageSchema);
