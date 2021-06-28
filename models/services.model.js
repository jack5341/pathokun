import mongoose from "mongoose";
const { Schema } = mongoose;

const newPoint = new Schema({
  endpoint: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const endPointSchema = mongoose.model("endpoints", newPoint);
