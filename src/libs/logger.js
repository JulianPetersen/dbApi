// src/utils/logger.js
import winston from 'winston';
import 'winston-mongodb';

const { combine, timestamp, printf, errors } = winston.format;

// Formato para mostrar en consola
const customFormat = printf(({ level, message, timestamp, stack, email }) => {
  return `${timestamp} [${level}] : ${stack || message} ${email ? `(User: ${email})` : ''}`;
});

// Un formato que "extrae" email de metadata
const enrichFormat = winston.format((info) => {
  if (info.metadata && info.metadata.email) {
    info.email = info.metadata.email;
  }
  return info;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }), 
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }),
    enrichFormat(), // Enriquecemos el log con el email al tope
    customFormat
  ),
  transports: [
    new winston.transports.MongoDB({
      db: 'mongodb://localhost/recetivaDB',
      collection: 'logs',
      level: 'info',

      format: combine(
        timestamp(),
        errors({ stack: true }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }),
        enrichFormat(),
        winston.format.json()
      )
    })
  ],
  exceptionHandlers: [
    new winston.transports.MongoDB({
      db: 'mongodb://localhost/recetivaDB',
      collection: 'exceptions',

      format: combine(
        timestamp(),
        errors({ stack: true }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }),
        enrichFormat(),
        winston.format.json()
      )
    })
  ],
  rejectionHandlers: [
    new winston.transports.MongoDB({
      db: 'mongodb://localhost/recetivaDB',
      collection: 'rejections',

      format: combine(
        timestamp(),
        errors({ stack: true }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }),
        enrichFormat(),
        winston.format.json()
      )
    })
  ]
});

// Mostrar en consola solo si estás en desarrollo
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      timestamp(),
      errors({ stack: true }),
      winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }),
      enrichFormat(),
      customFormat
    )
  }));
}

export default logger;