const winston = require('winston')

const { NODE_ENV, LOGGER } = require('../../config')

const { combine, timestamp, colorize, label, printf } = winston.format

const loggers = new winston.Container()

class Logger {
  static customFormat (info) {
    let { timestamp, level, label, message, ...meta } = info

    message = typeof message === 'object' ? JSON.stringify(message) : String(message)
    meta = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''

    return [timestamp, level, `${label}:`, message].join(' ').concat(meta)
  }

  static add (loggerName, options = {}) {
    const level = options.level || LOGGER.level
    const logger = loggers.add(loggerName, {
      format: combine(
        colorize(),
        timestamp(),
        label({ label: loggerName }),
        printf(Logger.customFormat)
      ),
      transports: [
        new winston.transports.Console({ level })
      ],
      silent: NODE_ENV === 'test'
    })

    Object.assign(logger, {
      stream: {
        write (message) {
          logger.info(message)
        }
      }
    })
  }

  static get (loggerName, options) {
    if (!loggers.has(loggerName)) {
      this.add(loggerName, options)
    }

    return loggers.get(loggerName)
  }
}

module.exports = Logger
