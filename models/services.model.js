import mongoose from "mongoose";
const { Schema } = mongoose;

const newPath = new Schema({
  uuid: {
    type: String,
    required: true,
  },
  pathnames: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const newPathSchema = mongoose.model("pathnames", newPath);
