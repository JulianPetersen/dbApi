  import Managment from '../models/managment'
  import { checkIfExistManagmentByDate,checkIsExistManagmentActive } from '../services/managment'
  import { diffHours, getArgentinaDayRange,toUTCfromArgentina,toArgentinaTime } from '../libs/dataHelper'
  import CashRegister from "../models/cashRegister.js";

  export const createManagment = async (req, res) => {
  try {
    // 🕵️‍♂️ Verificar si ya existe una gestión activa hoy
    const existManagmentActive = await checkIsExistManagmentActive();

    if (existManagmentActive) {
      return res.status(400).json({
        message: `Ya existe una gestión activa y pertenece a ${existManagmentActive.userId.name} ${existManagmentActive.userId.lastName}. Debe cerrarse esa gestión para poder comenzar otra.`
      });
    }

    // 🕓 Fecha y hora actual
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const { userId, active } = req.body;

    // 💰 Verificar si ya existe una caja para hoy
    let existingCashRegister = await CashRegister.findOne({ date: startOfDay });
    let isNewCashRegister = false; // 👈 bandera para saber si la caja fue creada ahora

    // 📦 Si no existe, crear una nueva caja
    if (!existingCashRegister) {
      existingCashRegister = new CashRegister({
        date: startOfDay,
        openingAmount: 0,
        currentAmount: 0,
        openingUser: userId,
        isClosed: false
      });
      await existingCashRegister.save();
      isNewCashRegister = true;
    }

    // 🧾 Crear la gestión (turno)
    const newManagment = new Managment({
      userId,
      startTime: now,
      date: startOfDay,
      active
    });

    const managmentSaved = await newManagment.save();

    // 📤 Responder con mensaje correcto según el flujo
    return res.status(200).json({
      managmentSaved,
      message: isNewCashRegister
        ? 'Es la primera gestión del día. Se comenzó una caja nueva.'
        : 'Gestión iniciada (ya existía caja del día).',
      cashRegister: existingCashRegister
    });

  } catch (err) {
    console.error('Error en createManagment:', err);
    return res.status(400).json({ message: err.message });
  }
};


export const getAllManagments = async (req, res) => {
  try {
    const allManagments = await Managment.find().populate('userId');

    const result = [];

    for (const m of allManagments) {
      // Convertimos las fechas una por una
      const managmentObject = m.toObject();

      if (m.startTime) managmentObject.startTime = toArgentinaTime(m.startTime);
      if (m.endTime) managmentObject.endTime = toArgentinaTime(m.endTime);
      if (m.date) managmentObject.date = toArgentinaTime(m.date);
      if (m.createdAt) managmentObject.createdAt = toArgentinaTime(m.createdAt);
      if (m.updatedAt) managmentObject.updatedAt = toArgentinaTime(m.updatedAt);

      // Agregamos el objeto convertido al array final
      result.push(managmentObject);
    }

    res.status(200).json(result);

  } catch (error) {
    console.error('❌ Error en getAllManagments:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getManagmentById = async (req, res) => {
  console.log(req.params.id)
  try {
    const managment = await Managment.findById(req.params.id)
    managment.startTime= toArgentinaTime(managment.startTime)
    managment.date = toArgentinaTime(managment.date)
    res.status(200).json(managment)
  } catch (error) {
    res.status(400).json(error)
  }
}

export const deleteManagment = async (req, res) => {
  try {
    const managmentDeleted = await Managment.findByIdAndDelete(req.params.id)
    res.status(200).json({ res: 'Gestion Eliminada' })
  } catch (error) {
    res.status(400).json({ error })
  }

}


export const closeManagment = async (req, res) => {
  const userId = req.userId;

  try {
    const { startUTC, endUTC } = getArgentinaDayRange();

    const existingManagment = await Managment.findOne({
      userId,
      startTime: { $gte: startUTC, $lt: endUTC },
      active: true,
    });

    if (!existingManagment) {
      return res.status(404).json({ message: 'No se encontró managment activo para hoy' });
    }

    const nowUTC = new Date();
    const totalHours = diffHours(existingManagment.startTime, nowUTC, 2);

    const editedManagment = await Managment.findByIdAndUpdate(
      existingManagment._id,
      {
        active: false,
        endTime: nowUTC,
        totalHours,
      },
      { new: true }
    );

    res.status(200).json({ editedManagment });

  } catch (err) {
    res.status(500).json({ err });
  }
};

