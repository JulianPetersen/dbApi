// dateHelper.js

/**
 * Convierte una fecha UTC a hora Argentina (GMT-3)
 * @param {Date} dateUTC - Fecha en UTC
 * @returns {Date} - Fecha ajustada a Argentina (local)
 */
export const toArgentinaTime = (dateUTC) => {
  const offset = 3 * 60 * 60 * 1000; // UTC-3
  return new Date(dateUTC.getTime() - offset);
};

/**
 * Convierte una fecha local Argentina a UTC (para guardar en Mongo)
 * @param {Date} localDate - Fecha local Argentina
 * @returns {Date} - Fecha en UTC
 */
export const toUTCfromArgentina = (localDate) => {
  const offset = 3 * 60 * 60 * 1000;
  return new Date(localDate.getTime() + offset);
};

/**
 * Calcula la diferencia en horas entre dos fechas
 * @param {Date} startDate - Fecha inicial
 * @param {Date} endDate - Fecha final
 * @param {number} decimals - Cantidad de decimales para redondear
 * @returns {number} - Diferencia en horas, redondeada
 */
export const diffHours = (startDate, endDate, decimals = 2) => {
  const diffMs = endDate - startDate;
  const hours = diffMs / (1000 * 60 * 60);
  return Math.round(hours * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Obtiene el inicio y fin del día en UTC según hora Argentina
 * @param {Date} referenceDate - Fecha de referencia (puede ser now)
 * @returns {{startUTC: Date, endUTC: Date}}
 */
export const getArgentinaDayRange = (referenceDate = new Date()) => {
  const offset = 3 * 60 * 60 * 1000;
  const localNow = new Date(referenceDate.getTime() - offset);

  const startLocal = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate(), 0, 0, 0);
  const endLocal = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate() + 1, 0, 0, 0);

  return {
    startUTC: new Date(startLocal.getTime() + offset),
    endUTC: new Date(endLocal.getTime() + offset),
  };
};
