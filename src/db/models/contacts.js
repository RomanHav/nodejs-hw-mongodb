import mongoose from 'mongoose';
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: [/\S+@\S+\.\S+/, 'is invalid'], // Перевірка на валідний email
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    photo: { type: String },
  },
  { timestamps: true, versionKey: false },
);

const Contact = mongoose.model('contacts', contactSchema);

export default Contact;
