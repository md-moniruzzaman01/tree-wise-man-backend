'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.logger = exports.errorlogger = void 0
/* eslint-disable no-undef */
const path_1 = __importDefault(require('path'))
const winston_1 = require('winston')
const winston_daily_rotate_file_1 = __importDefault(
  require('winston-daily-rotate-file'),
)
const { combine, timestamp, label, printf } = winston_1.format
// Custom Log Format
const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp)
  const hour = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${message}`
})
// Determine the log directory based on the environment
const logDir =
  process.env.LOG_DIR || path_1.default.join(process.cwd(), 'logs', 'winston')
const successLogDir = path_1.default.join(logDir, 'successes')
const errorLogDir = path_1.default.join(logDir, 'errors')
// Ensure the log directories exist (synchronously)
const fs_1 = __importDefault(require('fs'))
if (!fs_1.default.existsSync(successLogDir)) {
  fs_1.default.mkdirSync(successLogDir, { recursive: true })
}
if (!fs_1.default.existsSync(errorLogDir)) {
  fs_1.default.mkdirSync(errorLogDir, { recursive: true })
}
const logger = (0, winston_1.createLogger)({
  level: 'info',
  format: combine(label({ label: 'tree-wise-man' }), timestamp(), myFormat),
  transports: [
    new winston_1.transports.Console(),
    new winston_daily_rotate_file_1.default({
      filename: path_1.default.join(successLogDir, 'phu-%DATE%-success.log'),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
})
exports.logger = logger
const errorlogger = (0, winston_1.createLogger)({
  level: 'error',
  format: combine(label({ label: 'tree-wise-man' }), timestamp(), myFormat),
  transports: [
    new winston_1.transports.Console(),
    new winston_daily_rotate_file_1.default({
      filename: path_1.default.join(errorLogDir, 'phu-%DATE%-error.log'),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
})
exports.errorlogger = errorlogger
