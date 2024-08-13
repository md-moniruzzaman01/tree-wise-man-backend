import { Server } from 'http'

import app from './app'
import config from './config'
import { errorlogger, logger } from './shared/logger'
process.on('uncaughtException', error => {
  errorlogger.error(error)
  process.exit(1)
})

let server: Server
async function bootstrap() {
  server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
    logger.info(`Server running on port ${config.port}`)
  })
  // server = app.listen(5000, '0.0.0.0', () => {
  //   console.log(`Application listening on port ${config.port}`)
  // })
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed')
      })
    }
    process.exit(1)
  }

  const unexpectedErrorHandler = (error: unknown) => {
    console.error('Unexpected error:', error)
    errorlogger.error(error)
    exitHandler()
  }

  process.on('uncaughtException', unexpectedErrorHandler)
  process.on('unhandledRejection', unexpectedErrorHandler)

  // process.on('SIGTERM', () => {
  //   logger.info('SIGTERM received');
  //   if (server) {
  //     server.close();
  //   }
  // });
}

bootstrap()
