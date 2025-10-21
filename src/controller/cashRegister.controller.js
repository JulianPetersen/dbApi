import CashRegister from '../models/cashRegister'

import { toUTCfromArgentina } from "../libs/dataHelper.js";

export const getCashRegisterByDate = async (req, res) => {
  try {
    const { date } = req.query;

    // 🔧 Convertimos a fecha UTC correspondiente a medianoche argentina
    const startOfDayUTC = toUTCfromArgentina(new Date(date));
    console.log("startOfDayUTC:", startOfDayUTC);

    const cashRegister = await CashRegister.findOne({ date: startOfDayUTC }).populate("openingUser", "name lastName");

    if (!cashRegister) {
      return res.status(404).json({ message: "No se encontró caja para esa fecha." });
    }

    res.status(200).json(cashRegister);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};