import Managment from '../models/managment.js';

export const checkIfExistManagmentByDate = async () => {
  console.log('Entrando en el método');

  // Obtenemos la hora actual en UTC
  const now = new Date();

  // Argentina está en UTC-3, así que restamos 3 horas
  const offset = 3 * 60 * 60 * 1000;

  // Calculamos medianoche local (hora Argentina)
  const localNow = new Date(now.getTime() - offset);
  const localStartOfDay = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate(), 0, 0, 0);
  const localEndOfDay = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate() + 1, 0, 0, 0);

  // Convertimos esas fechas locales de nuevo a UTC (para Mongo)
  const startOfDayUTC = new Date(localStartOfDay.getTime() + offset);
  const endOfDayUTC = new Date(localEndOfDay.getTime() + offset);

  console.log('Hora actual local:', localNow.toLocaleString());
  console.log('Rango local:', localStartOfDay.toLocaleString(), '-', localEndOfDay.toLocaleString());
  console.log('Rango UTC:', startOfDayUTC.toISOString(), '-', endOfDayUTC.toISOString());

  // Buscamos si ya existe un managment de hoy activo
  const existingManagment = await Managment.findOne({
    date: { $gte: startOfDayUTC, $lt: endOfDayUTC },
    active: true,
  }).populate('userId');

  console.log('¿Existe el managment?', existingManagment);

  return !!existingManagment;
};



export const checkIsExistManagmentActive = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

  console.log('la fecha es', now)
  // Buscar si ya existe un managment de hoy y si esta activo
  const existingManagment = await Managment.findOne({
    date: { $gte: startOfDay, $lt: endOfDay },
    active: true
  }).populate('userId')


  console.log('EXISTE?', existingManagment)
    if (existingManagment) {
      return existingManagment
    } else {
      return false
    }
}