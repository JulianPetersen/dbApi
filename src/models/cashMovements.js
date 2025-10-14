const cashMovementSchema = new Schema({
  cashRegister: {
    type: Schema.Types.ObjectId,
    ref: "CashRegister",
    required: true
  },
  user: { // el empleado que hizo el movimiento
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["entrada", "salida"],
    required: true
  },
  concept: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, { timestamps: true, versionKey: false });
