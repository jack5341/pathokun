import mongoose from "mongoose";
const { Schema } = mongoose;

const Signup = new Schema({
  uuid: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 1,
  },
  date: { type: Date, default: Date.now },
});

export const SignupSchema = mongoose.model("authentications", Signup);
