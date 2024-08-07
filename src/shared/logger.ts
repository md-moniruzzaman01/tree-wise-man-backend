/* eslint-disable no-undef */
import path from 'path'
import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
const { combine, timestamp, label, printf } = format

// Custom Log Format
const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp)
  const hour = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${message}`
})

// Determine the log directory based on the environment
const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs', 'winston')
const successLogDir = path.join(logDir, 'successes')
const errorLogDir = path.join(logDir, 'errors')

// Ensure the log directories exist (synchronously)
import fs from 'fs'
if (!fs.existsSync(successLogDir)) {
  fs.mkdirSync(successLogDir, { recursive: true })
}
if (!fs.existsSync(errorLogDir)) {
  fs.mkdirSync(errorLogDir, { recursive: true })
}

const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'tree-wise-man' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(successLogDir, 'phu-%DATE%-success.log'),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
})

const errorlogger = createLogger({
  level: 'error',
  format: combine(label({ label: 'tree-wise-man' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(errorLogDir, 'phu-%DATE%-error.log'),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
})

export { errorlogger, logger }
