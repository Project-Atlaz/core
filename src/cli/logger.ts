import winston from 'winston';
import 'winston-daily-rotate-file';
import chalk from 'chalk';

const transportConsole = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
});

const transportFile = new winston.transports.DailyRotateFile({
  filename: 'atlas-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  dirname: 'logs',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [transportConsole, transportFile],
});

export const log = {
  info: (message: string) => logger.info(chalk.white(message)),
  warn: (message: string) => logger.warn(chalk.white(message)),
  error: (message: string) => logger.error(chalk.white(message)),
  success: (message: string) => logger.info(chalk.green(message)),
};

export default logger;
