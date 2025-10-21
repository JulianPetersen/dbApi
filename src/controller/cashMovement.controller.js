import CashMovement from "../models/cashMovements.js";
import CashRegister from "../models/cashRegister.js";

// ✅ Crear un nuevo movimiento
export const createCashMovement = async (req, res) => {
  try {
    const { user, type, amount, concept, methodOfPayment } = req.body;

    // 📅 Calcular el inicio del día actual
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    // 🔍 Buscar la caja activa del día
    const cashRegister = await CashRegister.findOne({ date: startOfDay });
    if (!cashRegister) {
      return res.status(404).json({ message: "No existe caja para hoy. Debe iniciarse antes una gestión." });
    }
    if (cashRegister.isClosed) {
      return res.status(400).json({ message: "La caja del día ya está cerrada. No se pueden registrar movimientos." });
    }

    // 🧾 Crear movimiento
    const newMovement = new CashMovement({
      cashRegister: cashRegister._id,
      user,
      type,
      amount,
      concept,
      methodOfPayment
    });

    const savedMovement = await newMovement.save();

    // 🔄 Actualizar monto actual en caja
    if (type === "ingreso") {
      cashRegister.currentAmount += amount;
    } else if (type === "egreso") {
      cashRegister.currentAmount -= amount;
    }
    await cashRegister.save();

    return res.status(201).json({
      message: "Movimiento registrado correctamente.",
      movement: savedMovement,
      currentAmount: cashRegister.currentAmount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al registrar el movimiento.", error: err.message });
  }
};

// 📋 Obtener todos los movimientos del día actual
export const getTodayCashMovements = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    const cashRegister = await CashRegister.findOne({ date: startOfDay });
    if (!cashRegister) {
      return res.status(404).json({ message: "No existe caja para hoy." });
    }

    const movements = await CashMovement.find({
      cashRegister: cashRegister._id,
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    })
      .populate("user", "name lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      date: startOfDay,
      cashRegisterId: cashRegister._id,
      movements,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener movimientos.", error: err.message });
  }
};

// 🗑️ Eliminar un movimiento (solo si la caja está abierta)
export const deleteCashMovement = async (req, res) => {
  try {
    const { id } = req.params;

    const movement = await CashMovement.findById(id);
    if (!movement) return res.status(404).json({ message: "Movimiento no encontrado." });

    const cashRegister = await CashRegister.findById(movement.cashRegisterId);
    if (!cashRegister) return res.status(404).json({ message: "Caja no encontrada." });
    if (cashRegister.isClosed) return res.status(400).json({ message: "No se pueden eliminar movimientos de una caja cerrada." });

    // 🔄 Ajustar saldo de caja al eliminar
    if (movement.type === "INCOME") {
      cashRegister.currentAmount -= movement.amount;
    } else if (movement.type === "EXPENSE") {
      cashRegister.currentAmount += movement.amount;
    }

    await cashRegister.save();
    await CashMovement.findByIdAndDelete(id);

    res.status(200).json({ message: "Movimiento eliminado correctamente.", currentAmount: cashRegister.currentAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar movimiento.", error: err.message });
  }
};
