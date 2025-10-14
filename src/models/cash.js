import { Schema, model } from "mongoose";

const cashRegisterSchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true // ✅ asegura que solo exista una caja por día
  },
  openingAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    required: true
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  openingUser: { // quien la abrió
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  closingUser: { // quien la cerró
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  closingAmount: {
    type: Number
  },
  difference: {
    type: Number
  },
  closingDate: {
    type: Date
  }
}, { timestamps: true, versionKey: false });

export default model("CashRegister", cashRegisterSchema);